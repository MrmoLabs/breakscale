/**
 * Chinese mirror of the "Can you break it?" sentence builders.
 *
 * breakCopy.ts composes English sentences from parts, and Chinese word
 * order differs too much to patch a suffix on: “在 10s 弄异数据库” puts the
 * time before the verb where English puts it after. So every builder there
 * has a counterpart here with the same signature, and breakCopy dispatches
 * to these when the locale is zh. The English path there is byte-identical
 * to what it always was, which is what breakCopy's tests pin.
 *
 * The node and edge names arrive already translated (the Names functions
 * pass through displayLabel), so only the connective text is handled here.
 *
 * Copy rules as everywhere: plain language, no em dashes, full-width
 * punctuation.
 */

import type {
  Attack,
  Closest,
  SearchPhase,
  SeedRun,
  SinglePoint,
} from '../../sim/breakit';
import type { Goal } from '../../sim/challenge';
import type { RequestTimeline, TimelineEvent, Violation } from '../../sim/oplog';
import type { FailureReason } from '../../sim/types';
import {
  formatCount,
  formatGoalMs,
  formatGoalPct,
  formatShareDown,
} from '../../components/format';
import { BREAK_END_MS, BREAK_WARMUP_MS } from '../../sim/breakit';
import type { Names } from '../../components/breakCopy';

