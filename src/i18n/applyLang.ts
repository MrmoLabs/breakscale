/**
 * Put the chosen language on the document.
 *
 * The same idea as applyTheme: the interface itself does the translation
 * work through t(), and all this has to do is keep the document's own
 * metadata honest. `lang` matters because screen readers pick a voice from
 * it, and the tab title is the one piece of interface text this file can
 * actually change.
 *
 * The static English in index.html stays: it is what a crawler reads before
 * any script runs, and search engines index the site in English.
 */

import { getLocale, type Locale } from './index';

const TITLES: Record<Locale, string> = {
  en: 'Breakscale: System Design Simulator You Can Break',
  zh: 'Breakscale：可以压垮的系统设计模拟器',
};

export function applyLang(): void {
  const locale = getLocale();
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  document.title = TITLES[locale];
}
