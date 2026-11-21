/**
 * Display-time translation for the text INSIDE briefs.
 *
 * The same contract as ../display.ts: challenges live in src/sim/challenges.ts
 * and their English text is the source of truth (it is what the judge keys,
 * what the challenge store pins, and what tests assert), so nothing rewrites
 * the data. Render sites call `challengeCopy` and show what it returns; in
 * the en locale the original fields come back unchanged.
 *
 * The lookup merges two dictionaries: the 18 briefs in CHALLENGES, keyed by
 * challenge id, and the 6 real incidents' embedded briefs, keyed by incident
 * id (an incident's brief is a Challenge whose id is the incident's).
 */

import type { Challenge } from '../../sim/challenge';
import { getLocale } from '../index';
import { zhChallenges } from '../zh/challenges';
import { zhIncidentBriefs } from '../zh/incidentBriefs';

/** The 18 briefs, by challenge id. */
const ZH = new Map(Object.entries({ ...zhChallenges, ...zhIncidentBriefs }));

/**
 * The brief's display text: name, brief, hints and lesson. Everything the
 * reader reads; the goals, budget, faults and thresholds stay on the
 * original, because the engine and the check read them.
 */
export interface ChallengeCopy {
  name: string;
  brief: string;
  hints: readonly string[];
  lesson: string;
}

export function challengeCopy(c: Challenge): ChallengeCopy {
  const original = { name: c.name, brief: c.brief, hints: c.hints, lesson: c.lesson };
  if (getLocale() !== 'zh') return original;
  return ZH.get(c.id) ?? original;
}
