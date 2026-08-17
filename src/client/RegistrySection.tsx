import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Button,
  IconChevronDownOutline14,
  IconSearchOutline16,
  Input,
  Menu,
  Pill,
  writeClipboard,
  type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives';
import type {
  CatalogResponse,
  PluginListItem,
  PluginListResponse,
  RegistrySort,
  Translate,
} from './types.ts';

interface LocaleService {
  subscribe(callback: () => void): () => void;
  getSnapshot(): { active: string };
}

const PAGE_SIZE = 24;
const CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  vision: { en: 'Vision', zh: '视觉与图像' },
  'ui-productivity': { en: 'UI & Productivity', zh: 'UI 与效率' },
  terminal: { en: 'Terminal & TUI', zh: '终端与 TUI' },
  'developer-tools': { en: 'Developer Tools', zh: '开发者工具' },
  'browser-web': { en: 'Browser & Web', zh: '浏览器与 Web' },
  'security-policy': { en: 'Security & Policy', zh: '安全与策略' },
  'skills-workflows': { en: 'Skills & Workflow', zh: '技能与工作流' },
  'remote-execution': { en: 'Remote Execution', zh: '远程执行' },
};

function useDebouncedValue(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function useActiveLocale(locale: LocaleService): string {
  return useSyncExternalStore(
    (callback) => locale.subscribe(callback),
    () => locale.getSnapshot().active,
    () => 'en'
  );
}

function compactNumber(value: number | undefined): string {
  if (value === undefined) return '—';
  if (value < 1_000) return String(value);
  if (value < 1_000_000) {
    const compact = Math.round((value / 1_000) * 10) / 10;
    return `${compact.toLocaleString('en-US')}k`;
  }
  const compact = Math.round((value / 1_000_000) * 10) / 10;
  return `${compact.toLocaleString('en-US')}m`;
}

function registryUrl(zh: boolean): string {
  return zh
    ? 'https://dshplugin.app/zh/plugins?ref=dsh-plugin'
    : 'https://dshplugin.app/plugins?ref=dsh-plugin';
}

function detailUrl(plugin: PluginListItem, zh: boolean): string {
  const slug = encodeURIComponent(plugin.slug);
  return zh
    ? `https://dshplugin.app/zh/plugins/${slug}?ref=dsh-plugin`
    : `https://dshplugin.app/plugins/${slug}?ref=dsh-plugin`;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { accept: 'application/json' },
    signal,
  });
  const data = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | T
    | null;
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? data.error?.message
        : undefined;
    throw new Error(message || `HTTP ${response.status}`);
  }
  return data as T;
}

function listUrl(
  query: string,
  category: string,
  sort: RegistrySort,
  cursor?: string
): string {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set('q', trimmed);
  if (category) params.set('category', category);
  params.set('sort', sort);
  params.set('limit', String(PAGE_SIZE));
  if (cursor) params.set('cursor', cursor);
  return `/dsh-plugin-registry/plugins?${params.toString()}`;
}

function statusLabel(plugin: PluginListItem, t: Translate): string {
  if (plugin.repositoryAvailability === 'unavailable') return t('repositoryUnavailable');
  if (plugin.repositoryAvailability === 'archived') return t('archived');
  if (plugin.registryStatus === 'runtime-verified') return t('runtimeStatus');
  if (plugin.registryStatus === 'manifest-valid') return t('manifestStatus');
  return t('indexedStatus');
}

function statusTone(plugin: PluginListItem): 'success' | 'warning' {
  return plugin.repositoryAvailability === 'active' ? 'success' : 'warning';
}

function categoryLabel(slug: string, fallback: string, zh: boolean): string {
  const known = CATEGORY_LABELS[slug];
  return known ? (zh ? known.zh : known.en) : fallback;
}

function severityLabel(
  severity: PluginListItem['security']['highestSeverity'],
  t: Translate
): string | undefined {
  if (!severity) return undefined;
  const key: Record<NonNullable<PluginListItem['security']['highestSeverity']>, string> = {
    info: 'severityInfo',
    low: 'severityLow',
    medium: 'severityMedium',
    high: 'severityHigh',
    critical: 'severityCritical',
  };
  return t(key[severity]);
}

