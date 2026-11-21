/**
 * Localisation.
 *
 * HOW IT WORKS. Every translatable string in the interface keeps its English
 * text as the source of truth. `t('Settings')` looks the English string up
 * in the Chinese dictionary and returns the translation when the locale is
 * Chinese, or the string itself when it is English. Nothing is rewritten at
 * the data layer: topologies, design files, share links and saved designs
 * all still carry English (or whatever the reader typed), and only what is
 * rendered is translated. That is what keeps a link opened in a Chinese
 * browser byte-compatible with the one a reader shared from an English one,
 * and it is why the share wire protocol's frozen label tables stay frozen.
 *
 * Natural keys rather than short codes, for the same reason the project's
 * copy tests pin exact sentences: the English string is right there in the
 * source, a missing translation degrades to readable English instead of a
 * key name, and `src/i18n/parity.test.ts` can scan the source tree for
 * `t('...')` literals and fail when one has no dictionary entry yet.
 *
 * NO REACT CONTEXT. A locale is read inside components that re-render ten
 * times a second while the simulation runs, so it follows the same pattern
 * as the preferences store: a module-level value, subscribed components
 * re-render when the language preference changes, and the canvas heals
 * itself within one frame because it re-renders on the 10Hz tick anyway.
 *
 * DOM-FREE. The MCP server imports shared copy modules that reach this file,
 * and it runs in Node with no `document` and no useful `navigator`, so
 * nothing here touches a browser API. Resolution reads the language
 * preference (which guards its own localStorage access) and, for `system`,
 * falls back to English when no browser language is visible. The MCP entry
 * point calls `setLocale` itself from `BREAKSCALE_LANG`.
 *
 * Interpolation uses `{name}` placeholders and only runs when parameters are
 * passed, so the hot path (`t('Settings')`) is a single Map lookup with no
 * allocation.
 */

import { getPreferences, watchPreferences } from '../content/preferences';
import type { LanguageChoice } from '../content/preferences';
import { zhChrome } from './zh/chrome';
import { zhApp } from './zh/app';
import { zhCanvas } from './zh/canvas';
import { zhInspector } from './zh/inspector';
import { zhPanels } from './zh/panels';
import { zhOps } from './zh/ops';
import { zhLearn } from './zh/learn';
import { zhTour } from './zh/tour';
import { zhVendors } from './zh/vendors';
import { zhMcp } from './zh/mcp';

export type Locale = 'en' | 'zh';

/** English source text, Chinese translation. */
type Dictionary = Record<string, string>;

const ZH = new Map<string, string>(
  Object.entries({
    ...zhChrome,
    ...zhApp,
    ...zhCanvas,
    ...zhInspector,
    ...zhPanels,
    ...zhOps,
    ...zhLearn,
    ...zhTour,
    ...zhVendors,
    ...zhMcp,
  } as Dictionary),
);

let locale: Locale = resolveLocale();

/**
 * A one-shot boot override, the language counterpart of the theme override:
 * `?language=zh` wins on mount and is dropped the moment the reader picks a
 * language in Settings, which persists their choice as normal. `system`
 * behaves like null: whatever resolution would have said.
 */
let override: LanguageChoice | null = null;
let lastPref: LanguageChoice = getPreferences().language;

/** Force the locale for this page view without touching the stored preference. */
export function setLocaleOverride(next: LanguageChoice | null): void {
  override = next;
  locale = next === 'en' || next === 'zh' ? next : resolveLocale();
}

function resolveLocale(): Locale {
  const pref: LanguageChoice = getPreferences().language;
  if (pref === 'zh') return 'zh';
  if (pref === 'en') return 'en';
  // `system`: follow the browser, but only in one. Node also exposes a
  // navigator whose language follows the host machine, and a test runner on
  // a Chinese machine must not boot the interface in Chinese when the tests
  // assert English copy, so anything without a `document` resolves to
  // English and the MCP server overrides that with setLocale.
  if (typeof document === 'undefined') return 'en';
  if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }
  return 'en';
}

// Keep the resolved locale in step with the preference before React reads it:
// preferences listeners fire synchronously inside setPreference, so by the
// time subscribed components re-render, `t()` already answers in the new
// language. A change to the language preference itself is the reader
// speaking, so it clears any boot override.
watchPreferences(() => {
  const pref = getPreferences().language;
  if (pref !== lastPref) {
    lastPref = pref;
    override = null;
  }
  locale = override === 'en' || override === 'zh' ? override : resolveLocale();
});

/** The locale currently in effect. */
export function getLocale(): Locale {
  return locale;
}

/** Override the resolved locale. Used by tests and by the MCP entry point. */
export function setLocale(next: Locale): void {
  locale = next;
}

function fill(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  );
}

/**
 * Translate one English source string.
 *
 * English locale returns the string unchanged (with placeholders filled when
 * parameters are given); Chinese returns the dictionary entry, falling back
 * to the English source when no translation exists yet so a gap in the
 * dictionary can never render as a key name or an empty node.
 */
export function t(en: string, params?: Record<string, string | number>): string {
  const s = locale === 'zh' ? (ZH.get(en) ?? en) : en;
  if (!params) return s;
  return fill(s, params);
}

/**
 * Translate a counted pair.
 *
 * English keeps both forms the source already distinguishes ('1 request' /
 * '{n} requests'); Chinese reads the same in both, so its dictionary maps
 * the two keys to the same text and the parity test keeps them together.
 * `n` is always available as `{n}` in the translation.
 */
export function tN(
  n: number,
  one: string,
  other: string,
  params?: Record<string, string | number>,
): string {
  return t(n === 1 ? one : other, { n, ...params });
}

/** Whether a Chinese translation exists. The parity test builds on this. */
export function hasZh(en: string): boolean {
  return ZH.has(en);
}
