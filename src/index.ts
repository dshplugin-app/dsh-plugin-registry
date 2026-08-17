import type { Context } from '@deepseek-ai/cordis';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { PLUGIN_VERSION } from './version.ts';

export const name = 'dsh-plugin-registry';

const DEFAULT_API_BASE = 'https://api.dshplugin.app';
const ROUTE_PREFIX = '/dsh-plugin-registry';
const UPSTREAM_TIMEOUT_MS = 15_000;

interface WebServerService {
  register(route: {
    kind: 'exact' | 'prefix';
    path: string;
    handler: (
      request: IncomingMessage,
      response: ServerResponse
    ) => void | Promise<void>;
  }): () => void;
}

interface RegistryHost {
  webServer: WebServerService;
  effect(
    callback: () => (() => void | Promise<void>),
    label: string
  ): void;
}

function apiBase(): string {
  const override = process.env.DSH_PLUGIN_REGISTRY_API_BASE?.trim();
  return (override || DEFAULT_API_BASE).replace(/\/$/, '');
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
  head = false
): void {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(head ? undefined : JSON.stringify(body));
}

async function proxyRegistryRequest(
  request: IncomingMessage,
  response: ServerResponse,
  upstreamPath: '/v1/catalog' | '/v1/plugins'
): Promise<void> {
  const method = request.method ?? 'GET';
  const head = method === 'HEAD';
  if (method !== 'GET' && method !== 'HEAD') {
    response.setHeader('allow', 'GET, HEAD');
    sendJson(
      response,
      405,
      {
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Only GET and HEAD are supported.',
        },
      },
      head
    );
    return;
  }

  const localUrl = new URL(request.url ?? '/', 'http://localhost');

  try {
    const upstreamUrl = new URL(upstreamPath, `${apiBase()}/`);
    if (upstreamPath === '/v1/plugins') {
      upstreamUrl.search = localUrl.search;
    }
    const upstream = await fetch(upstreamUrl, {
      method,
      headers: {
        accept: 'application/json',
        'x-dsh-registry-client': 'plugin',
        'x-dsh-registry-version': PLUGIN_VERSION,
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const headers: Record<string, string> = {
      'content-type': upstream.headers.get('content-type') ??
        'application/json; charset=utf-8',
      'cache-control': upstream.headers.get('cache-control') ?? 'no-store',
      'x-content-type-options': 'nosniff',
    };
    const etag = upstream.headers.get('etag');
    if (etag) headers.etag = etag;

    if (head) {
      response.writeHead(upstream.status, headers);
      response.end();
      return;
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(upstream.status, headers);
    response.end(body);
  } catch (error) {
    console.warn('[dsh-plugin-registry] Registry API request failed', error);
    sendJson(
      response,
      502,
      {
        error: {
          code: 'REGISTRY_API_UNAVAILABLE',
          message: 'DSH Plugin Registry API is temporarily unavailable.',
        },
      },
      head
    );
  }
}

function mountRoutes(host: RegistryHost): () => void {
  const disposers = [
    host.webServer.register({
      kind: 'exact',
      path: `${ROUTE_PREFIX}/catalog`,
      handler: (request, response) =>
        proxyRegistryRequest(request, response, '/v1/catalog'),
    }),
    host.webServer.register({
      kind: 'exact',
      path: `${ROUTE_PREFIX}/plugins`,
      handler: (request, response) =>
        proxyRegistryRequest(request, response, '/v1/plugins'),
    }),
  ];

  return () => {
    for (const dispose of disposers.reverse()) dispose();
  };
}

export function apply(ctx: Context): void {
  ctx.inject(['webServer'], (hostContext: Context) => {
    const host = hostContext as unknown as RegistryHost;
    host.effect(
      () => mountRoutes(host),
      'dsh-plugin-registry: Registry API proxy routes'
    );
  });
}