function securitySummary(plugin: PluginListItem, t: Translate): string {
  if (plugin.security.signalCount <= 0) return t('noSignals');
  const severity = severityLabel(plugin.security.highestSeverity, t);
  const base = `${plugin.security.signalCount} ${t('signals')}`;
  return severity ? `${base} · ${t('highest')}: ${severity}` : base;
}

function compatibilitySummary(plugin: PluginListItem, t: Translate): string {
  const compatibility = plugin.compatibility;
  if (!compatibility.hasEvidence) return t('noCompatibilityEvidence');

  let status = t('compatibilityRecorded');
  if (compatibility.latestStatus === 'passed') status = t('compatibilityPassed');
  if (compatibility.latestStatus === 'partial') status = t('compatibilityPartial');
  if (compatibility.latestStatus === 'failed') status = t('compatibilityFailed');

  return compatibility.dshVersion
    ? `${status} · DSH ${compatibility.dshVersion}`
    : status;
}

function evidenceTone(plugin: PluginListItem, kind: 'security' | 'compatibility'): string {
  if (kind === 'security') {
    return plugin.security.highestSeverity === 'high' ||
      plugin.security.highestSeverity === 'critical'
      ? 'warning'
      : 'neutral';
  }
  if (!plugin.compatibility.hasEvidence) return 'neutral';
  if (plugin.compatibility.latestStatus === 'failed') return 'warning';
  if (plugin.compatibility.latestStatus === 'partial') return 'partial';
  if (plugin.compatibility.latestStatus === 'passed') return 'success';
  return 'neutral';
}

