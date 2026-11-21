/**
 * Chinese interface copy for the teaching panels: examples, challenges,
 * incidents, the "Can you break it?" panel, metrics charts, trace. Same
 * contract as chrome.ts.
 *
 * Keys already living in another dictionary are not repeated here ('Can you
 * break it?' and 'Learning path' in app.ts, 'Pin this run' and 'Clear the
 * pinned run' in ops.ts, 'retry', 'waiting', 'Client', 'p99' and 'jobs' in
 * canvas.ts, 'bad auth' in canvas.ts, 'packet loss' in app.ts): the merged
 * map in i18n/index.ts answers for them. */

export const zhPanels: Record<string, string> = {
  // Metrics strip: chart chrome, units, legend, empty states
  pinned: '已固定',
  now: '现在',
  '/s': '/s',
  'succeeded /s': '成功/秒',
  Latency: '延迟',
  Throughput: '吞吐量',
  Failures: '失败',
  'By traffic source': '按流量来源',
  'Latency over the last 60 seconds': '最近 60 秒的延迟',
  'Throughput over the last 60 seconds': '最近 60 秒的吞吐量',
  'Failures over the last 60 seconds': '最近 60 秒的失败',
  'Each traffic source over the last 60 seconds': '最近 60 秒的各流量来源',
  'Latency chart. Arrow keys read each sample.': '延迟图。用方向键逐个读数。',
  'Throughput chart. Arrow keys read each sample.': '吞吐量图。用方向键逐个读数。',
  'Failures chart. Arrow keys read each second.': '失败图。用方向键逐秒读数。',
  'Traffic source chart. Arrow keys read each sample.':
    '流量来源图。用方向键逐个读数。',
  Show: '显示',
  // 'Failing' and 'Lost' are translated in inspector.ts (shared Term labels).
  offered: '请求负载',
  succeeded: '成功',
  lost: '丢失',
  idle: '空闲',
  // 'none' is the challenge goal's zero line; inspector.ts's 'none' is a
  // field's "no limit" (不限), which would read wrong here, so this file
  // keeps its own entry and wins the merge in i18n/index.ts.
  none: '无',
  'none failing': '没有失败',
  '{v}/s succeeded': '成功 {v}/s',
  '{rate} failing': '失败 {rate}',
  '{at}: p50 {p50}, p95 {p95}, p99 {p99}': '{at}：p50 {p50}，p95 {p95}，p99 {p99}',
  '{at}: offered {offered} a second, succeeded {goodput} a second, lost {lost}':
    '{at}：请求负载 {offered}/秒，成功 {goodput}/秒，丢失 {lost}',
  '{at}: {list}': '{at}：{list}',
  'Nothing was failing {at}.': '{at}没有任何失败。',
  'Nothing was failing {at}': '{at}没有任何失败',
  'Recovered. Nothing is failing now.': '已恢复。现在没有任何失败。',
  'Nothing has failed in the last 60 seconds.': '最近 60 秒内没有任何失败。',
  // 'Add a client to send traffic.' is translated in inspector.ts (the same
  // sentence appears in the inspector's traffic note).
  'Press play to start the clock.': '按播放键开始计时。',
  'Waiting for traffic': '等待流量',
  'No traffic yet.': '还没有流量。',

  // Failure reasons, as the breakdown legend prints them (REASON_LABEL).
  // 'bad auth' and 'packet loss' already have entries elsewhere.
  error: '错误',
  'turned away': '被拒之门外',
  timeout: '超时',
  'no route': '无路可走',
  depth: '跳数超限',
  throttled: '被限流',
  'circuit open': '熔断打开',
  crashed: '宕机',
  partitioned: '被断连',
  'region down': '区域不可用',
  'connection refused': '连接被拒',
  'bulkhead full': '舱壁已满',
  'acquire timeout': '等待槽位超时',
  'cut for priority': '因优先级被削减',

  // Time stamp of a chart readout (chartReadout.ts)
  'at {s}s': '{s}s 时',

  // Request trace (Trace.tsx)
  'Request trace': '单次请求追踪',
  'One request': '单个请求',
  'Waiting for a request to finish. Press play, or raise the load.':
    '等待一个请求跑完。按播放，或调高负载。',
  'Most of this request was spent waiting, not working.':
    '这个请求的大部分时间花在排队上，而不是被处理。',
  'Almost all of this was real work. Nothing was queueing.':
    '这些时间几乎全是真正的处理。没有排队。',
  'Waiting and working are close, so nothing is backed up yet.':
    '排队和处理的时间差不多，还没有积压。',
  'This one did not finish:': '这一次没有跑完：',
  '. The hops below are how far it got.': '。下面各段是它走到了哪里。',
  // 'waiting' is canvas.ts's readout word (排队).
  'working {ms}': '处理 {ms}',

  // "Can you break it?" (BreakIt.tsx)
  'Show the panel': '展开面板',
  'Fold the panel': '折叠面板',
  'Still breaks.': '仍然会被破坏。',
  'Broke it.': '破坏成功。',
  'Held.': '守住了。',
  'Already broken.': '本来就已经坏了。',
  'Stopped.': '已停止。',
  'Held across {n} fault schedule.': '试了 {n} 套故障方案，都守住了。',
  'Held across {n} fault schedules.': '试了 {n} 套故障方案，都守住了。',
  'Already broken with no faults.': '不加任何故障就已经坏了。',
  'You changed the design after this ran. A replay plays it as it was.':
    '这次运行之后你改动了设计。回放会按当时的样子来放。',
  'Broke at: {schedule} Change the design, then run it again. Those faults are tried first.':
    '破坏点：{schedule} 改一改设计，然后再跑一次。会先试这些故障。',
  'Show the verdict': '显示判定结果',
  'Replay done': '回放结束',
  'Replay {a} of {b}': '回放 {a}/{b}',
  'Stop replay': '停止回放',
  Replay: '回放',
  'The first fault lands at {at}, in {n}s.': '第一个故障在 {at} 落下，还有 {n}s。',
  'Pick what has to hold. Breakscale throws faults at your design until it fails, or until it runs out of tries.':
    '选一样必须守住的东西。Breakscale 会一直朝你的设计扔故障，直到它失败，或者尝试次数用完。',
  'Pick another goal.': '换一个目标。',
  'Pick another goal': '换一个目标',
  'What has to hold': '要守住什么',
  'Keep {who} up': '让{who}保持可用',
  'Keep everyone up': '让所有组件保持可用',
  'Keep {who} fast': '让{who}保持快速',
  'Stay fast': '保持快速',
  'No lost writes': '不丢失写入',
  'No lost jobs': '不丢失任务',
  'Every payment charged at most once': '每笔付款至多扣一次款',
  'No saved write is lost': '已保存的写入不丢失',
  'Read your own writes': '自己写的要能读到',
  'Fewer than': '少于',
  '% of requests fail.': '% 的请求失败。',
  '% of their requests fail.': '% 的该来源请求失败。',
  // 'percent' and 'milliseconds' are translated in inspector.ts.
  '99 in 100 requests finish within': '每一百个请求里有九十九个不超过',
  '99 in 100 of their requests finish within': '该来源的每一百个请求里有九十九个不超过',
  'ms.': 'ms。',
  'At most': '至多',
  'saved writes are lost.': '条保存的写入丢失。',
  'payments are charged more than once.': '笔付款被扣款多次。',
  'writes the client was told were saved are lost.': '条客户端被告知已保存的写入丢失。',
  'reads miss a write the same client was told was saved.':
    '次读取没读到同一客户端被告知已保存的写入。',
  'accepted jobs fail.': '个已接收的任务失败。',
  writes: '条写入',
  payments: '笔付款',
  reads: '次读取',
  // 'jobs' is canvas.ts's readout word (任务).
  'Fewer than how many percent': '要少于百分之多少',
  '99 in 100 requests finish within how many milliseconds':
    '每一百个请求里有九十九个不超过多少毫秒',
  '99 in 100 of their requests finish within how many milliseconds':
    '该来源的每一百个请求里有九十九个不超过多少毫秒',
  'At most how many writes': '至多多少条写入',
  'At most how many payments': '至多多少笔付款',
  'At most how many reads': '至多多少次读取',
  'At most how many jobs': '至多多少个任务',
  'Pick the part that charges the card to measure it.':
    '先标出会扣款的部件，才能测量它。',
  'That is the worst of three runs of traffic.': '这是三次流量运行中最差的一次。',
  'Measuring it with no faults…': '正在不加故障地测量…',
  'Single points of failure': '单点故障',
  'Each of these is a single point of failure. This goal is about the data, not about staying up, so the search crashes and cuts them like any other part.':
    '这里的每一个都是单点故障。这个目标关乎数据，而不是能不能撑住，所以搜索会像对待其他组件一样，让它们宕机或被切断。',
  'Each of these is a single point of failure: lose one and that traffic has nowhere to go, which breaks any goal. So the search only slows them and takes down single machines.':
    '这里的每一个都是单点故障：少了一个，那路流量就没有去处，什么目标都守不住。所以搜索只把它们变慢，或只打掉单台机器。',
  'Crash and cut them too': '也让它们可以宕机和被切断',
  'What can go wrong': '会有哪些故障',
  'Kinds of fault': '故障类型',
  Crashes: '宕机',
  'Losing one instance': '打掉一台实例',
  Slowdowns: '变慢',
  // 'Random errors' is translated in inspector.ts.
  'Cut connections': '切断连接',
  'Requests delivered twice': '请求被投递两次',
  'Stalls (a process pauses)': '停顿（进程暂停）',
  'Answers lost on the way back': '返回的应答丢失',
  'Up to': '最多',
  'faults at once': '个故障同时发生',
  'Leave these alone:': '别动这些：',
  'Try to break it': '试着破坏它',
  'Stopped after {tried} of {budget}. Nothing broke it yet.':
    '在试到 {tried}/{budget} 后停下。还没有东西能破坏它。',
  Starting: '正在开始',
  '{tried} of {budget} tried': '已试 {tried}/{budget}',
  ' of ': ' / ',
  ' tried': ' 已试',
  ', then ': '，然后 ',
  ' smaller versions': ' 个更小的版本',
  'Now: {list}': '当前：{list}',
  'The break from last time holds now. Looking for another way in.':
    '上次找到的破坏方法现在依然奏效。正在找别的路。',
  '{n} breaks from before hold now. Looking for another way in.':
    '之前的 {n} 种破坏方法现在依然奏效。正在找别的路。',
  '{name} is gone, so that one no longer applies.': '{name}已经不在了，那条不再适用。',
  '{name} is gone, so that break no longer applies.':
    '{name}已经不在了，那个破坏方法不再适用。',
  'Keep going': '继续',
  'Change the goal': '换个目标',
  Stop: '停止',
  'It is already broken with no faults.': '不加任何故障，它就已经坏了。',
  'Each landed between 10s and 15s, and the goal was measured from 5s to 35s on three runs of traffic.':
    '每次故障都在 10s 到 15s 之间落下，目标在三次流量运行中从 5s 量到 35s。',
  'You fixed the way it broke last time.': '你修好了上次被破坏的地方。',
  'You fixed {n} ways it broke.': '你修好了 {n} 处会被破坏的地方。',
  'Try harder': '再试更难的',
  'The same faults as last time.': '用的和上次相同的故障。',
  'Found on try {n}, then made smaller in {m} more.':
    '在第 {n} 次尝试时找到，又用 {m} 次把它变小。',
  'Found on try {n}.': '在第 {n} 次尝试时找到。',
  'It broke on this run of traffic and on another one too.':
    '它在这次流量运行和另一次运行中都坏了。',
  'Watch the replay': '观看回放',
  'Replay link': '回放链接',
  'Try to fix it': '试着修好它',
  'Run again': '再跑一次',
  'A payment charged twice breaks the ': '一笔付款被扣了两次款，就破坏了',
  'at most once': '至多一次',
  ' rule. It happens when a call that already charged looks failed to its caller, after a ':
    '规则。原因通常是：一笔已经扣款的调用，在调用方看来像是失败了，比如遇到了',
  ' or an error further on, and the ': '或者后面某处报错，于是',
  ' charges again, or when the network delivers the same call twice. An ':
    '又扣了一次款；也可能是网络把同一个调用送到了两次。在扣款的那一环加上',
  ' on the part that charges is the usual fix.': '是常用的修法。',
  'Counts every ': '统计每一笔',
  'acknowledged write': '已确认的写入',
  ' that never reaches storage, a ': '，也就是从未真正到达存储的',
  'lost write': '丢失的写入',
  '. A write still on its way when the run ends is not counted.':
    '。运行结束时仍在途中的写入不计入。',
  'Checks ': '检查的是',
  'read your writes': '读己之写',
  ': once a client is told a write was saved, its next read of that record should show it. A ':
    '：一旦客户端被告知写入已保存，它下一次读这条记录就该读到它。',
  'replica that is behind': '落后的只读副本',
  ' serves a ': '则可能返回',
  'stale read': '旧读（读到旧值）',
  ' instead.': '。',
  "Counted at {list}, where each finished call charges money. Change it in the part's settings.":
    '在{list}处计数，每次完成的调用在那里扣款。要改就去那个部件的设置里改。',
  'Which part charges the card?': '哪个部件会扣款？',
  'Pick one': '选一个',
  Hide: '隐藏',
  Follow: '追踪',
  ' request ': '请求 ',
  'Charged again': '再次扣款',
  Stale: '旧读',

  // The active brief (Challenge.tsx). The 'Challenge' kicker is app.ts's label.
  'Next challenge': '下一个挑战',
  'Show the brief': '展开简报',
  'Hide the brief': '收起简报',
  Changed: '已改动',
  'Not checked yet': '还没有检查过',
  Checking: '正在检查',
  Passed: '通过',
  'Not yet': '还没通过',
  'Falling behind': '跟不上',
  'Over budget': '超出预算',
  'Cannot check yet': '还无法检查',
  'As it starts': '按初始设计',
  'Slowest 1 in 100 requests (p99)': '最慢的百分之一请求（p99）',
  'Slowest 1 in 20 requests (p95)': '最慢的二十分之一请求（p95）',
  'Requests lost': '丢失的请求',
  'Saves that never reached the database': '始终没有到达数据库的写入',
  'Accepted jobs that failed later': '已接收但后来失败的任务',
  'Jobs still waiting in the queue': '仍在队列里排队的任务',
  'Payments charged more than once': '被扣款多次的付款',
  'Saved writes that never reached storage': '始终没有到达存储的已保存写入',
  'Reads that missed their own saved write': '没读到已保存写入的读取',
  '{name}: {label}': '{name}：{label}',
  '{n} or fewer': '{n} 或更少',
  '{n} or less': '{n} 以内',
  'The slowest 1 in 100 requests took {a}, and the goal is {goal}.':
    '最慢的百分之一请求耗时 {a}，而目标是 {goal}。',
  'The slowest 1 in 100 requests from {who} took {a}, and the goal is {goal}.':
    '{who}的最慢百分之一请求耗时 {a}，而目标是 {goal}。',
  'The slowest 1 in 20 requests took {a}, and the goal is {goal}.':
    '最慢的二十分之一请求耗时 {a}，而目标是 {goal}。',
  'The slowest 1 in 20 requests from {who} took {a}, and the goal is {goal}.':
    '{who}的最慢二十分之一请求耗时 {a}，而目标是 {goal}。',
  '{a} of requests were lost, and the goal is {goal}.':
    '{a} 的请求丢失，而目标是 {goal}。',
  '{a} of requests from {who} were lost, and the goal is {goal}.':
    '{who}有 {a} 的请求丢失，而目标是 {goal}。',
  '{a} save never reached the database, and the goal is {goal}.':
    '{a} 条写入始终没有到达数据库，而目标是 {goal}。',
  '{a} saves never reached the database, and the goal is {goal}.':
    '{a} 条写入始终没有到达数据库，而目标是 {goal}。',
  '{a} accepted job failed later, and the goal is {goal}.':
    '{a} 个已接收的任务后来失败了，而目标是 {goal}。',
  '{a} accepted jobs failed later, and the goal is {goal}.':
    '{a} 个已接收的任务后来失败了，而目标是 {goal}。',
  '{a} job was still waiting in the queue at the end, and the goal is {goal}.':
    '结束时还有 {a} 个任务在队列里排队，而目标是 {goal}。',
  '{a} jobs were still waiting in the queue at the end, and the goal is {goal}.':
    '结束时还有 {a} 个任务在队列里排队，而目标是 {goal}。',
  '{a} payment was charged more than once, and the goal is {goal}.':
    '{a} 笔付款被扣款多次，而目标是 {goal}。',
  '{a} payments were charged more than once, and the goal is {goal}.':
    '{a} 笔付款被扣款多次，而目标是 {goal}。',
  '{a} save the client heard succeed never reached storage, and the goal is {goal}.':
    '{a} 条客户端被告知已成功的写入没有真正到达存储，而目标是 {goal}。',
  '{a} saves the client heard succeed never reached storage, and the goal is {goal}.':
    '{a} 条客户端被告知已成功的写入没有真正到达存储，而目标是 {goal}。',
  '{a} read missed a write the same client heard succeed, and the goal is {goal}.':
    '{a} 次读取没读到同一客户端被告知已成功的写入，而目标是 {goal}。',
  '{a} reads missed a write the same client heard succeed, and the goal is {goal}.':
    '{a} 次读取没读到同一客户端被告知已成功的写入，而目标是 {goal}。',
  'Every lost request was {phrase}.': '所有丢失的请求都是{phrase}。',
  'Most lost requests ({share}) were {phrase}.':
    '大多数丢失的请求（{share}）是{phrase}。',
  'The largest share of lost requests ({share}) were {phrase}.':
    '丢失请求中占比最大的一批（{share}）是{phrase}。',

  // Why requests were lost, finishing "Most lost requests were ..." (REASON_PHRASE)
  'turned away because every slot was taken and the line was full':
    '因为槽位占满、队伍排满而被拒之门外',
  'given up on because the caller stopped waiting': '因为调用方不再等待而被放弃',
  'answered with an error': '收到的是报错',
  'lost when a component crashed': '因组件宕机而丢失',
  'sent somewhere with nothing connected to take them': '被送到没有东西接手的地方',
  'passed along too many hops': '经过的跳数太多',
  'refused by a rate limiter': '被限流器拒绝',
  'refused by an open circuit breaker': '被打开的熔断器拒绝',
  'stopped by a cut connection': '被切断的连接挡住',
  'dropped by a connection losing packets': '被丢包的连接丢弃',
  'sent while no region was serving': '发出时没有任何区域在服务',
  'refused because every connection was taken': '因为连接被占满而被拒绝',
  'refused because they failed authentication': '因为没有通过鉴权而被拒绝',
  'refused by a full bulkhead': '被装满的舱壁隔离拒绝',
  'dropped after waiting too long for a bulkhead slot': '等舱壁槽位等得太久后被丢弃',
  'dropped to make room for more important traffic': '为给更重要的流量腾地方被丢弃',

  'Your design met every goal in all {n} test runs.':
    '你的设计在全部 {n} 次测试运行中都达到了每个目标。',
  'A goal was missed.': '有一个目标没达到。',
  'No request got an answer at all.': '没有任何请求得到过响应。',
  'Only {share} of the requests sent got an answer by the end, and the rest were still waiting.':
    '到结束时，发出的请求只有 {share} 得到了响应，其余的还在排队。',
  'This design adds {n} slot and the brief allows {allowed}.':
    '这个设计加了 {n} 个槽位，而任务简报只允许 {allowed} 个。',
  'This design adds {n} slots and the brief allows {allowed}.':
    '这个设计加了 {n} 个槽位，而任务简报只允许 {allowed} 个。',
  'There is no client left to send traffic. Put one back.':
    '已经没有客户端来产生流量了。放一个回来。',
  'The brief breaks {target} on purpose, and this design no longer has one it can break that way. Put it back.':
    '任务简报会故意破坏{target}，而这个设计里已经没有能被那样破坏的组件了。把它放回来。',
  'This design has a client the brief does not. Take the new one out.':
    '这个设计多了一个任务简报没有的客户端。把新的那个去掉。',
  'Requests no longer reach every {kind} the brief started with. Put it back or connect it again.':
    '请求再也到不了任务简报最初有的每个{kind}了。把它放回来，或重新连接。',
  'Requests no longer get from {from} to {to}. Connect them again; you can put new parts in between.':
    '请求再也走不通从{from}到{to}的路了。重新连接它们；中间可以加新组件。',
  '{from} now sends requests straight to {to}, which skips part of the system. Take that connection out.':
    '{from}现在直接把请求发给{to}，跳过了系统的一部分。把这条连接去掉。',
  'This brief allows one new {kind}, and this design adds more. A row of them hides the problem instead of fixing it, so take the extra ones out.':
    '这个简报允许加一个新的{kind}，而这个设计加了更多。排成一排只会把问题藏起来而不是修好，把多出来的去掉。',
  'A new {kind} would answer requests before the work behind it is done, and this brief does not allow one. Take it out.':
    '新的{kind}会在后面的工作完成前就回应请求，而这个简报不允许这样做。把它去掉。',
  '{node} answers requests without passing them on, so they never reach the rest of the system. Connect it onward or take it out.':
    '{node}自己回应请求却不往下传，请求永远到不了系统的其余部分。把它往后连，或者去掉它。',
  '{region} serves from {active} from the start, so its requests skip {node} and the fault in the brief never touches them. Have {region} serve from {node} first.':
    '{region}从一开始就从{active}取数据，它的请求绕过了{node}，简报里的故障碰不到它们。让{region}先从{node}取数据。',
  'In the {n} test runs ({from}s to {to}s)': '在 {n} 次测试运行中（{from}s 到 {to}s）',
  'Live numbers still include requests from before your change.':
    '实时数字还包含你改动之前发出的请求。',
  'Live numbers move with the run on screen. The test runs decide the pass.':
    '实时数字跟随屏幕上的运行。是否通过由测试运行决定。',
  'Checking…': '正在检查…',
  'You changed the design. It gets checked again a second after you stop.':
    '你改动了设计。在你停下操作一秒后会重新检查。',
  'Your design gets checked a second after it stops changing.':
    '你的设计在停止变化一秒后会被检查。',
  '{noun} in': '{noun}倒计时',
  'When {what} at {at}s, {why}': '第 {at} 秒，{what}，{why}',
  'You cannot add any slots here.': '这里不能增加任何槽位。',
  'You can add up to {n} more slot.': '这里还能加 {n} 个槽位。',
  'You can add up to {n} more slots.': '这里还能加 {n} 个槽位。',
  'Used:': '已用',
  'What you learned': '你学到了什么',
  'Give me a hint': '给我一个提示',
  'Another hint': '再要一个提示',
  Details: '细节',
  'Right now on screen': '屏幕上的实时情况',
  'Nothing is getting through right now.': '现在没有请求能通过。',
  'These numbers move with the run on screen. Only the check decides a pass.':
    '这些数字跟随屏幕上的运行。能否通过只由检查决定。',
  'The check': '检查',
  'The check plays your design {n} times, each with slightly different random traffic. It counts from {from}s to {to}s of each run.':
    '检查会把你的设计跑 {n} 遍，每遍的随机流量略有不同。每遍从 {from}s 数到 {to}s。',
  'Then it plays {n}s more, so a try still running can finish before it checks the data.':
    '然后再多跑 {n}s，让还没跑完的尝试在检查数据前收尾。',
  'Checking your design': '正在检查你的设计',
  'Checking run {a} of {b}': '正在检查第 {a}/{b} 遍',
  'Closest call': '最接近的一次',
  'Decided by': '由它决定',
  '{prefix}: {run}': '{prefix}：{run}',
  ', with ': '，共 ',
  ' requests counted.': ' 个请求。',
  'A slot is one request a component can work on at once. Take some away and it gets checked.':
    '一个槽位就是一个组件同时能处理的请求数。拿走一些，它就能通过检查了。',
  'run {n}': '第 {n} 次运行',
  'Watch {run}': '观看{run}',
  'Check again': '再检查一次',
  'Back to my design': '回到我的设计',
  'Copy link': '复制链接',
  'Start over': '从头开始',
  Met: '达标',
  'Not met': '未达标',
  'Goal: {v}': '目标：{v}',
  // 'Right now' is translated in inspector.ts (当前状态).

  // The trouble a brief promises (briefTrouble.ts)
  'a connection is cut': '一条连接被切断',
  'a connection starts delivering some calls twice': '一条连接开始把部分调用投递两次',
  'a connection starts losing its answers': '一条连接开始丢失返回的应答',
  '{name} goes down': '{name} 宕机',
  'one {name} machine crashes': '{name} 的一台机器宕机',
  '{name} slows down': '{name} 变慢',
  '{name} starts failing requests': '{name} 开始让请求失败',
  '{name} is cut off': '{name} 被切断',
  '{name} stalls': '{name} 停顿',
  '{name} restarts': '{name} 重启',
  Cut: '切断',
  Duplicates: '重复投递',
  'Lost answers': '应答丢失',
  Outage: '宕机',
  // 'Crash' is app.ts's fault-button label (弄崩); the countdown template
  // renders it as 弄崩倒计时 12s, which reads as its own sentence.
  Slowdown: '变慢',
  Errors: '报错',
  Stall: '停顿',
  Restart: '重启',

  // Challenge picker (Challenges.tsx). 'Challenges' is app.ts's menu label.
  'A system that does not meet its requirement. Work out why, and fix it.':
    '一个达不到要求的系统。找出原因，把它修好。',
  'Level {n}': '第 {n} 级',
  'In progress': '进行中',

  // Examples gallery (Examples.tsx). 'Examples' is app.ts's menu label.
  'Load a system that already works, then take it apart.':
    '加载一个已经能跑的系统，然后把它拆开看。',
  Incidents: '真实事故',
  'Search examples': '搜索示例',
  'Nothing matches “{query}”. Try a component name like cache or queue.':
    '没有匹配“{query}”的结果。试试组件名，比如 cache 或 queue。',
  Loaded: '已加载',
  'Real incidents': '真实事故',
  'Real outages as simplified models. Watch one happen, then fix it.':
    '把真实的中断事故做成简化模型。先看它怎么发生，再把它修好。',

  // A real incident (Incidents.tsx)
  'Real incident, {date}': '真实事故，{date}',
  'A simplified model. Times and numbers here are from the simulator, not the real event.':
    '简化模型。这里的时间和数字来自模拟器，不是真实事件。',
  'Source:': '来源：',
  'Watch again': '再看一次',
  'Watch it happen': '看它发生',
  'Fix it': '修好它',

  // Route health line (routeHealth.ts)
  '{share} failing': '{share} 失败',
  '{failing}, mostly {why}': '{failing}，大多是{why}',
  'slow, 1 in 100 requests take {ms} or longer':
    '慢，每一百个请求里有一个要 {ms} 或更久',
  '{name}: {trouble}.': '{name}：{trouble}。',
  '{name}: {share} failing.': '{name}：{share} 失败。',
  '{names}: fine.': '{names}：正常。',
  ', ': '、',
  ' and ': ' 和 ',

  // Why a route is failing, after "mostly" (MOSTLY)
  'timing out': '一直在超时',
  'turned away by a full queue': '被排满的队列拒之门外',
  'answered with errors': '收到的是报错',
  'finding nowhere to go': '找不到去处',
  'going round in a loop': '在循环里打转',
  'held back by a rate limiter': '被限流器拦下',
  'hitting a crashed component': '撞上了宕机的组件',
  'stopped by a cut network link': '被切断的网络链路挡住',
  'finding no region serving': '没有区域在服务',
  'refused a connection': '连接被拒绝',
  'failing to sign in': '登录失败',
  'waiting too long for a free slot': '等空闲槽位等得太久',
  'dropped to protect other traffic': '为保护其他流量被丢弃',
  'lost on the network': '在网络里丢失',

  // Route alert (RouteAlert.tsx) — 'Client' is canvas.ts's kind name.
  // Pinned run bar (PinBar.tsx) — 'Pin this run' and 'Clear the pinned run'
  // live in ops.ts.
  'Keep these numbers, change something, then compare.':
    '把这些数字固定下来，改点什么，再来对比。',
  'Pinned run against now': '固定的一次运行与当前的对比',
  'Pin again': '再次固定',
  ' now ': ' 现在 ',
  ', better': '，更好',
  ', worse': '，更差',

  // Charts strip scroll cue (StripCue.tsx)
  '{shown} of {total} shown. Back to the top':
    '已显示 {shown}/{total} 个面板。回到顶部',
  '{shown} of {total} shown. More below': '已显示 {shown}/{total} 个面板。下面还有',
};
