/**
 * Display-time translation for the glossary.
 *
 * The same contract as ./presets.ts: the 119 entries in src/content/glossary.ts
 * keep their English text, because the ids are anchors, the terms are the
 * field's shared English vocabulary, and the data tests pin the prose. What
 * renders goes through here: in Chinese, the copy from zh/glossary.ts when
 * the entry has one, and the original fields otherwise, so an entry added
 * before its translation lands still reads as English prose rather than as
 * nothing.
 *
 * `id` and `term` always come back unchanged: they are keys and anchors, not
 * prose. The term is displayed as-is in Chinese too; the Chinese name of a
 * term lives inside the translated definition (熔断器：…), where it reads
 * naturally instead of replacing the vocabulary the rest of the field uses.
 */

import {
  GLOSSARY,
  searchGlossary,
  type GlossaryEntry,
  type KindIntro,
} from '../../content/glossary';
import { getLocale } from '../index';
import { zhGlossary } from '../zh/glossary';

/** What one entry should show right now, plus the search vocabulary. */
export interface GlossaryCopy {
  id: string;
  term: string;
  short: string;
  why: string;
  /** English aliases from the entry, then the Chinese ones from zh. */
  aliases: string[];
  intro: KindIntro | undefined;
}

/** The entry's display text as it should show right now. */
export function glossaryCopy(entry: GlossaryEntry): GlossaryCopy {
  const original: GlossaryCopy = {
    id: entry.id,
    term: entry.term,
    short: entry.short,
    why: entry.why,
    aliases: entry.aliases ?? [],
    intro: entry.intro,
  };
  if (getLocale() !== 'zh') return original;
  const zh = zhGlossary[entry.id];
  if (!zh) return original;
  return {
    id: entry.id,
    term: entry.term,
    short: zh.short,
    why: zh.why,
    aliases: [...original.aliases, ...(zh.aliases ?? [])],
    intro: zh.intro ?? entry.intro,
  };
}

/**
 * Search across term, aliases and definition text, in the reader's language.
 *
 * English delegates straight to the content module's ranked search, byte for
 * byte. Chinese scores both the original fields (so English typing still
 * finds things) and the display copy (so 熔断 or 积压 find their entries),
 * using the same score ladder; an exact term or alias match always beats an
 * incidental mention in some other entry's explanation, exactly as the
 * English search promises.
 */
export function searchGlossaryCopy(query: string): GlossaryEntry[] {
  if (getLocale() !== 'zh') return searchGlossary(query);
  return searchTranslated(query);
}

/** Same ladder as searchGlossary, applied to one view of an entry. */
function scoreView(
  view: {
    term: string;
    aliases: string[];
    short: string;
    why: string;
    example?: string;
  },
  q: string,
): number {
  const term = view.term.toLowerCase();
  const aliases = view.aliases.map((a) => a.toLowerCase());
  const example = view.example?.toLowerCase();

  if (term === q || aliases.includes(q)) return 100;
  if (term.startsWith(q)) return 80;
  if (aliases.some((a) => a.startsWith(q))) return 70;
  if (term.includes(q)) return 50;
  if (aliases.some((a) => a.includes(q))) return 40;
  if (view.short.toLowerCase().includes(q)) return 20;
  if (view.why.toLowerCase().includes(q)) return 10;
  // "kafka" or "s3" should find the kind even without an alias for it.
  if (example?.includes(q)) return 5;
  return 0;
}

function searchTranslated(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;

  const scored: Array<{ entry: GlossaryEntry; score: number }> = [];
  for (const entry of GLOSSARY) {
    const copy = glossaryCopy(entry);
    // Two views: the raw English entry and what renders in Chinese now. An
    // entry is found in either language; its best match sets the rank.
    const score = Math.max(
      scoreView(
        {
          term: entry.term,
          aliases: entry.aliases ?? [],
          short: entry.short,
          why: entry.why,
          example: entry.intro?.example,
        },
        q,
      ),
      scoreView(
        {
          term: copy.term,
          aliases: copy.aliases,
          short: copy.short,
          why: copy.why,
          example: copy.intro?.example,
        },
        q,
      ),
    );
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.entry.term.localeCompare(b.entry.term),
  );
  return scored.map((s) => s.entry);
}