function PluginGlyph() {
  return (
    <span className="dshr-plugin-glyph" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2.6 18.2 6.7v8.6L11 19.4 3.8 15.3V6.7L11 2.6Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="m4.2 6.9 6.8 4 6.8-4M11 11v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ShieldGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.8 14.5 4v4.3c0 3.7-2.3 6.4-5.5 7.9-3.2-1.5-5.5-4.2-5.5-7.9V4L9 1.8Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
      <path d="m6.6 8.9 1.5 1.5 3.4-3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompatibilityGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M6.6 3.2a2.4 2.4 0 1 1 4.8 0v1.2h2.2v2.2h1.2a2.4 2.4 0 1 1 0 4.8h-1.2v2.2h-2.2v1.2a2.4 2.4 0 1 1-4.8 0v-1.2H4.4v-2.2H3.2a2.4 2.4 0 1 1 0-4.8h1.2V4.4h2.2V3.2Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function PluginCard({
  plugin,
  catalog,
  zh,
  t,
}: {
  plugin: PluginListItem;
  catalog: CatalogResponse | null;
  zh: boolean;
  t: Translate;
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (copyTimer.current !== undefined) window.clearTimeout(copyTimer.current);
    },
    []
  );

  const copyCommand = useCallback(async () => {
    if (!plugin.installCommand) return;
    const copied = await writeClipboard(plugin.installCommand);
    setCopyState(copied ? 'copied' : 'failed');
    if (copyTimer.current !== undefined) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 1_500);
  }, [plugin.installCommand]);

  const fallbackCategories = catalog?.categories ?? [];
  const categoryTags = plugin.categories.slice(0, 3).map((slug) => {
    const fallback = fallbackCategories.find((item) => item.slug === slug)?.label ?? slug;
    return { slug, label: categoryLabel(slug, fallback, zh) };
  });
  if (categoryTags.length === 0 && plugin.pluginType) {
    categoryTags.push({ slug: `type:${plugin.pluginType}`, label: plugin.pluginType });
  }

  const securityText = securitySummary(plugin, t);
  const compatibilityText = compatibilitySummary(plugin, t);
  const cardStatusTone = statusTone(plugin);

  return (
    <article className="dshr-card">
      <div className="dshr-card-header">
        <div className="dshr-card-identity">
          <PluginGlyph />
          <div className="dshr-card-title-copy">
            <div className="dshr-name-row">
              <h3 className="dshr-name">{plugin.name}</h3>
              <span className="dshr-stars">★ {compactNumber(plugin.stars)}</span>
            </div>
            <div className="dshr-repo">{plugin.repository}</div>
          </div>
        </div>
        <span className="dshr-status" data-tone={cardStatusTone}>
          <span className="dshr-status-dot" aria-hidden="true" />
          {statusLabel(plugin, t)}
        </span>
      </div>

      <p className="dshr-desc">
        {zh ? plugin.description.zh || plugin.description.en : plugin.description.en}
      </p>

      <div className="dshr-evidence-grid">
        <div className="dshr-evidence-card" data-tone={evidenceTone(plugin, 'security')}>
          <span className="dshr-evidence-icon"><ShieldGlyph /></span>
          <div className="dshr-evidence-copy">
            <span className="dshr-evidence-label">{t('security')}</span>
            <strong className="dshr-evidence-value">{securityText}</strong>
          </div>
        </div>
        <div className="dshr-evidence-card" data-tone={evidenceTone(plugin, 'compatibility')}>
          <span className="dshr-evidence-icon"><CompatibilityGlyph /></span>
          <div className="dshr-evidence-copy">
            <span className="dshr-evidence-label">{t('compatibility')}</span>
            <strong className="dshr-evidence-value">{compatibilityText}</strong>
          </div>
        </div>
      </div>

      {plugin.installCommand ? (
        <div className="dshr-command">
          <code>$ {plugin.installCommand}</code>
          <Button variant="outline" size="sm" type="button" onClick={() => void copyCommand()}>
            {copyState === 'copied'
              ? t('copied')
              : copyState === 'failed'
                ? t('copyFailed')
                : t('copy')}
          </Button>
        </div>
      ) : (
        <div className="dshr-command dshr-command-empty">{t('noInstall')}</div>
      )}

      <div className="dshr-card-footer">
        <div className="dshr-card-tags" aria-label={t('categories')}>
          {categoryTags.map((tag) => (
            <Pill className="dshr-card-tag" key={tag.slug}>{tag.label}</Pill>
          ))}
        </div>
        <a
          className="dshr-details"
          href={detailUrl(plugin, zh)}
          target="_blank"
          rel="noreferrer"
        >
          <span>{t('fullDetails')}</span>
          <span className="dshr-details-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="dshr-skeleton-list" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div className="dshr-skeleton-card" key={item}>
          <div className="dshr-skeleton-title" />
          <div className="dshr-skeleton-line dshr-skeleton-line-wide" />
          <div className="dshr-skeleton-line" />
          <div className="dshr-skeleton-evidence">
            <span />
            <span />
          </div>
          <div className="dshr-skeleton-command" />
        </div>
      ))}
    </div>
  );
}

