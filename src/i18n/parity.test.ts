import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it, afterEach } from 'vitest';
import { t, tN, getLocale, hasZh, setLocale } from './index';
import { zhChrome } from './zh/chrome';
import { setPreference, __resetPreferences } from '../content/preferences';

/* ==========================================================================
   The translation contract, checked.

   Two halves:
   1. Every English literal handed to t() or tN() somewhere in src/ has an
      entry in the Chinese dictionary. Without this, a string added to a
      component silently renders English in the Chinese interface.
   2. Every dictionary entry is a real translation: non-empty, actual
      Chinese (except options rendered in their own name, like "English"),
      and free of em dashes, which the copy rules forbid in any language.
   ========================================================================== */

const SRC_ROOT = fileURLToPath(new URL('..', import.meta.url));

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      // The dictionaries themselves hold the keys; scanning them for t()
      // calls would only find the test files' own examples.
      if (name.name === 'i18n') continue;
      out.push(...listSourceFiles(p));
    } else if (
      (name.name.endsWith('.ts') || name.name.endsWith('.tsx')) &&
      !name.name.includes('.test.')
    ) {
      out.push(p);
    }
  }
  return out;
}

// Matches t('...'), including across lines, but not .t('...'), xtain('...'),
// or t(variable). tN is matched separately because it takes two literals.
const T_CALL = /(?<![\w$.])t\(\s*'((?:[^'\\\n]|\\.)*)'/g;
const TN_CALL =
  /(?<![\w$.])tN\(\s*[^,()]+\s*,\s*'((?:[^'\\\n]|\\.)*)'\s*,\s*'((?:[^'\\\n]|\\.)*)'/g;

function scanKeys(): Map<string, string> {
  const keys = new Map<string, string>(); // key -> file that referenced it
  for (const file of listSourceFiles(SRC_ROOT)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(T_CALL)) {
      if (!keys.has(m[1])) keys.set(m[1], file);
    }
    for (const m of text.matchAll(TN_CALL)) {
      if (!keys.has(m[1])) keys.set(m[1], file);
      if (!keys.has(m[2])) keys.set(m[2], file);
    }
  }
  return keys;
}

const CJK = /[\u4e00-\u9fff]/;

describe('translation dictionary', () => {
  it('has an entry for every t() / tN() literal in src', () => {
    const missing: string[] = [];
    for (const [key, file] of scanKeys()) {
      if (!hasZh(key)) missing.push(`${key}  (${file})`);
    }
    expect(missing).toEqual([]);
  });

  it('maps every entry to non-empty Chinese without em dashes', () => {
    const problems: string[] = [];
    for (const [en, zh] of Object.entries(zhChrome)) {
      if (typeof zh !== 'string' || zh.trim() === '') {
        problems.push(`${en}: empty translation`);
        continue;
      }
      if (zh.includes('—')) problems.push(`${en}: contains an em dash`);
      // Options that render in their own name ("English") are deliberately
      // not translated; anything else must actually be Chinese.
      if (!CJK.test(zh) && !/^[\w\s.()]+$/.test(zh)) {
        problems.push(`${en}: "${zh}" is neither Chinese nor a native name`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('locale resolution', () => {
  afterEach(() => {
    __resetPreferences();
    setLocale('en');
  });

  it('follows the language preference', () => {
    expect(getLocale()).toBe('en');
    setPreference('language', 'zh');
    expect(getLocale()).toBe('zh');
    expect(t('Settings')).toBe('设置');
    setPreference('language', 'en');
    expect(getLocale()).toBe('en');
    expect(t('Settings')).toBe('Settings');
  });

  it('falls back to the English source when no translation exists', () => {
    setPreference('language', 'zh');
    expect(t('No such string in the dictionary')).toBe(
      'No such string in the dictionary',
    );
  });

  it('fills placeholders in both locales', () => {
    expect(
      t('Following your device, which is currently {theme}.', { theme: 'dark' }),
    ).toBe('Following your device, which is currently dark.');
    setPreference('language', 'zh');
    expect(
      t('Following your device, which is currently {theme}.', { theme: t('dark') }),
    ).toBe('跟随设备，当前为深色。');
  });

  it('keeps tN fallbacks readable before a pair is translated', () => {
    setPreference('language', 'zh');
    expect(tN(1, 'one unlisted thing', '{n} unlisted things')).toBe(
      'one unlisted thing',
    );
    expect(tN(3, 'one unlisted thing', '{n} unlisted things')).toBe(
      '3 unlisted things',
    );
  });
});
