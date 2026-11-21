/**
 * Display-time translation for the text INSIDE incidents.
 *
 * Same contract as ../display.ts and ./challenges.ts: incidents live in
 * src/sim/incidents.ts with their English text as the source of truth, and
 * render sites show what `incidentCopy` returns. The date and the source URL
 * are facts the postmortem states, so they pass through in every locale; the
 * source title is read as a sentence, so it is translated.
 *
 * Captions are paired with the original by index, so `atMs` always comes
 * from the incident and can never drift from the replay's fault schedule.
 */

import type { Caption, Incident } from '../../sim/incidents';
import { getLocale } from '../index';
import { zhIncidents } from '../zh/incidents';

const ZH = new Map(Object.entries(zhIncidents));

/**
 * The incident's display text. `date` and `sourceUrl` are the original's;
 * everything the reader reads is translated when a zh entry exists.
 */
export function incidentCopy(i: Incident): {
  name: string;
  date: string;
  tagline: string;
  sourceTitle: string;
  sourceUrl: string;
  story: string[];
  simNote: string;
  captions: Caption[];
} {
  const original = {
    name: i.name,
    date: i.date,
    tagline: i.tagline,
    sourceTitle: i.source.title,
    sourceUrl: i.source.url,
    story: [...i.story],
    simNote: i.simNote,
    captions: i.captions.map((c) => ({ ...c })),
  };
  if (getLocale() !== 'zh') return original;
  const zh = ZH.get(i.id);
  if (!zh) return original;
  return {
    name: zh.name,
    date: original.date,
    tagline: zh.tagline,
    sourceTitle: zh.sourceTitle,
    sourceUrl: original.sourceUrl,
    story: zh.story,
    simNote: zh.simNote,
    captions: i.captions.map((c, at) => ({
      atMs: c.atMs,
      text: zh.captions[at] ?? c.text,
    })),
  };
}