function secs(ms: number): string {
  const s = ms / 1000;
  return `${Number.isInteger(s) ? s : s.toFixed(1)}s`;
}

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** A list as a reader would say it: “A、B 和 C”。 */
function listed(items: readonly string[]): string {
  return items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join('、')} 和 ${items[items.length - 1]}`;
}

/** One fault, without its timing. */
export function faultPhrase(a: Attack, names: Names): string {
  switch (a.kind) {
    case 'crash':
      return `弄崩${names.node(a.target)}`;
    case 'crash-instance':
      return `弄崩${names.node(a.target)}的一台实例`;
    case 'slow':
      return `把${names.node(a.target)}变慢 ${a.factor} 倍`;
    case 'errors':
      return `让${names.node(a.target)}对 ${pct(a.rate)} 的请求返回错误`;
    case 'cut':
      return `切断${names.edge(a.target)}`;
    case 'duplicate':
      return `让${names.edge(a.target)}把 ${pct(a.rate)} 的请求投递两次`;
    case 'pause':
      return `让${names.node(a.target)}卡顿`;
    case 'cut-replies':
      return `让${names.edge(a.target)}丢失全部应答`;
  }
}

/** One fault with its timing. */
export function attackPhrase(a: Attack, names: Names): string {
  const dur = a.forMs === null ? '' : `，持续 ${secs(a.forMs)}`;
  return `${faultPhrase(a, names)}，发生在 ${secs(a.atMs)}${dur}`;
}

/** A whole schedule as one sentence. */
export function scheduleSentence(attacks: readonly Attack[], names: Names): string {
  const groups: Attack[][] = [];
  for (const a of attacks) {
    const last = groups[groups.length - 1];
    if (last && last[0].atMs === a.atMs) last.push(a);
    else groups.push([a]);
  }
  const text = groups
    .map((g) => g.map((a) => attackPhrase(a, names)).join('，'))
    .join('；随后 ');
  return `${text}。`;
}

export function windowPhrase(): string {
  return `在 ${secs(BREAK_WARMUP_MS)} 到 ${secs(BREAK_END_MS)} 之间`;
}

/** Whose requests a goal is about. */
function whose(goal: Goal, names: Names): string {
  return goal.route === undefined ? '请求' : `${names.node(goal.route)} 的请求`;
}

export function goalLine(goal: Goal, run?: SeedRun): string {
  if (run?.outcome === 'falling-behind') {
    return '持续增长的积压最终会让一切都失败，所以无论目标是什么，这都算被打破。';
  }
  switch (goal.metric) {
    case 'errorRate':
      return `目标是 ${formatGoalPct(goal.max)} 或更低。`;
    case 'p99':
      return `目标是 ${formatGoalMs(goal.max)} 或更低。`;
    case 'p95':
      return `目标是 ${formatGoalMs(goal.max)} 或更低。`;
    default:
      return goal.max === 0
        ? '目标是一次都不许发生。'
        : `目标是不超过 ${goal.max} 次。`;
  }
}

export function effectSentence(run: SeedRun, goal: Goal, names: Names): string {
  const who = whose(goal, names);
  const win = windowPhrase();
  if (run.outcome === 'nothing-completed') {
    return `${win}，${who}一个都没有成功。`;
  }
  if (run.outcome === 'falling-behind') {
    const share = formatShareDown(run.keptUp);
    const answered = (run.keptUp ?? 0) > 0.9 ? share : `只有 ${share}`;
    return `${win}，${who}堆积的速度超过了完成的速度：${answered}得到了应答，其余还在等待。`;
  }
  switch (goal.metric) {
    case 'errorRate':
      return run.actual === null
        ? `${win}，${who}没有一个得到应答。`
        : `${win}，${who}有 ${formatGoalPct(run.actual)} 失败。`;
    case 'p99':
      return `${win}，最慢的百分之一的${who}耗时达到 ${formatGoalMs(run.actual)} 或更久。`;
    case 'p95':
      return `${win}，最慢的百分之五的${who}耗时达到 ${formatGoalMs(run.actual)} 或更久。`;
    case 'lostWrites':
      return `${run.actual ?? 0} 个已保存的写入从未到达数据库。`;
    case 'lostJobs':
      return `${run.actual ?? 0} 个已被接受的任务后来失败了。`;
    case 'doubleCharges':
      return `${win}，有 ${run.actual ?? 0} 笔支付被扣款多次。`;
    case 'lostAckedWrites':
      return `${win}，有 ${run.actual ?? 0} 个客户端被告知已保存的写入从未到达存储。`;
    case 'staleReads':
      return `${win}，有 ${run.actual ?? 0} 次读取错过了同一客户端被告知已保存的写入。`;
    case 'queueDepth':
      return '';
  }
}

export function baselineSentence(run: SeedRun, goal: Goal, names: Names): string {
  const who = whose(goal, names);
  if (run.outcome === 'nothing-completed') return `无故障时，${who}一个都通不过。`;
  if (run.outcome === 'falling-behind') {
    return `无故障时，${who}就已经堆积得比完成得快。`;
  }
  switch (goal.metric) {
    case 'errorRate':
      return `无故障时，${who}有 ${formatGoalPct(run.actual)} 失败。`;
    case 'p99':
      return `无故障时，100 个${who}里有 99 个在 ${formatGoalMs(run.actual)} 内完成。`;
    case 'p95':
      return `无故障时，20 个${who}里有 19 个在 ${formatGoalMs(run.actual)} 内完成。`;
    case 'lostWrites':
      return `无故障时，${run.actual ?? 0} 个已保存的写入会丢失。`;
    case 'lostJobs':
      return `无故障时，${run.actual ?? 0} 个已接受的任务会失败。`;
    case 'doubleCharges':
      return run.actual === 0
        ? '无故障时，没有支付会被重复扣款。'
        : `无故障时，有 ${run.actual ?? 0} 笔支付会被重复扣款。`;
    case 'lostAckedWrites':
      return run.actual === 0
        ? '无故障时，客户端被告知已保存的写入都会到达存储。'
        : `无故障时，有 ${run.actual ?? 0} 个被告知已保存的写入最终不会到达存储。`;
    case 'staleReads':
      return run.actual === 0
        ? '无故障时，每次读取都能看到客户端被告知已保存的写入。'
        : `无故障时，有 ${run.actual ?? 0} 次读取会错过同一客户端被告知已保存的写入。`;
    case 'queueDepth':
      return '';
  }
}

export function phaseLine(phase: SearchPhase): string {
  switch (phase) {
    case 'baseline':
      return '正在测无故障时的表现';
    case 'remembered':
      return '正在试上次弄坏它的故障';
    case 'single':
      return '正在逐个试单一故障';
    case 'pair':
      return '正在试两个故障的组合';
    case 'triple':
      return '正在试三个故障的组合';
    case 'shrink':
      return '找到了突破口。正在缩小故障组合';
  }
}

export function closestLine(closest: Closest | null, goal: Goal, names: Names): string {
  if (closest === null || closest.score < 0.5) return '还没有接近目标的尝试。';
  const sentence = scheduleSentence(closest.attacks, names).slice(0, -1);
  if (closest.outcome === 'falling-behind' || closest.pilingUp) {
    return `最接近的一次：${sentence}。请求开始堆积。`;
  }
  switch (goal.metric) {
    case 'errorRate':
      return `最接近的一次：${sentence}。有 ${formatGoalPct(closest.actual)} 失败。`;
    case 'p99':
    case 'p95':
      return `最接近的一次：${sentence}。最慢的耗时 ${formatGoalMs(closest.actual)}。`;
    default:
      return `最接近的一次：${sentence}。`;
  }
}

export function triedLine(bySize: readonly [number, number, number]): string {
  const parts = [`单一故障：${bySize[0]} 种。`];
  if (bySize[1] > 0) parts.push(`两个同时：${bySize[1]} 种。`);
  if (bySize[2] > 0) parts.push(`三个同时：${bySize[2]} 种。`);
  return parts.join(' ');
}

/** Whether a Names.edge() string names a connection rather than a node. */
function isCable(what: string): boolean {
  return what.startsWith('the connection') || what.endsWith(' 的连接');
}

export function singlePointLines(
  points: readonly SinglePoint[],
  names: Names,
): string[] {
  const byClient = new Map<string, string[]>();
  for (const p of points) {
    const what = p.type === 'node' ? names.node(p.id) : names.edge(p.id);
    for (const c of p.clients) {
      const list = byClient.get(c);
      if (list) list.push(what);
      else byClient.set(c, [what]);
    }
  }
  // Parts first, cables after, so the sentence reads boxes then wires.
  return [...byClient].map(([c, parts]) => {
    const boxes = parts.filter((x) => !isCable(x));
    const cables = parts.filter((x) => isCable(x));
    return `来自${names.node(c)}的每个请求都必须经过${listed([...boxes, ...cables])}。`;
  });
}

/* ---------------- correctness evidence ---------------- */

function clock(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

function lostHow(reason: FailureReason, at: string): string {
  switch (reason) {
    case 'crashed':
      return `在${at}宕机时`;
    case 'partitioned':
      return `因与${at}的连接被切断`;
    case 'packet-loss':
      return `因来自${at}的链路丢包`;
    case 'timeout':
      return `因${at}保存它时超时`;
    default:
      return `因${at}保存它失败`;
  }
}

function times(n: number): string {
  return n === 2 ? '两次' : `${n} 次`;
}

export function evidenceSentence(v: Violation, names: Names): string {
  if (v.check === 'atMostOnce') {
    const at = v.chargedMs.map(clock);
    const told =
      v.outcome === 'ok'
        ? '客户端被告知扣款成功了。'
        : v.outcome === 'failed'
          ? '客户端被告知扣款失败了。'
          : '客户端一直没有得到应答。';
    const where = new Set(v.nodeIds);
    if (where.size > 1) {
      const each = v.nodeIds.map((id, i) => `在 ${at[i]} 于${names.node(id)}`);
      return `请求 ${v.rid} 被扣款了${times(v.chargedMs.length)}，${listed(each)}。${told}`;
    }
    return `请求 ${v.rid} 在${names.node(v.nodeId)}被扣款了${times(v.chargedMs.length)}，时间分别是 ${listed(at)}。${told}`;
  }
  if (v.check === 'readYourWrites') {
    return `请求 ${v.rid} 在 ${clock(v.readMs)} 于${names.node(v.nodeId)}读取了一条记录。同一客户端曾在 ${clock(v.savedMs)} 被告知请求 ${v.wroteRid} 保存了对它的修改，但这条修改直到 ${clock(v.visibleMs)} 才出现在读取结果里，所以这次读取拿到的是旧值。`;
  }
  if (v.copy === 'disk') {
    return `请求 ${v.rid} 在 ${clock(v.bufferedMs)} 由${names.node(v.nodeId)}保存，客户端也得到了确认，但它还在内存里。在它到达磁盘之前，${names.node(v.lostAt)}在 ${clock(v.lostMs)} 宕机，它随之丢失。`;
  }
  return `请求 ${v.rid} 在 ${clock(v.bufferedMs)} 被${names.node(v.nodeId)}暂存，客户端被告知它已保存。但在到达存储之前，它在 ${clock(v.lostMs)}${lostHow(v.reason, names.node(v.lostAt))}丢失。`;
}

/** One line of a request's story. */
function eventLine(e: TimelineEvent, names: Names, v?: Violation): string {
  const n = names.node;
  switch (e.type) {
    case 'invoke':
      return `${n(e.node)}发出了这个请求。`;
    case 'send':
      return e.attempt > 0
        ? `${n(e.from)}再次调用${n(e.to)}，第 ${e.attempt + 1} 次尝试。`
        : `${n(e.from)}调用了${n(e.to)}。`;
    case 'lost':
      return `${n(e.from)}发给${n(e.to)}的调用没有送达。`;
    case 'reply-lost':
      return e.ok
        ? `${n(e.node)}给出了应答，但应答在返回${n(e.to)}的路上丢了。`
        : `${n(e.node)}应答说它失败了，但应答在返回${n(e.to)}的路上丢了。`;
    case 'duplicate':
      return `这条连接把${n(e.from)}对${n(e.to)}的调用又投递了一次。`;
    case 'timeout':
      return `${n(e.node)}不再等待${n(e.to)}。那次尝试在那里继续运行。`;
    case 'retry':
      return `${n(e.node)}会再次尝试${n(e.to)}。`;
    case 'apply':
      if (v?.check === 'readYourWrites' && e.node === v.nodeId && e.t >= v.readMs) {
        return `${n(e.node)}应答了这次读取，此时请求 ${v.wroteRid} 的写入还没有出现。`;
      }
      if (!e.charge) return `${n(e.node)}完成了它这一步。`;
      return e.repeat ? `${n(e.node)}又一次扣了这笔款。` : `${n(e.node)}扣了这笔款。`;
    case 'dedupe':
      return e.inFlight
        ? `${n(e.node)}拒绝了它：同一个请求还在处理中。`
        : `${n(e.node)}已经处理过这个请求，直接返回了第一次的结果。`;
    case 'buffered':
      return e.disk
        ? `${n(e.node)}保存了它并给出确认，但还没有写入磁盘。`
        : `${n(e.node)}说它已保存，但只是放在内存里。`;
    case 'landed':
      return e.disk ? `${n(e.node)}把它写入了磁盘。` : `${n(e.node)}的副本到达了存储。`;
    case 'dropped':
      return e.disk
        ? `${n(e.node)}在写入磁盘之前宕机，它丢失了。`
        : `${n(e.node)}的副本丢失了${lostHow(e.reason, n(e.at))}。`;
    case 'answer':
      if (e.heard === 'client') {
        return e.ok ? '客户端得知请求成功了。' : '客户端得知请求失败了。';
      }
      if (e.heard === 'nobody') {
        return e.ok
          ? `${n(e.node)}完成了，但已经没有人在等这个应答。`
          : `${n(e.node)}失败了，但已经没有人在等这个应答。`;
      }
      return e.ok ? `${n(e.node)}给出了应答。` : `${n(e.node)}应答说它失败了。`;
  }
}

/** The tag an event's line is drawn with, mirroring the English rules. */
function eventTag(
  e: TimelineEvent,
  v?: Violation,
): 'charged-again' | 'lost' | 'stale' | null {
  switch (e.type) {
    case 'lost':
    case 'reply-lost':
    case 'dropped':
      return 'lost';
    case 'apply':
      if (e.charge && e.repeat) return 'charged-again';
      if (v?.check === 'readYourWrites' && e.node === v.nodeId && e.t >= v.readMs) {
        return 'stale';
      }
      return null;
    default:
      return null;
  }
}

export function timelineWords(
  tl: RequestTimeline,
  names: Names,
  v?: Violation,
): { t: number; text: string; tag: 'charged-again' | 'lost' | 'stale' | null }[] {
  const answered = new Set<string>();
  return tl.events.map((e) => {
    if (e.type === 'reply-lost') answered.add(`${e.to}|${e.node}|${e.attempt}`);
    if (e.type === 'timeout' && answered.has(`${e.node}|${e.to}|${e.attempt}`)) {
      return {
        t: e.t,
        text: `${names.node(e.node)}不再等待${names.node(e.to)}，此后再无音讯。`,
        tag: null,
      };
    }
    return { t: e.t, text: eventLine(e, names, v), tag: eventTag(e, v) };
  });
}

export function checkedLine(goal: Goal, checked: number): string {
  const n = formatCount(checked);
  const one = checked === 1;
  switch (goal.metric) {
    case 'doubleCharges':
      return `每个故障组合都已检查；无故障时相当于检查了 ${n} 笔支付。未检查的情况：客户端被告知失败却仍然被扣款的支付。`;
    case 'lostAckedWrites':
      return `每个故障组合都已检查；无故障时相当于检查了 ${n} 个被告知已${one ? '保存' : '保存'}的写入。`;
    case 'staleReads':
      return `每个故障组合都已检查；无故障时相当于检查了 ${n} 次读取自写入传播有延迟的存储。`;
    default:
      return '';
  }
}

export function truncatedLine(): string {
  return '并非每个请求都被检查：这个设计发出的请求超过了一次检查所能跟踪的 1,048,576 个上限，其后的请求被略过了。';
}

export function nothingRetriesLine(charged: readonly string[], names: Names): string {
  const parts = listed(charged.map(names.node));
  return `通往${parts}的路径上没有任何调用会重试，也没有连线尝试过重复投递，所以刚才的尝试不可能重复扣款。在它前面开启重试，或让搜索尝试把请求投递两次，才能真正测到它。`;
}

export function goneLine(id: string): string {
  switch (id.split(':')[0]) {
    case 'saved':
      return '设计中已经没有任何地方声明写入是先保存再确认的，所以不会有写入再以这种方式丢失。';
    case 'jobs':
      return '设计中已经没有任何地方为工作进程暂存任务，所以不会有任务再以这种方式丢失。';
    case 'fresh':
      return '设计中已经没有任何存储的读取落后于自己的写入，所以不会有读取再以这种方式错过写入。';
    case 'once':
      return '设计中已经没有任何地方会扣款了。';
    default:
      return '那个流量来源已经不在了。';
  }
}