export function RegistrySection({
  t,
  locale,
}: {
  t: Translate;
  locale: LocaleService;
}) {
  const activeLocale = useActiveLocale(locale);
  const zh = activeLocale.toLowerCase().startsWith('zh');
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<RegistrySort>('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [items, setItems] = useState<PluginListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const effectiveSort: RegistrySort =
    debouncedQuery.trim() || sort !== 'relevance' ? sort : 'popular';
  const requestKey = `${debouncedQuery}\u0000${category}\u0000${effectiveSort}`;
  const requestKeyRef = useRef(requestKey);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [filterCanScrollLeft, setFilterCanScrollLeft] = useState(false);
  const [filterCanScrollRight, setFilterCanScrollRight] = useState(false);
  requestKeyRef.current = requestKey;

  const updateFilterScrollState = useCallback(() => {
    const node = filterScrollRef.current;
    if (!node) return;
    const maxScrollLeft = Math.max(0, node.scrollWidth - node.clientWidth);
    setFilterCanScrollLeft(node.scrollLeft > 2);
    setFilterCanScrollRight(node.scrollLeft < maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchJson<CatalogResponse>('/dsh-plugin-registry/catalog', controller.signal)
      .then(setCatalog)
      .catch((catalogError) => {
        if (!controller.signal.aborted) {
          console.warn('[dsh-plugin-registry] catalog failed', catalogError);
        }
      });
    return () => controller.abort();
  }, [reloadToken]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setLoadMoreError(false);
    void fetchJson<PluginListResponse>(
      listUrl(debouncedQuery, category, effectiveSort),
      controller.signal
    )
      .then((result) => {
        if (controller.signal.aborted) return;
        setItems(result.items);
        setTotal(result.total);
        setNextCursor(result.page.nextCursor);
      })
      .catch((listError) => {
        if (controller.signal.aborted) return;
        console.warn('[dsh-plugin-registry] plugin list failed', listError);
        setItems([]);
        setTotal(0);
        setNextCursor(undefined);
        setError(listError instanceof Error ? listError.message : String(listError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery, category, effectiveSort, reloadToken]);

  const categories = catalog?.categories ?? [];
  const sortOptions = useMemo<RegistrySort[]>(
    () =>
      query.trim()
        ? ['relevance', 'popular', 'recent', 'newest', 'name']
        : ['popular', 'recent', 'newest', 'name'],
    [query]
  );
  const sortItems = useMemo<MenuEntry[]>(
    () => sortOptions.map((value) => ({ id: value, label: t(value) })),
    [sortOptions, t, activeLocale]
  );
  const debouncePending = query.trim() !== debouncedQuery.trim();
  const pending = debouncePending || loading;
  const refreshing = pending && items.length > 0;

  useEffect(() => {
    const node = filterScrollRef.current;
    if (!node) return;
    updateFilterScrollState();
    const onScroll = () => updateFilterScrollState();
    const onResize = () => updateFilterScrollState();
    node.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const frame = window.requestAnimationFrame(updateFilterScrollState);
    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [categories.length, activeLocale, updateFilterScrollState]);

  function scrollCategories(direction: 'left' | 'right'): void {
    const node = filterScrollRef.current;
    if (!node) return;
    const distance = Math.max(180, Math.min(320, node.clientWidth * 0.56));
    node.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  }

  function updateQuery(next: string): void {
    const hadQuery = query.trim().length > 0;
    const hasQuery = next.trim().length > 0;
    setQuery(next);
    if (!hadQuery && hasQuery) setSort('relevance');
    if (hadQuery && !hasQuery && sort === 'relevance') setSort('popular');
  }

  async function loadMore(): Promise<void> {
    if (!nextCursor || loadingMore) return;
    const loadKey = requestKey;
    setLoadingMore(true);
    setLoadMoreError(false);
    try {
      const result = await fetchJson<PluginListResponse>(
        listUrl(debouncedQuery, category, effectiveSort, nextCursor)
      );
      if (requestKeyRef.current !== loadKey) return;
      setItems((current) => [...current, ...result.items]);
      setTotal(result.total);
      setNextCursor(result.page.nextCursor);
    } catch (loadError) {
      console.warn('[dsh-plugin-registry] load more failed', loadError);
      if (requestKeyRef.current === loadKey) setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  function retry(): void {
    setReloadToken((value) => value + 1);
  }

  const registryHome = registryUrl(zh);

  return (
    <div className="dshr-root">
      <header className="dshr-head">
        <div className="dshr-title-row">
          <div className="dshr-title-copy">
            <div className="dshr-title-line">
              <h2 className="dshr-title">{t('title')}</h2>
              {catalog ? (
                <span className="dshr-count-badge">
                  {t('indexedPrefix')} {catalog.registry.pluginCount} {t('indexedSuffix')}
                </span>
              ) : null}
            </div>
            <p className="dshr-sub">{t('subtitle')}</p>
          </div>
        </div>

        <div className="dshr-toolbar">
          <div className="dshr-search-shell">
            <Input
              className="dshr-search"
              type="search"
              value={query}
              icon={<IconSearchOutline16 />}
              onChange={(event: { currentTarget: { value: string } }) => updateQuery(event.currentTarget.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
            />
            {pending ? <span className="dshr-search-spinner" aria-label={t('updating')} /> : null}
          </div>

          <Menu
            open={sortOpen}
            items={sortItems}
            selectedId={sort}
            onSelect={(id) => {
              setSort(id as RegistrySort);
              setSortOpen(false);
            }}
            onClose={() => setSortOpen(false)}
            align="end"
            compact
            anchor={(
              <Button
                variant="outline"
                size="md"
                className="dshr-sort-button"
                type="button"
                aria-expanded={sortOpen}
                aria-haspopup="menu"
                onClick={() => setSortOpen((value) => !value)}
              >
                <span>{t('sort')}: {t(sort)}</span>
                <IconChevronDownOutline14 size={12} />
              </Button>
            )}
          />
        </div>

        <div className="dshr-filter-shell">
          {filterCanScrollLeft ? (
            <>
              <span className="dshr-filter-fade dshr-filter-fade-left" aria-hidden="true" />
              <button
                className="dshr-filter-arrow dshr-filter-arrow-left"
                type="button"
                aria-label={zh ? '向左浏览插件分类' : 'Scroll plugin categories left'}
                onClick={() => scrollCategories('left')}
              >
                <IconChevronDownOutline14 size={12} />
              </button>
            </>
          ) : null}
          <div
            className="dshr-filter-row"
            ref={filterScrollRef}
            aria-label={t('categories')}
          >
            <Pill className="dshr-filter-pill" active={category === ''} data-selected={category === '' ? 'true' : 'false'} onClick={() => setCategory('')}>
              {t('all')}
            </Pill>
            {categories.map((item) => (
              <Pill
                className="dshr-filter-pill"
                active={category === item.slug}
                data-selected={category === item.slug ? 'true' : 'false'}
                onClick={() => setCategory(item.slug)}
                key={item.slug}
              >
                {categoryLabel(item.slug, item.label, zh)}
              </Pill>
            ))}
          </div>
          {filterCanScrollRight ? (
            <>
              <span className="dshr-filter-fade dshr-filter-fade-right" aria-hidden="true" />
              <button
                className="dshr-filter-arrow dshr-filter-arrow-right"
                type="button"
                aria-label={zh ? '向右浏览插件分类' : 'Scroll plugin categories right'}
                onClick={() => scrollCategories('right')}
              >
                <IconChevronDownOutline14 size={12} />
              </button>
            </>
          ) : null}
        </div>
      </header>

      <main className="dshr-body">
        {refreshing ? <div className="dshr-progress" aria-hidden="true" /> : null}

        {loading && items.length === 0 ? (
          <LoadingSkeleton />
        ) : error && items.length === 0 ? (
          <div className="dshr-state">
            <strong>{t('unavailableTitle')}</strong>
            <span>{t('unavailableBody')}</span>
            <div className="dshr-state-actions">
              <Button variant="primary" size="sm" type="button" onClick={retry}>
                {t('retry')}
              </Button>
              <a className="dshr-state-link" href={registryHome} target="_blank" rel="noreferrer">
                {t('openRegistry')}
              </a>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="dshr-state">
            <strong>{t('empty')}</strong>
            <span>{t('emptyHint')}</span>
            {query ? (
              <div className="dshr-state-actions">
                <Button variant="outline" size="sm" type="button" onClick={() => updateQuery('')}>
                  {t('clearSearch')}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className={`dshr-list${refreshing ? ' dshr-list-refreshing' : ''}`}>
              {items.map((plugin) => (
                <PluginCard
                  plugin={plugin}
                  catalog={catalog}
                  zh={zh}
                  t={t}
                  key={plugin.slug}
                />
              ))}
            </div>

            {loadMoreError ? (
              <div className="dshr-load-error">
                <span>{t('loadMoreFailed')}</span>
                <Button variant="outline" size="sm" type="button" onClick={() => void loadMore()}>
                  {t('retry')}
                </Button>
              </div>
            ) : null}

            {nextCursor ? (
              <div className="dshr-load">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore || refreshing}
                >
                  {loadingMore ? t('loadingMore') : t('loadMore')}
                </Button>
              </div>
            ) : null}

            <div className="dshr-footer">
              <div className="dshr-footer-summary" aria-label={`${t('showing')} ${items.length} ${t('of')} ${total}`}>
                <span className="dshr-footer-label">{t('showing')}</span>
                <strong>{items.length}</strong>
                <span className="dshr-footer-slash">/</span>
                <span>{total}</span>
              </div>
              <a
                className="dshr-footer-source"
                href={registryHome}
                target="_blank"
                rel="noreferrer"
              >
                <span>{t('dataNote')}</span>
                <span className="dshr-footer-source-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
