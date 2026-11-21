/**
 * Display-time translation for text that lives INSIDE design data.
 *
 * Node labels, notes and section titles are stored in topologies: they ship
 * in .breakscale files, share links and saved sessions, and the share wire
 * protocol (src/share/wire.ts) freezes the English default-label table, so
 * the stored data must never be rewritten. Instead, every render site shows
 * the translation through these helpers while the data stays exactly as it
 * was written.
 *
 * Keys are the exact English source strings. A label the reader typed
 * themselves (including one typed in Chinese) has no entry and passes
 * through untouched, which is the correct behaviour for user content.
 *
 * The engine never reads any of this text (src/sim/types.ts, "Documentation
 * only"), so translation cannot affect a run.
 */

import { getLocale } from './index';
import { zhLabels } from './zh/labels';
import { zhNotes } from './zh/notes';
import { zhSceneLabels } from './zh/sceneLabels';
import { zhSceneNotes } from './zh/sceneNotes';

/** Node labels: preset topologies, challenge scenes, and defaults. */
const LABELS = new Map(Object.entries({ ...zhLabels, ...zhSceneLabels }));

/** Notes and section titles, in the same two halves. */
const NOTES = new Map(Object.entries({ ...zhNotes, ...zhSceneNotes }));

/** One node label as it should be shown right now. */
export function displayLabel(label: string): string {
  if (getLocale() !== 'zh') return label;
  return LABELS.get(label) ?? label;
}

/** One note's text as it should be shown right now. */
export function displayNote(text: string): string {
  if (getLocale() !== 'zh') return text;
  return NOTES.get(text) ?? text;
}

/** One section title as it should be shown right now. */
export function displaySection(label: string): string {
  if (getLocale() !== 'zh') return label;
  return NOTES.get(label) ?? label;
}
