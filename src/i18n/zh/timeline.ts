/**
 * Chinese mirror of the "What just happened" tracker sentences.
 *
 * timeline.ts composes its lines at the moment the snapshot showed them, and
 * Chinese word order differs too much to patch a suffix on: "The link from A
 * to B was cut." becomes “A 到 B 的连接被切断了。”, with the verb last. So
 * every sentence builder there has a counterpart here with the same shape,
 * and timeline.ts dispatches to these when the locale is zh. The English path
 * there is byte-identical to what it always was, which is what timeline's
 * tests pin.
 *
 * Node names arrive already translated: timeline.ts reads every label through
 * displayLabel before it calls these (the identity in English). Only the
 * connective text is handled here, and the numbers arrive raw so the shared
 * formatters format them exactly as the English lines do.
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
import { formatDownFor } from '../../components/faultWiring';

/** The settings fields a student often changes, by their English word. */
const FIELD_WORDS: Record<string, string> = {
  instances: '实例数',
  'slots per instance': '每实例槽位数',
  'service time': '服务时长',
  'room in its line': '队列上限',
  timeout: '超时',
  retries: '重试次数',
};

/** The name used for a part the design no longer has. */
export function removedPartName(): string {
  return '已被移除的组件';
}

export function addedPart(name: string): string {
  return `你添加了${name}。`;
}

export function removedPart(name: string | null): string {
  return name === null ? '你移除了一个组件。' : `你移除了${name}。`;
}

export function fieldChange(
  name: string,
  words: string,
  from: number,
  to: number,
  show: (v: number) => string,
): string {
  const w = FIELD_WORDS[words] ?? words;
  return `你把${name}的${w}从 ${show(from)} 改成了 ${show(to)}。`;
}

export function settingsChange(name: string): string {
  return `你改动了${name}的其他设置。`;
}

export function loadChange(from: number, to: number): string {
  const dir = to > from ? '提高' : '降低';
  return `你把负载从每秒 ${formatRateBare(from)} ${dir}到了每秒 ${formatRateBare(to)}。`;
}

/** A service-time multiplier in Chinese words: `5 倍`, as `formatFactor` prints `5×`. */
function factorWords(f: number): string {
  return `${Number.isInteger(f) ? f : f.toFixed(1)} 倍`;
}

/** One injected fault, as the tracker reports it happening. */
export function faultLine(f: ActiveFailure, name: string): string {
  switch (f.kind) {
    case 'crash':
      return `${name}崩溃了。`;
    case 'crash-instance':
      return `${name}的一台机器崩溃了。`;
    case 'restart':
      return `${name}重启了。`;
    case 'pause':
      return `${name}卡顿了 ${formatDownFor(f.pauseMs ?? 0)}。`;
    case 'slow':
      return `${name}慢了 ${factorWords(f.factor ?? 1)}。`;
    case 'errors':
      return `${name}开始对 ${formatPct(f.rate ?? 0)} 的请求返回错误。`;
    case 'partition': {
      const cut = f.edgeIds?.length ?? 0;
      return `${name}有 ${cut} 条连线被切断。`;
    }
  }
}

export function backUp(name: string): string {
  return `${name}恢复运行了。`;
}

export function carriesOn(name: string): string {
  return `${name}继续工作了。`;
}

export function faultCleared(name: string): string {
  return `${name}上的故障已清除。`;
}

/** A link as the reader says it: “A 到 B 的连接”， as the connection tool names it. */
export function linkPhrase(ends: readonly [string, string] | null): string {
  return ends ? `${ends[0]} 到 ${ends[1]} 的连接` : '两个组件之间的连接';
}

export function linkCut(link: string): string {
  return `${link}被切断了。`;
}

export function linkRestored(link: string): string {
  return `${link}恢复了。`;
}

export function linkDupStart(link: string, rate: number): string {
  return `${link}开始把 ${formatPct(rate)} 的请求投递两次。`;
}

export function linkDupEnd(link: string): string {
  return `${link}恢复为每个请求只投递一次。`;
}

export function linkReplyCutStart(link: string): string {
  return `${link}开始丢失返回的应答。`;
}

export function linkReplyBack(link: string): string {
  return `${link}又能把应答送回来了。`;
}

export function linkReplyBackWaiting(link: string, waiting: number): string {
  return `${link}又能把应答送回来了，但还有 ${formatCount(waiting)} 个调用在等它之前弄丢的那些应答。`;
}

/** A part running full: the name, then the state clause from bottleneck. */
export function struggleLine(name: string, clause: string): string {
  return `${name}：${clause}。`;
}

export function waitingLine(
  name: string,
  waiting: number,
  slots: number | null,
): string {
  const n = formatCount(waiting);
  return slots === null
    ? `${name}：有 ${n} 个槽位被等下游的调用占住。`
    : `${name}：${formatCount(slots)} 个槽位里有 ${n} 个被等下游的调用占住。`;
}

export function refusingStart(name: string, rate: number): string {
  return `${name}开始拒绝每秒 ${formatRateBare(rate)} 个请求。`;
}

export function givingUpStart(name: string, rate: number): string {
  return `${name}开始放弃太慢的调用，每秒 ${formatRateBare(rate)} 次。`;
}

export function keepingUp(name: string): string {
  return `${name}又跟得上了。`;
}

export function errorsStart(rate: number): string {
  return `有 ${formatPct(rate)} 的请求开始失败。`;
}

export function worstSoFar(rate: number): string {
  return `目前最糟：${formatPct(rate)} 的请求失败。`;
}

export function throughAgain(rate: number): string {
  return rate > 0
    ? `请求又能通过了，只有 ${formatPct(rate)} 失败。`
    : '请求又能通过了，没有失败的。';
}

export function p99Crossed(ms: number): string {
  return `p99 越过了 1s：最慢的百分之一的请求耗时达到 ${formatMs(ms)}。`;
}

export function p99Back(ms: number): string {
  return `p99 回到 1s 以内，目前是 ${formatMs(ms)}。`;
}
