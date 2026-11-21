import { Engine } from '../../src/sim/engine';
import { sanitizeSeed } from '../../src/sim/seed';
import { t, getLocale } from '../../src/i18n';
import type {
  FailureReason,
  RouteStats,
  SimSnapshot,
  Topology,
} from '../../src/sim/types';

/* ------------------------------------------------------------------ *
 * Running a design with nobody watching, and saying what happened.
 *
 * The canvas is for the person; this is for the model. A host that
 * cannot draw the canvas (a terminal agent, say) still gets the answer
 * the canvas would have shown, and a host that can draw it still gives
 * the model something to reason about, since the model cannot see the
 * canvas either way.
 *
 * Every number below comes straight off an engine snapshot. Where a
 * metric means nothing for a kind (a rate limiter has no utilisation to
 * speak of) the line leaves it out rather than printing a zero that
 * reads like a measurement.
 * ------------------------------------------------------------------ */

export interface RunOptions {
  /** Simulated seconds. */
  seconds: number;
  seed: number;
  /**
   * Wall-clock ceiling in ms. A design offering a million requests a
   * second would otherwise hold the server for as long as it takes, and
   * on a hosted server that is somebody else's request waiting.
   */
  budgetMs: number;
}

export const DEFAULT_RUN: RunOptions = { seconds: 30, seed: 1, budgetMs: 3000 };

export interface RunResult {
  snapshot: SimSnapshot;
  /** Each client's own figures at the end of the run, in topology order. */
  routes: RouteStats[];
  /** How far the simulation actually got, which is less than asked when it ran out of budget. */
  simulatedMs: number;
  /** The seed the run used: the design's own when it carries one, else the option's. */
  seed?: number;
}

/*
 * One frame, the same step the app drives the engine at.
 *
 * It cannot be coarser than a rate bucket. The engine's trailing window is
 * ten 100ms buckets and `rate()` excludes the one still filling, so
 * stepping a whole 100ms per call lands every reading on that partial
 * bucket and every rate comes back 0.0/s. That is how a design offered a
 * million a second reported "offered 0.0/s, served 0.0/s, 0.0% failed"
 * beside a component pinned at 100% busy.
 */
const STEP_MS = 1000 / 60;

export function runDesign(
  topology: Topology,
  opts: RunOptions = DEFAULT_RUN,
): RunResult {
  // A design that carries a seed is asking to be replayed, so its seed wins
  // over the default. Its fault schedule needs nothing here: the engine
  // plays it from the topology.
  const seed = sanitizeSeed(topology.seed) ?? opts.seed;
  const engine = new Engine(topology, seed);
  const target = opts.seconds * 1000;
  const start = performance.now();
  let simulatedMs = 0;
  while (simulatedMs < target && performance.now() - start < opts.budgetMs) {
    engine.advance(STEP_MS);
    simulatedMs += STEP_MS;
  }
  return { snapshot: engine.snapshot(), routes: engine.routes(), simulatedMs, seed };
}

export const REASON_WORDS: Record<FailureReason, string> = {
  error: 'failed on their own (errorRate)',
  shed: 'were turned away by a full queue',
  timeout: 'timed out',
  'no-route': 'had nowhere to go',
  depth: 'looped past the hop limit',
  throttled: 'were refused by a rate limiter',
  rejected: 'were refused by an open circuit breaker',
  crashed: 'hit a crashed component',
  partitioned: 'crossed a cut network link',
  'region-down': 'found no region serving',
  'conn-refused': 'were refused a websocket connection',
  unauthorized: 'failed authentication at the API gateway',
  'bulkhead-full': 'were refused by a full bulkhead',
  'acquire-timeout': 'gave up waiting for a pool slot',
  deprioritized: 'were dropped by a load shedder',
  'packet-loss': 'were lost on a lossy network link (lossRate)',
};

