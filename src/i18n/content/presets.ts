/**
 * Render-time copy for the example presets.
 *
 * The 24 preset objects in src/sim/presets.ts keep their English name,
 * tagline and description, exactly like every other piece of design data:
 * the id is what share links, saved designs and the learning path carry.
 * What renders goes through here: in Chinese, the translation from
 * zh/presets.ts when the preset has one, and the original text otherwise, so
 * a preset added before its copy is translated still reads as English prose
 * rather than as nothing.
 *
 * The parameter is structural rather than the `Preset` type on purpose: the
 * i18n layer stays decoupled from the sim, and callers pass any object with
 * these four fields.
 */

import { getLocale } from '../index';
import { zhPresets } from '../zh/presets';

/** The three user-visible strings a preset carries, plus its id. */
interface PresetLike {
  id: string;
  name: string;
  tagline: string;
  description: string;
}

/** The preset's name, tagline and description as they should show right now. */
export function presetCopy(p: PresetLike): {
  name: string;
  tagline: string;
  description: string;
} {
  if (getLocale() === 'zh') {
    const zh = zhPresets[p.id];
    if (zh) return zh;
  }
  return { name: p.name, tagline: p.tagline, description: p.description };
}
