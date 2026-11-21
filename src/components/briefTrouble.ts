import type { Challenge } from '../sim/challenge';
import { t } from '../i18n';

/* ==========================================================================
   The trouble a brief promises, in words.

   A brief with faults is judged on runs that include them, so its first
   verdict describes a failure the live run on screen may not have reached
   yet. Saying when and what lets "As it starts" read as a forecast of the
   brief's own runs rather than a loss nobody can see happening.
   ========================================================================== */

export interface BriefTrouble {
  /** Run time the first fault lands, in ms. */
  atMs: number;
  /** "S3 goes down", finishing "When ... at 20s". */
  what: string;
  /** "Outage", finishing "... in 14s". */
  noun: string;
}

/** The brief's first fault, or null for a brief with none. */
export function briefTrouble(
  challenge: Challenge,
  nameOf: (id: string) => string,
): BriefTrouble | null {
  let first: NonNullable<Challenge['faults']>[number] | null = null;
  for (const f of challenge.faults ?? []) {
    if (
      f.action !== 'inject' &&
      f.action !== 'cut' &&
      f.action !== 'duplicate' &&
      f.action !== 'cut-replies'
    )
      continue;
    if (first === null || f.atMs < first.atMs) first = f;
  }
  if (first === null) return null;
  if (first.action === 'cut') {
    return { atMs: first.atMs, what: t('a connection is cut'), noun: t('Cut') };
  }
  if (first.action === 'duplicate') {
    return {
      atMs: first.atMs,
      what: t('a connection starts delivering some calls twice'),
      noun: t('Duplicates'),
    };
  }
  if (first.action === 'cut-replies') {
    return {
      atMs: first.atMs,
      what: t('a connection starts losing its answers'),
      noun: t('Lost answers'),
    };
  }
  if (first.action !== 'inject') return null;
  // A label with a comma in it ("S3, one region") reads as an aside, which
  // a sentence has to close before its verb.
  const raw = nameOf(first.nodeId);
  const name = raw.includes(',') ? `${raw},` : raw;
  switch (first.kind) {
    case 'crash':
      return {
        atMs: first.atMs,
        what: t('{name} goes down', { name }),
        noun: t('Outage'),
      };
    case 'crash-instance':
      return {
        atMs: first.atMs,
        what: t('one {name} machine crashes', { name }),
        noun: t('Crash'),
      };
    case 'slow':
      return {
        atMs: first.atMs,
        what: t('{name} slows down', { name }),
        noun: t('Slowdown'),
      };
    case 'errors':
      return {
        atMs: first.atMs,
        what: t('{name} starts failing requests', { name }),
        noun: t('Errors'),
      };
    case 'partition':
      return {
        atMs: first.atMs,
        what: t('{name} is cut off', { name }),
        noun: t('Outage'),
      };
    case 'pause':
      return { atMs: first.atMs, what: t('{name} stalls', { name }), noun: t('Stall') };
    case 'restart':
      return {
        atMs: first.atMs,
        what: t('{name} restarts', { name }),
        noun: t('Restart'),
      };
    default:
      return null;
  }
}

/**
 * Whole seconds until the fault in the live run, for "Outage in 14s", or
 * null once it has landed. Rounded up, so it never says 0s before it hits.
 */
export function troubleCountdown(
  trouble: BriefTrouble | null,
  liveMs: number | null,
): { noun: string; seconds: number } | null {
  if (trouble === null || liveMs === null || liveMs >= trouble.atMs) return null;
  return { noun: trouble.noun, seconds: Math.ceil((trouble.atMs - liveMs) / 1000) };
}
