/**
 * Chinese note texts and section titles for the incident scenes. Keys are
 * the exact English strings.
 *
 * The 6 incident scenes in src/sim/incidents.ts are built from `node()`
 * calls with faults and edges only: they carry no canvas notes and no
 * sections today, so this table is empty. It stays in display.ts's merge
 * so a scene note added later has a home, and so the display layer keeps
 * one shape for every topology's text.
 */

export const zhSceneNotes: Record<string, string> = {};
