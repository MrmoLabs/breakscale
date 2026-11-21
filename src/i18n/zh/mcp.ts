/**
 * Chinese copy for the MCP server (mcp/src/*).
 *
 * The MCP server composes its answers from the same sentence builders the
 * app uses (breakCopy, already localized) plus its own connective text:
 * tool wrappers, the run report, validation errors and the break_it
 * verdict wrapper. Those strings live here as natural keys.
 *
 * Two deliberate gaps: the schema identifiers a model must output (kinds,
 * settings, metric names) stay English in every language, and the deep
 * validation strings that come from src/sim/verify.ts stay English because
 * the simulation layer never imports UI code. The read_me preface says so.
 */

export const zhMcp = {
  // server.ts wrappers
  'The design was not accepted:': '设计未被接受：',
  'Fix these and call again. read_me has the format.':
    '修正以上问题后重新调用。格式详见 read_me。',
  'Link to the design, which opens it on breakscale.tech: {url}':
    '设计链接（在 breakscale.tech 上打开）：{url}',
  'The design is too large for a link; use export_design to save it as a file.':
    '设计太大，无法放进链接；请改用 export_design 把它存成文件。',
  'A changed design can be shown by passing the whole updated design to create_view; keeping the node ids keeps the layout stable. Edits the user makes on the canvas are reported back as context.':
    '改动后的设计可以把完整的新设计再传给 create_view 来展示；保持节点 id 不变可以让布局保持稳定。用户在画布上的修改会作为上下文回报。',
  'The request was not accepted:': '请求未被接受：',
  'That is not a URL.': '这不是一个 URL。',
  'That link does not carry a Breakscale design.': '这个链接里没有 Breakscale 设计。',

  // run.ts describeRun
  'Simulated {secs}s with seed {seed}{short}.': '已仿真 {secs}s，种子 {seed}{short}。',
  ' (stopped at {secs}s of {total}s: the design is too heavy to simulate further here)':
    '（在 {total}s 中的 {secs}s 处停止：这个设计太重，这里无法继续仿真）',
  'Offered {offered}, served {served}, {failed} failed. Latency p50 {p50}, p95 {p95}, p99 {p99}.':
    '请求负载 {offered}，有效吞吐 {served}，失败 {failed}。延迟 p50 {p50}，p95 {p95}，p99 {p99}。',
  'Failed requests over the run: {list}.': '整个运行中失败的请求：{list}。',
  'By traffic source (each client and its own requests, end to end):':
    '按流量来源（每个客户端及其自己的请求，端到端）：',
  'offered {rate}': '负载 {rate}',
  'served {rate}': '吞吐 {rate}',
  '{pct} failed': '失败 {pct}',
  'p99 {ms}': 'p99 {ms}',
  'over the run {a} served, {b} failed': '整个运行 {a} 成功，{b} 失败',
  "- {name} (id '{id}'): {parts}; {over}": '- {name}（id ‘{id}’）：{parts}；{over}',
  'Components (busiest first):': '组件（按繁忙程度排序）：',
  '{in} in, {done} done': '进入 {in}，完成 {done}',
  '{pct} busy': '繁忙 {pct}',
  '{n} slots held waiting on its calls': '{n} 个槽位因等待下游调用而被占用',
  '{n} waiting': '排队 {n}',
  '{rate} turned away': '拒绝 {rate}',
  '{rate} timed out': '超时 {rate}',
  'hit rate {pct}': '命中率 {pct}',
  "- {label} ({kind}, id '{id}'): {parts}": '- {label}（{kind}，id ‘{id}’）：{parts}',

  // Failure reasons, keyed by the English phrase REASON_WORDS maps to
  'failed on their own (errorRate)': '自身出错（errorRate）',
  'were turned away by a full queue': '被满队列拒之门外',
  'timed out': '等待超时',
  'had nowhere to go': '无路可走',
  'looped past the hop limit': '超过跳数上限',
  'were refused by a rate limiter': '被限流器拒绝',
  'were refused by an open circuit breaker': '被打开的熔断器拒绝',
  'hit a crashed component': '撞上了已宕机的组件',
  'crossed a cut network link': '经过了被切断的链路',
  'found no region serving': '没有区域在提供服务',
  'were refused a websocket connection': 'WebSocket 连接被拒绝',
  'failed authentication at the API gateway': '在 API 网关认证失败',
  'were refused by a full bulkhead': '被已满的舱壁隔离拒绝',
  'gave up waiting for a pool slot': '等待连接池槽位超时放弃',
  'were dropped by a load shedder': '被负载削减器丢弃',
  'were lost on a lossy network link (lossRate)': '在不稳定链路上丢失（lossRate）',

  // breakIt.ts wrapper
  'the cable from {a} to {b}': '{a} 到 {b} 的连接',
  'The budget was cut from {n} to {max} schedules, the most this server tries in one call.':
    '预算已从 {n} 个故障组合削减到 {max} 个，这是本服务器单次调用尝试的上限。',
  'Failed requests in that window: {list}.': '该时间窗内失败的请求：{list}。',
  "What happened to request {rid}, on the replay's clock:":
    '回放时钟下，请求 {rid} 的经历：',
  'And {n} more steps.': '还有 {n} 步。',
  "The design's own faults were left out; the search picks its own.":
    '设计自带的故障已被忽略；搜索会自己挑选故障。',
  'It already misses the goal with no faults, on seed {seed}.':
    '不加任何故障、用种子 {seed} 时，它就已经不达标了。',
  'Nothing was tried, so this is not a pass: with these options no fault can land anywhere in the design.':
    '什么都没试成，所以这不算通过：在这些选项下，没有任何故障能在设计里落地。',
  'Each fault started between 10s and 15s, and the goal was measured from 5s to 35s.':
    '每个故障都在第 10s 到 15s 之间注入，目标从第 5s 到 35s 计量。',
  "It stopped at this server's limit of {n} simulated seconds.":
    '在本服务器 {n} 仿真秒的上限处停止。',
  'There were no more schedules to try with these options.':
    '在这些选项下已经没有更多故障组合可试了。',
  'That used the part of the budget these options allow: {a} of {b} schedules.':
    '这用完了这些选项允许的预算：{b} 个故障组合中的 {a} 个。',
  ' With maxFaults 2 or 3 the rest goes to faults together.':
    '把 maxFaults 设为 2 或 3，剩余预算会用于多故障组合。',
  'That was the whole budget. Up to {max} schedules can be tried.':
    '这就是全部预算。最多可以尝试 {max} 个故障组合。',
  'No schedule came close.': '没有任何故障组合接近目标。',
  'It broke on seed {seed} and on another seed too. ':
    '它在种子 {seed} 下失败，换一个种子也失败。',
  'No smaller schedule breaks it.': '没有更小的故障组合能弄坏它。',
  'A smaller schedule might still break it.': '可能还存在更小的故障组合能弄坏它。',
  'Replay link, which plays the same run on breakscale.tech: {url}':
    '回放链接（在 breakscale.tech 上播放同一次运行）：{url}',
  'The design is too large for a replay link. Passing it to create_view with seed {seed} and these faults plays the same run: {faults}':
    '设计太大，放不进回放链接。把它连同种子 {seed} 和这些故障传给 create_view，即可播放同一次运行：{faults}',
  'Single points of failure:': '单点故障：',
  'Losing one of these breaks any goal, so the search never crashed, failed or cut them whole. It could still slow them and take down single machines. includeSinglePoints true crashes and cuts them too.':
    '失去其中任何一个都会让所有目标失败，所以搜索从不去整体弄崩、搞挂或切断它们，但仍会变慢它们、弄掉单台机器。传 includeSinglePoints true 可以连它们一起弄崩和切断。',
  'charged again': '重复扣款',
  lost: '丢失',
  stale: '旧值',

  // design.ts validation
  'A design is an object with `nodes` and `edges`.':
    '设计是一个带 `nodes` 和 `edges` 的对象。',
  '`nodes` must be a non-empty array.': '`nodes` 必须是非空数组。',
  'That is {n} nodes; the limit is {max}.': '这里有 {n} 个节点；上限是 {max}。',
  '`edges` must be an array.': '`edges` 必须是数组。',
  '{where} is not an object.': '{where} 不是对象。',
  "{where} needs an `id`, a short unique string like 'api' or 'db'.":
    '{where} 需要一个 `id`：类似 ‘api’ 或 ‘db’ 的简短唯一字符串。',
  "Two nodes share the id '{id}'. Ids must be unique.":
    '两个节点共用了 id ‘{id}’。id 必须唯一。',
  '{name} has kind {kind}, which is not a component.':
    '{name} 的 kind 是 {kind}，这不是一个组件。',
  " Did you mean '{hint}'?": ' 你是不是想用 ‘{hint}’？',
  ' Kinds: {list}.': ' 可用的 kind：{list}。',
  '{where} needs `from` and `to`, each a node id.':
    '{where} 需要 `from` 和 `to`，各为一个节点 id。',
  "{where} goes from '{from}' to '{to}', but there is no node {missing}.":
    '{where} 从 ‘{from}’ 连到 ‘{to}’，但这些节点不存在：{missing}。',
  "{where} connects '{from}' to itself.": '{where} 把 ‘{from}’ 连到了它自己。',
  "{where} goes from {sourceKind} '{from}' into {targetKind} '{to}'. A {sourceKind} wired to a {targetKind} drains it, whichever way the edge points. If '{from}' consumes '{to}', draw it as '{to}' to '{from}'. If '{from}' publishes to '{to}', put a service between them.":
    '{where} 从 {sourceKind} ‘{from}’ 连到了 {targetKind} ‘{to}’。无论边朝哪个方向，{sourceKind} 连到 {targetKind} 都会把它抽干。如果 ‘{from}’ 是在消费 ‘{to}’，请画成 ‘{to}’ 到 ‘{from}’；如果 ‘{from}’ 是发布到 ‘{to}’，请在它们之间放一个服务。',
  "{where} repeats the connection '{from}' to '{to}'.":
    '{where} 重复了 ‘{from}’ 到 ‘{to}’ 的连接。',
  '{where} has weight {v}; use a number, 0 or more.':
    '{where} 的 weight 是 {v}；请用 0 或更大的数字。',
  '{where} has lossRate {v}; use a fraction from 0 to 1, so 0.05 drops 5%.':
    '{where} 的 lossRate 是 {v}；请用 0 到 1 之间的小数，例如 0.05 表示丢 5%。',
  '`faults` must be an array.': '`faults` 必须是数组。',
  '`seed` is {v}; use a whole number from 0 to {max}.':
    '`seed` 是 {v}；请用 0 到 {max} 之间的整数。',
  'The design could not be built. This is a bug.': '设计无法构建。这是我们的 bug。',
  '{name} has a `config` that is not an object.': '{name} 的 `config` 不是对象。',
  "{name} ({kind}) has no setting '{key}'.": '{name}（{kind}）没有 ‘{key}’ 这个设置。',
  ' Its settings are {list}.': ' 它的设置有：{list}。',
  "{name}: '{key}' must be one of {list}.": '{name}：‘{key}’ 必须是 {list} 之一。',
  "{name}: '{key}' must be a number, 0 or more; got {v}.":
    '{name}：‘{key}’ 必须是 0 或更大的数字；实际是 {v}。',

  // read_me zh preface, referenced by key from server.ts
  READ_ME_ZH_PREFACE:
    '# Breakscale 设计格式（中文导读）\n\n以下英文参考逐一列出每个组件及其全部设置。组件的 kind 与设置名是必须原样使用的英文标识符（如 service、cacheAside、serviceMs），goal 的指标名（errorRate、p99、doubleCharges 等）也是。除这些标识符外，可以用中文描述设计。\n\n要点：\n\n1. 一个设计就是 nodes 和 edges 两个数组；每个节点只需 id 和 kind，其余设置都有默认值。\n2. 一个节点的容量是 capacity × instances；超出的请求排队，队列也满就被拒绝。\n3. 服务在等待下游时会一直占着自己的槽位，所以慢数据库会把前面的服务一起拖满。\n4. 流量以每秒请求数计；利用率超过 80% 后 p99 会急剧上升。\n5. 仿真完全确定：同一个设计加同一个种子，永远得到同样的结果。\n\n下面的英文部分是权威清单，字段名保持英文。',
};
