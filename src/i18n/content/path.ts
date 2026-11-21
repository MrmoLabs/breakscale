/**
 * Render-time copy for the learning path.
 *
 * The 9 tracks in src/content/learningPath.ts keep their English title,
 * about line and per-step learn lines: the ids and kinds carry progress
 * (the explored set, the challenge store's badges) and the opening actions,
 * and learningPath.test.ts counts every id on the raw data. What
 * LearningPath renders goes through here: in Chinese, each track's title,
 * about and step learn lines come from zh/path.ts, with `kind` and `id`
 * passing through untouched. In the en locale the track comes back as the
 * same object.
 *
 * A track missing from the dictionary renders in English rather than
 * breaking the path's order.
 */

import { getLocale } from '../index';
import { zhPath } from '../zh/path';
import type { PathTrack } from '../../content/learningPath';

/** The track's title, about line and step learn lines as they should show now. */
export function pathTrackCopy(track: PathTrack): PathTrack {
  if (getLocale() !== 'zh') return track;
  const zh = zhPath[track.id];
  if (!zh) return track;
  return {
    id: track.id,
    title: zh.title,
    about: zh.about,
    steps: track.steps.map((step, i) => ({
      ...step,
      learn: zh.learn[i] ?? step.learn,
    })),
  };
}
