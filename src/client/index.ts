import { createElement as h } from 'react';
import { en, zh } from './locales.ts';
import { RegistrySection } from './RegistrySection.tsx';
import { styles } from './styles.ts';
import type { Translate } from './types.ts';

const NS = 'dsh-plugin-registry';
const STYLE_ID = 'dshplugin-registry';

interface LocaleService {
  register(
    namespace: string,
    dicts: { zh: Record<string, string>; en: Record<string, string> }
  ): unknown;
  bind(namespace: string): Translate;
  subscribe(callback: () => void): () => void;
  getSnapshot(): { active: string };
}

interface SlotsService {
  inject(slot: string, register: () => unknown): void;
  register(
    meta: Record<string, unknown>,
    component: () => unknown
  ): unknown;
}

interface RegistryClientContext {
  effect(callback: () => unknown, label?: string): void;
  locale: LocaleService;
  slots: SlotsService;
}

export const name = 'dsh-plugin-registry';
export const inject = ['slots', 'locale'];

function mountStyles(): () => void {
  const existing = document.querySelector(
    `style[data-plugin-css="${STYLE_ID}"]`
  );
  if (existing) return () => undefined;

  const tag = document.createElement('style');
  tag.dataset.plugin = STYLE_ID;
  tag.dataset.pluginCss = STYLE_ID;
  tag.textContent = styles;
  document.head.appendChild(tag);
  return () => tag.remove();
}

export function apply(ctx: RegistryClientContext): void {
  ctx.effect(
    () => ctx.locale.register(NS, { zh, en }),
    'dsh-plugin-registry: dictionaries'
  );
  ctx.effect(mountStyles, 'dsh-plugin-registry: styles');

  const t = ctx.locale.bind(NS);
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'dsh-plugin-registry',
        order: 45,
        label: () => t('nav'),
        locale: NS,
        inject: () => ({ t }),
      },
      () => h(RegistrySection, { t, locale: ctx.locale })
    )
  );
}
