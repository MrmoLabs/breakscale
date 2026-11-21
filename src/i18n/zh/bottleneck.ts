/**
 * Chinese mirror of the "Find the problem" verdict sentences.
 *
 * bottleneck.ts picks which part is holding the system back and composes the
 * sentence from the snapshot's own numbers; Chinese word order differs too
 * much to patch a suffix on. So every sentence builder there has a
 * counterpart here, and bottleneck.ts dispatches to these when the locale is
 * zh. The English path there is byte-identical to what it always was, which
 * is what bottleneck's tests pin.
 *
 * Node names arrive already translated: bottleneck.ts reads every label
 * through displayLabel before it calls these (the identity in English), and
 * the composed state clauses it hands over are already Chinese, because
 * stateClause dispatches its own pieces. Only the connective text is handled
 * here, and the numbers arrive raw so the shared formatters format them
 * exactly as the English sentences do.
 *
 * Copy rules as everywhere: plain language, no em dashes, full-width
 * punctuation.
 */

import type { ActiveFailure } from '../../sim/types';
import {
  formatCount,
  formatMs,
  formatPct,
  formatRateBare,
} from '../../components/format';

export function idleText(): string {
  return '还没有请求在流动，所以暂时谈不上有谁在硬撑。';
}

export function healthyText(name: string | null, fill: number | null): string {
  return name !== null && fill !== null
    ? `现在没有哪个组件在硬撑。最忙的组件是${name}，容量用掉了 ${formatPct(fill)}。`
    : '现在没有哪个组件在硬撑。';
}

export function gateText(name: string, refused: number): string {
  return `没有谁满了。${name}每秒有意拒绝 ${formatRateBare(refused)} 个请求，这正是它的职责。`;
}

export function failingText(name: string, errorRate: number): string {
  return `没有谁满了，但${name}有 ${formatPct(errorRate)} 的请求在失败。`;
}

export function logText(name: string, lag: number, expired: number): string {
  return `${name}：它最慢的消费者落后了 ${formatCount(lag)} 条消息，每秒还有 ${formatRateBare(expired)} 条没等到被读取就过期了。`;
}

/** A caller timing out on the slow part, as the verdict blames it. */
export function gaveUpBlame(name: string, gaveUp: number): string {
  return `${name}正在放弃等待它，每秒 ${formatRateBare(gaveUp)} 次超时。`;
}

export function allWaitingBlame(name: string): string {
  return `${name}的所有槽位都在等它调用的下游返回。`;
}

export function slowAnswer(name: string, p99: number, blame: string): string {
  return `${name}应答很慢，p99 达到 ${formatMs(p99)}。${blame}`;
}

/** The verdict sentence: the name, then the state clause, then the causes. */
export function struggleText(name: string, clause: string, rest: string): string {
  return `${name}：${clause}。${rest}`;
}

/* ---- stateClause pieces ---- */

export function slotsTakenHeld(slots: number, working: number, held: number): string {
  return `全部 ${formatCount(slots)} 个槽位都被占住，${formatCount(working)} 个在干活，${formatCount(held)} 个在等下游的调用`;
}

export function slotsBusy(slots: number): string {
  return `全部 ${formatCount(slots)} 个槽位都被占用`;
}

export function busiestPartition(fill: number): string {
  return `它最忙的分片用到了 ${formatPct(fill)}`;
}

export function copiesRunning(n: number): string {
  return `${formatCount(n)} 个并发副本全部在运行`;
}

export function connectionsInUse(n: number): string {
  return `${formatCount(n)} 个连接全部被占用`;
}

export function pctBusy(fill: number): string {
  return `用到了 ${formatPct(fill)}`;
}

export function waitingInBuffer(n: number, feedName: string | null): string {
  return feedName === null
    ? `有 ${formatCount(n)} 个在排队等待`
    : `有 ${formatCount(n)} 个在${feedName}里等待`;
}

export function waitingInLine(n: number): string {
  return `有 ${formatCount(n)} 个在排队等待`;
}

export function turningAway(refused: number): string {
  return `每秒拒绝 ${formatRateBare(refused)} 个`;
}

/* ---- the clauses that follow the state clause ---- */

export function feedFull(name: string, shed: number): string {
  return `${name}已经满了，每秒拒绝 ${formatRateBare(shed)} 个。`;
}

export function feedGrowing(name: string, arrival: number, done: number): string {
  return `${name}每秒接收 ${formatRateBare(arrival)} 个请求，但每秒只能完成 ${formatRateBare(done)} 个，队伍越来越长。`;
}

export function stuckBehind(name: string, waiting: number): string {
  return `${name}被它堵住了，有 ${formatCount(waiting)} 个请求在等它调用的下游返回。`;
}

/* ---- the fault verdicts ---- */

/** A service-time multiplier in Chinese words: `5 倍`, as `formatFactor` prints `5×`. */
function factorWords(f: number): string {
  return `${Number.isInteger(f) ? f : f.toFixed(1)} 倍`;
}

/**
 * The verdict for a fault the student injected. `clause`, `feed` and
 * `upstream` arrive already composed in the current locale; `struggling`
 * picks between the "keeping up for now" and "now ..." forms.
 */
export function faultText(
  f: ActiveFailure,
  name: string,
  struggling: boolean,
  clause: string,
  feed: string,
  upstream: string,
): string {
  switch (f.kind) {
    case 'crash':
      return `${name}：你把它弄崩了，所以发给它的所有请求都会失败。`;
    case 'restart':
      return `${name}：你重启了它，所以在它恢复之前，发给它的所有请求都会失败。`;
    case 'pause':
      return `${name}：你让它卡顿了，它手头的活都得等着，会放弃的调用方还可能把请求再发一遍。`;
    case 'errors':
      return `${name}：你让它对 ${formatPct(f.rate ?? 0)} 的请求返回错误。`;
    case 'partition': {
      const cut = f.edgeIds?.length ?? 0;
      return `${name}：你切断了它的 ${cut} 条连线，所以经过这些连线的请求都会失败。`;
    }
    case 'crash-instance':
    case 'slow': {
      const did =
        f.kind === 'slow'
          ? `你把它变慢了 ${factorWords(f.factor ?? 1)}`
          : '你弄崩了它的一台机器';
      if (!struggling) return `${name}：${did}，它目前还跟得上。`;
      return `${name}：${did}。现在${clause}。${feed}${upstream}`;
    }
  }
}