const ms = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${Math.round(v)}ms`;
const pct = (v: number) => `${(v * 100).toFixed(v > 0 && v < 0.01 ? 2 : 1)}%`;
const perSec = (v: number) => `${v >= 100 ? Math.round(v) : v.toFixed(1)}/s`;

/** Plain text for the model: the system first, then the components that explain it. */
export function describeRun(
  topology: Topology,
  run: RunResult,
  opts: RunOptions,
): string {
  const { system, nodes, failuresByReason } = run.snapshot;
  const lines: string[] = [];
  const why = (r: FailureReason, n: number): string =>
    `${n} ${t(REASON_WORDS[r] ?? r)}`;

  const secs = Math.round(run.simulatedMs / 1000);
  const short =
    run.simulatedMs < opts.seconds * 1000
      ? t(
          ' (stopped at {secs}s of {total}s: the design is too heavy to simulate further here)',
          {
            secs,
            total: opts.seconds,
          },
        )
      : '';
  lines.push(
    t('Simulated {secs}s with seed {seed}{short}.', {
      secs,
      seed: run.seed ?? opts.seed,
      short,
    }),
  );
  lines.push(
    t(
      'Offered {offered}, served {served}, {failed} failed. Latency p50 {p50}, p95 {p95}, p99 {p99}.',
      {
        offered: perSec(system.offeredRps),
        served: perSec(system.goodputRps),
        failed: pct(system.errorRate),
        p50: ms(system.p50),
        p95: ms(system.p95),
        p99: ms(system.p99),
      },
    ),
  );

  const reasons = (Object.entries(failuresByReason) as [FailureReason, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  if (reasons.length > 0) {
    lines.push(
      t('Failed requests over the run: {list}.', {
        list: reasons.map(([r, n]) => why(r, n)).join('; '),
      }),
    );
  }

  const byId = new Map(topology.nodes.map((n) => [n.id, n]));

  // With one client its figures are the system's, already said above.
  if (run.routes.length > 1) {
    lines.push(
      '',
      t('By traffic source (each client and its own requests, end to end):'),
    );
    for (const r of run.routes) {
      const name = byId.get(r.clientId)?.label ?? r.clientId;
      const settled = r.goodputRps + r.failedRps;
      const parts = [
        t('offered {rate}', { rate: perSec(r.offeredRps) }),
        t('served {rate}', { rate: perSec(r.goodputRps) }),
      ];
      if (settled > 0) parts.push(t('{pct} failed', { pct: pct(r.errorRate) }));
      if (r.goodputRps > 0) parts.push(t('p99 {ms}', { ms: ms(r.p99) }));
      const reasons = (Object.entries(r.failuresByReason) as [FailureReason, number][])
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1]);
      const over =
        t('over the run {a} served, {b} failed', {
          a: r.totalCompleted,
          b: r.totalFailed,
        }) +
        (reasons.length > 0
          ? ` (${reasons.map(([w, n]) => why(w, n)).join('; ')})`
          : '');
      lines.push(
        t("- {name} (id '{id}'): {parts}; {over}", {
          name,
          id: r.clientId,
          // zh sentences read better with the full-width comma.
          parts: parts.join(getLocale() === 'zh' ? '，' : ', '),
          over,
        }),
      );
    }
  }
  const rows = Object.entries(nodes)
    .map(([id, s]) => ({ id, s, node: byId.get(id) }))
    .filter((r) => r.node && r.node.kind !== 'client');

  // A node that blocks on its calls holds a slot while it waits on them, and
  // utilisation counts only the work, so a server with every slot held on a
  // slow store reads a few percent busy. Ranked by the larger of the two, it
  // sorts as the full node it is.
  const load = (r: (typeof rows)[number]): number => {
    const waiting = r.s.waitingOnDownstream;
    // A lambda already reports its concurrency, waits included.
    if (waiting === undefined || !r.node || r.node.kind === 'lambda')
      return r.s.utilization;
    const slots =
      r.node.config.capacity *
      Math.max(1, Math.floor(r.s.instances ?? r.node.config.instances ?? 1));
    return slots > 0
      ? Math.max(r.s.utilization, (r.s.inFlight + waiting) / slots)
      : r.s.utilization;
  };
  const busy = rows.filter((r) => load(r) > 0).sort((a, b) => load(b) - load(a));
  const failing = rows.filter(
    (r) => r.s.errorRate > 0 || r.s.shedRate > 0 || r.s.timeoutRate > 0,
  );
  const shown = [...new Set([...busy.slice(0, 5), ...failing])];

  if (shown.length > 0) {
    lines.push('', t('Components (busiest first):'));
    for (const { id, s, node } of shown) {
      const parts = [
        t('{in} in, {done} done', {
          in: perSec(s.arrivalRate),
          done: perSec(s.throughput),
        }),
      ];
      if (s.utilization > 0)
        parts.push(t('{pct} busy', { pct: pct(Math.min(s.utilization, 1)) }));
      if ((s.waitingOnDownstream ?? 0) > 0)
        parts.push(
          t('{n} slots held waiting on its calls', {
            n: Math.round(s.waitingOnDownstream ?? 0),
          }),
        );
      if (s.queued >= 1) parts.push(t('{n} waiting', { n: Math.round(s.queued) }));
      if (s.throughput > 0) parts.push(t('p99 {ms}', { ms: ms(s.p99) }));
      if (s.errorRate > 0) parts.push(t('{pct} failed', { pct: pct(s.errorRate) }));
      if (s.shedRate > 0)
        parts.push(t('{rate} turned away', { rate: perSec(s.shedRate) }));
      if (s.timeoutRate > 0)
        parts.push(t('{rate} timed out', { rate: perSec(s.timeoutRate) }));
      if (node?.kind === 'cache' || node?.kind === 'cdn')
        parts.push(t('hit rate {pct}', { pct: pct(s.hitRate) }));
      lines.push(
        t("- {label} ({kind}, id '{id}'): {parts}", {
          label: node?.label ?? id,
          // `shown` only keeps rows whose node exists; the fallback is
          // unreachable but keeps the type honest.
          kind: node?.kind ?? 'unknown',
          id,
          parts: parts.join(getLocale() === 'zh' ? '，' : ', '),
        }),
      );
    }
  }

  return lines.join('\n');
}
