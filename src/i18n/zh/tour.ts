/**
 * Chinese labels for the first-visit tour's live figures ("6/6 slots busy",
 * "399 ms p99"). The tour's step titles and sentences already go through t()
 * in Tour.tsx and live in zh/learn.ts; this dictionary covers the one piece
 * of tour copy that tourSteps.ts builds as data: the TourFigure labels.
 * They render through t(f.label) in Tour.tsx, keyed by the exact English.
 *
 * The short nouns follow the canvas's own chart labels (zh/canvas.ts: 排队,
 * 拒绝, 忙, 失败) and the panels' 被拒之门外, so the tour speaks the same
 * words the rest of the interface uses.
 */

export const zhTour: Record<string, string> = {
  'slots busy': '槽位占用中',
  'slots taken': '槽位被占住',
  busy: '忙',
  waiting: '排队',
  'turned away': '被拒之门外',
  failing: '失败',
};
