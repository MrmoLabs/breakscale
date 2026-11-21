/**
 * Chinese interface copy for the inspector: field labels, units, hints,
 * per-kind descriptions, live readings, the multi-selection view and the
 * traffic bar. Same contract as chrome.ts.
 *
 * Keys are the exact English source strings; anything rendered through a
 * variable (`t(spec.label)`, `t(KIND_BLURB[kind])`, `t(row.label)`) still
 * resolves here, so every label, unit, hint and blurb below is listed even
 * where the call site passes it dynamically. Words printed on a node's box
 * (`busy`, `waiting`, `p99`, ...) already live in canvas.ts and are reused
 * as-is, so the meter and the box always agree; keys that exist in another
 * dictionary (`Duplicate`, `Copy`, `Pause`, `Play`, `Step one tick`,
 * `slots`, `running`, `Learn more`, ...) are not repeated here.
 *
 * Terminology follows the shared vocabulary: 负载均衡器, 熔断器, 限流器,
 * 只读副本, 分片, 舱壁隔离, 连接池, 利用率, 吞吐量, 积压, 有效吞吐, 请求负载.
 */

export const zhInspector: Record<string, string> = {
  // Panel shell and empty states.
  Inspector: '检查器',
  'Node name': '节点名称',
  '1 connection selected.': '已选中 1 条连接。',
  '{n} connections selected.': '已选中 {n} 条连接。',
  '{label}. Press Delete to remove it.': '{label}。按 Delete 键移除。',
  'Connections have nothing to configure. Press Delete to remove them.':
    '连接没有可设置的项。按 Delete 键移除。',
  'Select a component on the canvas and its settings will appear here.':
    '在画布上点选一个组件，它的设置会显示在这里。',

  // Field groups.
  'What it does': '它管什么',
  'How much it can handle': '它能扛多少',
  'When things go wrong': '出问题时',

  // Per-kind blurbs (KIND_BLURB).
  'Sends requests and waits for each answer. Its timeout decides when a slow reply becomes a failure.':
    '发出请求，然后等待每个回应。它的超时决定了一个多慢的回应会在什么时候算作失败。',
  'Spreads requests across its targets. Its own pool and backlog can saturate before theirs do.':
    '把请求分摊到它的各个目标上。它自己的连接池和积压可能比目标们先饱和。',
  'The workhorse. How many it handles at once, divided by how long each takes, is the ceiling everything else queues behind.':
    '干活的主力。同时处理多少个，除以每个要多久，就是其他所有组件排队等待的那个天花板。',
  'Answers hits without touching downstream. Each cache rolls its own hit chance, independently of the others, so stacking them multiplies misses rather than treating later caches as filters on earlier misses.':
    '命中的请求由它直接回应，不去打扰下游。每个缓存各自掷自己的命中概率，彼此独立，所以叠多层缓存只会让未命中相乘，后面的缓存并不会过滤前面漏掉的未命中。',
  'Works on a few requests at once. When they are all busy, the rest wait in line here.':
    '同时只处理少数几个请求。当它们都忙起来时，其余的就在这里排队。',
  'A buffer. Depth is the whole story: it absorbs bursts up to the limit, then turns work away.':
    '一个缓冲区。深度就是它的全部：先把突发吸收到上限，然后就开始拒收工作。',
  'Drains a queue at its own pace. Too few workers and the backlog never recovers.':
    '按自己的节奏消化队列。工作进程太少，积压就永远缓不过来。',
  'Reads scale with the replica count, but a read can arrive before the last write has propagated. Watch the stale rate as you raise the lag.':
    '读取能力随副本数增加，但一个读取可能赶在最后一次写入传播完成之前到达。调大延迟时，盯着旧读比例看。',
  'Splits data across partitions by key, so capacity adds up, until one key gets hot and a single shard has to carry it alone.':
    '按键把数据切分到各分区，容量因此可以叠加，直到某个键变热，一个分片不得不独自扛起它。',
  'Watches one node and adds capacity when it runs hot. New capacity takes warmup time to arrive, so load always leads it.':
    '监视一个节点，在它跑热时增加容量。新容量要等预热时间才能到位，所以负载总是跑在它前面。',
  'Sends traffic to one region at a time. If that region dies, failover costs you a full outage window before the next one takes over.':
    '同一时间把流量发往一个区域。如果那个区域挂了，故障转移会让你经历一整段服务中断窗口，下一个区域才接手。',
  'An edge cache in front of everything. At a 0.9 hit rate one CDN leaves a tenth of the traffic for the origin, and that chance is rolled independently of every other cache on the path. It is still the cheapest capacity you will ever add.':
    '挡在所有东西前面的边缘缓存。命中率 0.9 时，一个 CDN 会给源站留下十分之一的流量，而且这个概率和路径上其他每个缓存各自独立掷。它仍然是你能加到的最便宜的容量。',
  'A token bucket. Refuses excess traffic instantly instead of queueing it, which is what stops a busy system turning into a dead one.':
    '一个令牌桶。多余的流量立刻拒绝，而不是排队，这正是让繁忙的系统不至于变成死掉的系统的关键。',
  'Watches its downstream and stops calling it once it is failing. Cutting the traffic to zero is what gives a struggling dependency room to recover.':
    '监视它的下游，一旦下游开始失败就停止调用。把流量切到零，才能给一个挣扎中的依赖留出恢复的空间。',
  'Blob storage. Every request pays a high flat latency, but the pool is wide enough that saturating it takes deliberate effort. Not a database, and that is the point.':
    '对象存储。每个请求都要付一段很高的固定延迟，但池足够宽，想把它压满得费一番功夫。它不是数据库，而这正是要点。',
  'Searches are cheap; writes pay an indexing surcharge and only become searchable after the refresh lag. The stale-search rate is that lag made visible.':
    '搜索很便宜；写入要付索引附加费，而且要等刷新延迟过去之后才能被搜到。过期搜索的比例就是这段延迟的可见形态。',
  'Built to swallow appends by the thousand. A range query costs hundreds of appends, so a few percent of them dominates the store, which is why metrics do not live in your main database.':
    '生来就是为了吞下成千上万的追加写入。一次范围查询的代价相当于几百次追加，所以只占几个百分点的范围查询就能拖垮整个库，这就是指标不放在主数据库里的原因。',
  'Stores relationships. Every extra hop of traversal depth multiplies the edges visited by three, so a friends-of-friends query costs triple and one more hop triples it again.':
    '存关系。遍历深度每多一跳，访问的边就乘以三，所以朋友的朋友查询已经是三倍代价，再多一跳还要再乘三。',
  'The archive tier: cheap to keep, seconds to read. Fine for a trickle of restores behind a queue, hopeless for anything a user is waiting on.':
    '归档层：存着便宜，读取要等几秒。放在队列后面慢慢取回还行，任何让用户干等的事都别指望它。',
  'Similarity search over embeddings. Cost grows with the log of the corpus and explodes as recall approaches perfect, so the recall slider is a latency slider read backwards.':
    '在向量嵌入上做相似度搜索。代价随语料规模的对数增长，并在召回率接近完美时爆炸，所以召回率滑块其实是一个反着读的延迟滑块。',
  'A partitioned, replayable log. Producers are acked instantly; each outgoing edge is an independent consumer group whose lag grows when its consumers are slower than the producers. Partition count, not consumer count, caps how fast a group can drain.':
    '一个分区化、可回放的日志。生产者立刻得到确认；每条出边都是一个独立的消费者组，当它的消费者比生产者慢时，滞后就会增长。限制一个组消化速度的是分区数，不是消费者数。',
  'One publish becomes one delivery per subscriber. A slow subscriber sheds at its own node without delaying the others, but the total load is multiplied by the fan-out, whether you noticed or not.':
    '一次发布变成给每个订阅者的一次投递。慢的订阅者在自己的节点上被削减，不拖累其他人，但总负载会被扇出乘大，不管你有没有注意到。',
  'Holds long-lived connections. Capacity is concurrent connections held, not requests per second: at 30 new connections a second held 8 seconds each, 240 slots are simply occupied. Chat systems run out of sockets long before they run out of CPU.':
    '持有长期存活的连接。容量是同时保持的连接数，不是每秒请求数：每秒新建 30 条连接、每条保持 8 秒，240 个槽位就被白白占住了。聊天系统远在 CPU 耗尽之前就先把连接数用完了。',
  'The front door: authenticates, rate limits, and routes each request to the backend its weights choose. Three components worth of refusals happen here so the backends only ever see traffic worth serving.':
    '前门：鉴权、限流，并按权重把每个请求路由到选定的后端。三种组件的拒绝工作都发生在这里，所以后端看到的都是值得服务的流量。',
  'A proxy beside one service. It charges its service time on every single request, and pays you back with retries, a per-attempt deadline, and ejecting the upstream after repeated failures. Put one at every hop and watch the taxes stack; that is a service mesh.':
    '待在一个服务旁边的代理。它对每个请求都收一次服务时长，作为回报给你重试、每次尝试的截止时间和反复失败后对上游的隔离。每一跳都放一个，看这些税叠起来；那就是服务网格。',
  'Scales instantly with load, up to its concurrency cap, and there is no queue past it. The catch is the cold start: a request that finds no warm instance pays a large extra latency, so idle periods and bursts are exactly when it is slowest.':
    '随负载即时扩容，直到并发上限，它后面也没有队列。代价是冷启动：找不到预热实例的请求要付一大笔额外延迟，所以空闲期和突发期恰恰是它最慢的时候。',
  'Fires on a schedule and dumps its whole batch at once. The database that handles the steady daytime load falls over at midnight not because traffic grew, but because this arrived all in the same instant.':
    '按时间表触发，一次性倒出整批工作。白天平稳负载下撑得住的数据库在午夜垮掉，不是因为流量涨了，而是因为这一批在同一瞬间到达。',
  'Caps how many calls may be outstanding to the dependency behind it. When that dependency slows down, the pool fills within one round trip and the excess fails fast here, instead of queueing behind a sick service.':
    '限制对它背后那个依赖可以有多少个调用同时在途。当那个依赖变慢时，池子一个来回就被填满，多出来的调用在这里快速失败，而不是排在一个生病的服务后面干等。',
  'Acks the sender instantly, delivers downstream itself, and redelivers failures with backoff. Messages that fail every attempt land on the dead letter shelf: counted, not vanished.':
    '立刻确认发送方，由它自己向下游投递，失败的重投并带退避。每次尝试都失败的消息会被放上死信架：有计数，不会凭空消失。',
  'A batch farm: jobs take seconds, so throughput is boxes times jobs-per-box divided by job time. Feed it from a queue, and size it against arrivals, because a structural deficit grows the backlog forever.':
    '一个批量农场：每个任务要几秒，所以吞吐量是 机器数 × 每机任务数 ÷ 单任务耗时。用队列喂它，并按到达速率定尺寸，因为结构性的缺口会让积压永远增长。',
  'A small function running in the PoP. The share of requests it can fully answer never touches your origin; the rest pass through. Unlike a CDN hit rate, that share is a property of your code, not your traffic.':
    '跑在接入点里的一小段函数。它能完整回应的那部分请求根本不会碰到你的源站；其余的照直穿过。和 CDN 的命中率不同，这个份额是你代码的属性，不是你流量的属性。',
  'Acknowledges writes from memory and flushes them to the store later. The caller sees a one-millisecond write; the store sees the same load smoothed. Crash it, and every write still in the buffer is lost after being confirmed.':
    '先在内存里确认写入，稍后再刷进存储。调用者看到的是一毫秒的写入；存储看到的是被抹平的同一段负载。一旦崩溃，缓冲区里每一条已确认的写入都会丢。',
  'A token bucket that refuses by priority: low-priority traffic must leave a reserve untouched, so under saturation it is dropped first while the traffic that matters keeps being admitted. Degradation as a policy, not an accident.':
    '一个按优先级拒绝的令牌桶：低优先级流量必须留出一份保留量不动，所以饱和时它们先被丢弃，而重要的流量继续放行。降级是一种策略，不是一场意外。',

  // Traffic shapes and their cycles.
  'Traffic shape': '流量形态',
  'how the load arrives over time': '负载随时间如何到达',
  Steady: '平稳',
  'Ramp up': '爬升',
  Spike: '尖峰',
  'Daily cycle': '昼夜周期',
  Bursty: '突发',
  'Thundering herd': '惊群',
  'The same rate the whole time.': '整段时间速率都一样。',
  'Climbs from nothing to the full rate over one cycle, then holds.':
    '在一个周期内从零爬到满速率，然后保持。',
  'Quiet, then 4× for a moment. The average is about half the offered load.':
    '先安静，然后短时间 4 倍。平均值约为请求负载的一半。',
  'A quiet night and a busy afternoon, from a quarter of the rate to twice it.':
    '安静的夜晚和繁忙的下午，速率从四分之一到两倍。',
  'Same average, but requests come in ': '平均一样，但请求会成',
  clumps: '簇',
  '.': '。',
  'Once a cycle, a ': '每个周期都会有一场',
  herd: '惊群',
  ' of callers piles in on top of the normal rate.':
    '：调用者涌进来，叠在正常速率之上。',
  'Cycle length': '周期长度',
  seconds: '秒',
  'How long the climb to the full rate takes.': '爬到满速率要花多久。',
  'Time from one spike to the next.': '从一次尖峰到下一次的间隔。',
  'One whole simulated day.': '一个完整的模拟日。',
  'Time from one herd to the next. The first lands one cycle in.':
    '从一群到下一群的间隔。第一群在一个周期后到来。',
  'within {ms}': '在 {ms} 内',
  'in one instant': '在同一瞬间',
  'That is {said} seconds of normal traffic arriving {when}.':
    '这相当于 {said} 秒的正常流量{when}到达。',
  'Average clump': '平均每簇',
  'requests arriving together': '个请求一同到达',
  '{n} at once': '同时 {n} 个',
  'Clumps come further apart, so the average rate stays the same.':
    '簇与簇的间隔变大，所以平均速率不变。',
  'Callers in the herd': '群里调用者数量',
  'each cycle': '每周期',
  'Spread the herd over': '把这群调用者摊开到',
  'all at once': '同一时刻全部到达',
  'Every caller fires in the same millisecond.': '所有调用者都在同一毫秒发出请求。',
  'Each caller first waits a random delay of up to {ms}, so the herd arrives spread out.':
    '每个调用者先等待一段最长 {ms} 的随机延迟，所以这群请求是摊开到达的。',
  'Key spread': '键的偏斜',
  'skew, 0 is even': '偏斜程度，0 是均匀',
  even: '均匀',
  'skew {v}': '偏斜 {v}',
  'Every one of the 64 keys is equally likely, about 1.6% of requests each.':
    '64 个键每个被请求到的概率都一样，各占请求的约 1.6%。',
  'The hottest of the 64 keys gets {share} of requests, and a sharded store sends all of them to one partition.':
    '64 个键里最热的那个会拿到 {share} 的请求，而分片存储会把它们全部送到一个分区。',
  'Traffic hitting one hot key': '打到单个热点键的流量',
  'percent onto one shard': '落到同一个分片的百分比',

  // Field labels and units.
  'Offered load': '请求负载',
  'requests per second': '每秒请求数',
  Instances: '实例数',
  'How many copies of this component are running. An autoscaler adds and removes these.':
    '这个组件正在运行多少个副本。自动扩缩容会增减这些副本。',
  'Slots per instance': '每实例槽位数',
  'at once, on one instance': '单实例同时处理数',
  'How many requests one instance works on at once. Total slots = instances × this.':
    '一个实例同时处理多少个请求。总槽位数 = 实例数 × 这个数。',
  'Service time': '服务时长',
  milliseconds: '毫秒',
  'How uneven the work is': '工作的不均匀程度',
  '0 is steady, 1 is very uneven': '0 是均匀，1 是很不均匀',
  'every one the same': '每个都一样',
  'Most that can wait in line': '最多能排队多少',
  requests: '个请求',
  'Hit rate': '命中率',
  percent: '百分比',
  'Each cache or CDN rolls this chance on its own. Two at 80% leave about 4% of traffic for whatever is behind them, because the chances multiply.':
    '每个缓存或 CDN 各自掷一次这个概率。两个 80% 的缓存会给后面的组件留下约 4% 的流量，因为概率是相乘的。',
  'Random errors': '随机报错',
  'of requests fail on their own': '的请求自行失败',
  Timeout: '超时',
  none: '不限',
  Retries: '重试次数',
  'extra tries': '次额外尝试',
  'copies, besides the primary': '台，主库之外',
  'Read-only copies behind the primary. They add read capacity only; every write still goes through the one primary.':
    '主库背后的只读副本。它们只增加读取能力；所有写入仍然要经过唯一的主库。',
  'Replication lag': '复制延迟',
  synchronous: '同步',
  'Reads, as a share of traffic': '读取占流量的比例',
  'percent of traffic': '占流量的百分比',
  Shards: '分片数',
  partitions: '个分区',
  'How many partitions the data is split across. A key goes to exactly one of them.':
    '数据被切分到多少个分区上。一个键只会落到其中一个。',
  'Slots per shard': '每分片槽位数',
  'at once, on one shard': '单分片同时处理数',
  'How many requests one partition works on at once. A hot key can only ever use its own shard’s slots.':
    '一个分区同时处理多少个请求。热点键只能用上自己那个分片的槽位。',
  'Keep utilisation near': '利用率保持在',
  'Never scale below': '缩容下限',
  'Never scale above': '扩容上限',
  'at once': '并发数',
  'Wait between changes': '两次调整之间的等待',
  'Change capacity by': '每次调整容量的幅度',
  'percent of capacity': '容量的百分比',
  'New capacity takes': '新容量要等',
  instant: '立即',
  Regions: '区域数',
  regions: '个区域',
  'How many regions exist in total. Only one of them serves traffic at a time; which one is a separate number, below.':
    '总共有多少个区域。同一时间只有一个区域在服务；具体是哪个是另一个数字，见下面。',
  'Serving from region': '当前服务的区域',
  number: '编号',
  'Which region is serving right now, not how many exist. Change it to move service without crashing anything.':
    '现在由哪个区域服务，不是有多少个区域。改变它可以把服务挪走而不弄垮任何东西。',
  'Failover takes': '故障转移耗时',
  'How long requests fail while traffic moves to the next region. Nothing is served in that window, however many healthy regions are left.':
    '流量切到下一个区域期间，请求失败多久。在这个窗口内没有任何服务，不管还剩多少个健康区域。',
  'Rate limit': '速率限制',
  unlimited: '不限',
  'Burst allowance': '突发余量',
  'Trip when errors reach': '错误率达到多少时跳闸',
  'Measured over': '统计窗口',
  'Stay open for': '断开保持',
  'Test requests before closing': '闭合前的试探请求数',
  'Indexing cost per write': '每次写入的索引代价',
  'extra milliseconds per write': '每次写入额外毫秒数',
  'Extra time a write pays to update the index. Searches never pay it.':
    '写入为了更新索引额外付出的时间。搜索永远不用付。',
  free: '零开销',
  'Searchable after': '多久后可被搜到',
  'milliseconds after a write commits': '写入提交后的毫秒数',
  'How long before a new write shows up in searches. This is the refresh interval; searches inside it read the old index.':
    '一条新写入要过多久才会出现在搜索结果里。这就是刷新间隔；间隔内的搜索读到的是旧索引。',
  instantly: '立即',
  'Traffic that is range queries': '范围查询占的流量',
  'appends only': '只有追加',
  'Range query costs': '范围查询的代价',
  'extra milliseconds per range query': '每次范围查询额外毫秒数',
  'Extra time a range query pays to scan and aggregate. Appends never pay it.':
    '范围查询为了扫描和聚合额外付出的时间。追加永远不用付。',
  'Traversal depth': '遍历深度',
  hops: '跳',
  'How many hops each query walks. Every extra hop multiplies the work by about 3, so depth 3 costs 9× depth 1.':
    '每个查询要走的跳数。每多一跳，工作量约乘 3，所以深度 3 的代价是深度 1 的 9 倍。',
  'Index size': '索引规模',
  'thousands of vectors': '千个向量',
  '{n}M vectors': '{n}M 向量',
  '{n}K vectors': '{n}K 向量',
  'Recall target': '召回率目标',
  'fraction of true neighbours found': '找到的真实近邻比例',
  'How close to perfect the search must be. Cost scales with 1 / (1 - recall): the last percent costs more than everything before it.':
    '搜索要有多接近完美。代价与 1 / (1 - 召回率) 成正比：最后那 1% 比之前所有的加起来还贵。',
  Partitions: '分区数',
  'The most one consumer group can work on in parallel. A message lands in one partition by key, and a group takes one message per partition at a time.':
    '一个消费者组最多能并行处理多少个分区。消息按键落到其中一个分区，一个组在每个分区上一次只取一条消息。',
  'Connection lifetime': '连接存活时间',
  'milliseconds held': '保持中的毫秒数',
  'How long each accepted connection occupies a slot. Held connections settle at rate × lifetime, which is the number that fills up.':
    '每条被接受的连接占用一个槽位多久。保持中的连接数会稳定在 速率 × 存活时间，正是这个数字会被填满。',
  'Failing auth': '鉴权失败',
  'percent of requests': '请求的百分比',
  'Eject after': '连续失败多少次后隔离',
  'consecutive failures': '次连续失败',
  'Failures in a row before the proxy stops calling it for a while. Simpler than the breaker on purpose; this is how sidecar outlier detection works.':
    '连续失败多少次后，代理会在一段时间内停止调用它。故意做得比熔断器简单；Sidecar 的离群检测就是这样工作的。',
  'Cold start costs': '冷启动代价',
  'extra milliseconds': '额外毫秒',
  'Instances stay warm': '实例保持预热',
  'milliseconds after finishing': '完成后的毫秒数',
  'How long a finished instance waits, warm, before the platform reclaims it. Shorter keep-warm means more cold starts on the next burst.':
    '一个用完的实例会保持预热多久，然后平台才回收它。预热保留越短，下一次突发时的冷启动就越多。',
  'reclaim at once': '立即回收',
  'Slots, at most': '槽位上限',
  'across every instance (the platform limit)': '所有实例合计（平台上限）',
  'Past it requests are refused at once; a lambda has no line to wait in.':
    '超过就立刻拒绝请求；Serverless 函数没有可以排队的队列。',
  'Fires every': '触发间隔',
  'Requests per firing': '每次触发的请求数',
  'per outgoing edge, at once': '每条出边，一次',
  'Calls in flight, at most': '同时在途调用上限',
  'to the dependency behind it': '发往它背后的依赖',
  'The size of the pool. Roughly this divided by the dependency’s latency in seconds is the most it admits each second.':
    '池的大小。大约用这个数除以依赖的延迟（按秒算），就是它每秒最多放行的调用数。',
  'When the pool is full': '池满时',
  'admission behavior': '放行行为',
  'Reject fails immediately. Wait holds a request until a connection opens, or its acquire timeout expires.':
    '拒绝会立刻失败。等待会把请求扣住，直到有连接空出来，或获取超时到期。',
  Reject: '拒绝',
  Wait: '等待',
  'Waiting acquires, at most': '等待获取的请求上限',
  'Acquire timeout': '获取超时',
  'Writes sit dirty for': '写入保持未落盘的时长',
  'Dirty writes held': '持有的未落盘写入',
  'Time between the ack and the flush landing. Everything inside this window is lost if the node crashes.':
    '从确认到刷盘落地之间的时间。窗口内的一切都会在节点崩溃时丢失。',
  'instant flush': '立即刷盘',
  'Answered at the edge': '在边缘就回应',
  'Low-priority traffic': '低优先级流量',
  'Derived from the request key, so the same caller is always the same priority. If a client skews its keys, its busiest caller sits in one tier and this share drifts.':
    '由请求键推导而来，所以同一个调用者的优先级总是相同。如果客户端的键有偏斜，它最忙的调用者会固定在一个档里，这个比例就会漂移。',
  'Reserved for high priority': '高优先级保留份额',
  'percent of the bucket': '令牌桶的百分比',
  'Low-priority requests must leave this share of tokens untouched. That is why they are cut first.':
    '低优先级请求必须留下这份令牌不动。这就是它们先被削减的原因。',
  'Lock wait per concurrent write': '每个并发写入的锁等待',
  'milliseconds each': '每次的毫秒数',
  'Each write waits this long for every write already in progress. Adding instances does not shorten this wait.':
    '每个写入都要为已经在进行的写入等这么久。加实例不会缩短这个等待。',
  'no contention': '无争用',
  'Ceiling per key prefix': '每个键前缀的上限',
  'requests per second, each prefix': '每秒请求数，按前缀各算',
  'Keys map onto 8 prefixes. Evenly spread traffic sustains 8× this; a hot prefix gets exactly 1× and then slowdowns, however idle the pool is.':
    '键会映射到 8 个前缀。均匀分布的流量能撑住这个数的 8 倍；热前缀恰好只有 1 倍，然后就是变慢，不管池有多空闲。',
  'no limit': '不限',
  'Renditions per job': '每个任务的输出版本数',
  'output files, per finished job': '个输出文件，每个完成任务',
  'The quality ladder. Storage behind the farm sees this many uploads per job, so its write load is this times the job rate.':
    '清晰度阶梯。转码机群后面的存储每收到一个任务就要承受这么多次上传，所以它的写负载是这个数乘以任务速率。',
  'CPU budget per request': '每个请求的 CPU 预算',
  'milliseconds of execution': '执行毫秒数',
  'A request that runs past this is killed at the edge and sent to the origin anyway. Heavier edge code blows the budget more often.':
    '运行超过这个数的请求会在边缘被终止，然后照样送到源站。边缘代码越重，越容易超预算。',
  'no budget': '不设预算',

  // Per-kind wording overrides (KIND_FIELD_OVERRIDES).
  'Connections per instance': '每实例连接数',
  'held at once, on one machine': '单机同时保持数',
  'A slot here is a held connection, not a request in service. Held connections settle at connect rate × lifetime, which is the number that fills up.':
    '这里的槽位是一条保持中的连接，不是正在处理的请求。保持中的连接数会稳定在 连接速率 × 存活时间，正是这个数字会被填满。',
  'buffered at once': '同时缓冲条数',
  'The buffer is memory: how many acknowledged writes may sit dirty at once. It is not a thread count.':
    '缓冲区是内存：已确认的写入最多可以有多少条同时处于未落盘状态。它不是线程数。',
  Retention: '保留量',
  'messages kept, per partition': '条消息，每分区',
  'How far back the log keeps messages. A consumer group that falls further behind than this skips ahead, and the skipped messages are lost to it.':
    '日志往回保留多少消息。落后超过这个数的消费者组会向前跳过，被跳过的消息对它来说就丢了。',
  instances: '实例',
  instance: '实例',
  'Change the fleet by': '每次调整机群的幅度',
  'percent of instances': '实例数的百分比',

  // Locks during a challenge.
  'Fixed for this challenge: it is how the people sending requests behave, not part of your design.':
    '本次挑战已锁定：这是发请求的人的行为方式，不属于你的设计。',
  'Fixed for this challenge: it describes the work, not your design.':
    '本次挑战已锁定：它描述的是工作本身，不属于你的设计。',

  // Multi-selection.
  mixed: '不一致',
  'Mixed selection': '混合选择',
  'Decrease {field}': '调低{field}',
  'Increase {field}': '调高{field}',
  'How {name} behaves here': '{name}在这里是如何工作的',
  'Changing anything below applies it to all ': '下面的任何修改都会应用到全部 ',
  ' of these. Where they currently disagree the value reads ':
    ' 个组件上。当前不一致的项会显示为',
  ', until you move it.': '，直到你改动它。',
  'These are different kinds of component, so they have no settings in common. Select one on its own to configure it, or delete the whole selection below.':
    '它们是不同种类的组件，没有共同的设置。请单独选中一个再配置，或在下方把整个选区删除。',
  'Delete {n} selected': '删除选中的 {n} 个',

  // Headline meters and the box key.
  'Tokens left': '剩余令牌',
  'Pool in use': '池占用',
  'Worst lag vs retention': '最大滞后对比保留量',
  'Connections held': '保持中的连接',
  'How busy it is': '繁忙程度',
  Utilisation: '利用率',
  'Consumer lag': '消费者滞后',
  'On the diagram': '方框上的记号',

  // Cron panel.
  'Next firing in': '距下次触发',
  'Sent since start': '启动以来已发送',
  'Between firings it does nothing at all. The whole batch lands downstream in the same instant, which is exactly what makes it dangerous.':
    '两次触发之间它什么都不做。整批工作会在同一瞬间落到下游，这正是它危险的地方。',

  // Region panel.
  'Serving from': '服务来自',
  nowhere: '无处',
  'region {n}': '区域 {n}',
  'Regions healthy': '健康区域数',
  '{have} of {total}': '{have}/{total}',
  'Traffic resumes in': '流量恢复还要',
  'Mid-failover: every request arriving right now fails. This window is what failover costs, and it is never free.':
    '转移进行中：现在到达的每个请求都会失败。这个窗口就是故障转移的代价，而且从来不是免费的。',

  // Autoscaler panel.
  'Still measuring. It will not act for another {secs}s.':
    '仍在测量。还要再等 {secs}s 才会行动。',
  '{n} more booting. They start serving in {secs}s.':
    '还有 {n} 台在启动。它们将在 {secs}s 后开始服务。',
  'Just acted. It will not act again for {secs}s.':
    '刚刚调整过。{secs}s 内不会再行动。',
  'Holding steady. Load does not call for a change.': '保持稳定。负载不需要调整。',
  'Not wired to anything yet. Draw a connection from this autoscaler to the component it should scale, and it will start watching it.':
    '还没有连到任何组件。从这个自动扩缩容画一条连接到它该调节的组件，它就会开始监视。',
  'Watching ': '正在监视 ',
  ', which has no instances to add or remove. This autoscaler cannot help it.':
    '，它没有可以增减的实例。这个自动扩缩容帮不了它。',
  'It is at': '它的利用率',
  'A managed store is one logical service rather than a pool of machines, so there is no fleet to grow. If it is overloaded, the answer is spreading the load across its keyspace rather than adding capacity.':
    '托管存储是一个逻辑服务，而不是一台台机器组成的池，所以没有机群可加。如果它过载，办法是把负载摊到它的键空间上，而不是增加容量。',
  ', aiming to keep it at': '，目标是让它的利用率保持在',
  ' busy.': ' 左右。',
  'Instances running': '运行中的实例',
  'Instances wanted': '目标实例数',
  'Booting now': '正在启动',

  // Replica set and partition spreads.
  'Across the set': '整组情况',
  'Primary (writes)': '主库（写入）',
  'Read replicas, average': '只读副本平均',
  'Reads served stale': '读到的旧数据',
  'Reads sent to the primary': '送往主库的读取',
  'The primary is the bottleneck, not the replicas. Adding more read replicas will not help; every write still goes through the one primary':
    '瓶颈在主库，不在副本。加更多只读副本没有用；所有写入仍然要经过唯一的主库',
  ', and so do the reads sent to it while the copies are behind.':
    '，副本落后期间送到它的读取也一样。',
  'Some reads are answered by a replica that has not caught up with the latest write yet. Lower the replication lag, or send those reads to the primary under Correctness.':
    '有些读取由还没追上最新写入的副本回答。把复制延迟调低，或在正确性设置里把这些读取送到主库。',
  'Across the partitions': '各分区情况',
  'Busiest one': '最忙的一个',
  'Quietest one': '最闲的一个',
  Average: '平均',
  'Hottest key': '最热的键',
  'One key is {share} of the requests here, and all of them go to partition {partition}. More shards cannot split a single key.':
    '有一个键占了这里 {share} 的请求，而且全部都会落到分区 {partition}。更多的分片没法把一个键再拆开。',
  'Badly uneven. One partition is doing most of the work while the others sit idle. Adding shards will not help until the keys spread out.':
    '非常不均匀。一个分区干了大部分活，其他分区闲置。在键分布变均匀之前，加分片没有用。',
  'The fleet': '实例组',
  'Instances serving': '服务中的实例',
  'These are not serving traffic yet. Requests can still fail while they boot; that gap is why capacity always lags a spike.':
    '这些实例还不能服务流量。它们启动期间请求仍可能失败；这个缺口就是容量总是滞后于尖峰的原因。',

  // Queue panel.
  'The line': '排队情况',
  'How full it is': '排到多满',
  'Full. It is turning away {rate}. Work arriving now is being destroyed, not delayed. The consumers cannot keep up.':
    '满了。它正在以 {rate} 的速率拒收新工作。现在到达的工作会被直接丢掉，不是延后。消费者跟不上了。',
  'Work is waiting here because the consumers are slower than the producers. It drains once they catch up.':
    '工作在这里排队，因为消费者比生产者慢。等它们追上来就会消化掉。',

  // Correctness.
  Correctness: '正确性',
  'Each finished call charges money': '每次完成的调用都会计费',
  'Only the correctness checks in Can you break it? read this. It changes nothing about how the run plays.':
    '只有“你能把它弄坏吗？”里的正确性检查会读这个。它不改变运行的过程。',
  'Ignore repeats with an ': '用',
  'idempotency key': '幂等键忽略重复请求',
  'Retries with the same key are answered from memory instead of charging again. Every request carries a key, the same on each retry. A key whose call succeeded here gets that answer again instead of doing the work twice. One still being worked on is refused, so the caller tries again, and one whose call failed is forgotten, so a retry does the work. Turn this on where the card is charged. On a part in front of it, a call that charged and then failed on the way back is forgotten, and the retry charges again. Keys are forgotten after 65,536 newer requests.':
    '带同一个键的重试会用记忆里的答案应答，而不是再次计费。每个请求都带一个键，每次重试都相同。键对应的调用在这里成功过，就直接把那个答案再给一次，而不是把活干两遍。还在处理中的键会被拒绝，调用者于是重试；调用失败的键会被忘掉，于是重试会把活干一遍。在真正扣费的那一环打开它。在它前面的一环上，一次已经扣费却在回程失败的调用会被忘掉，重试就会再扣一次。键在又来过 65,536 个新请求之后会被忘掉。',
  'Read from the primary while the copies are behind': '副本落后期间从主库读取',
  "A read of a record the copies have not caught up on goes to the primary, so people always see a change they were told was saved. Each one waits for and takes one of the primary's write slots.":
    '副本还没追上的记录，读取会送到主库，所以人们总能看到被告知已保存的改动。每一次这样的读取都要等待并占用主库的一个写槽位。',

  // Durability and the throughput ceiling.
  Durability: '持久性',
  'What that works out to': '算下来是多少',
  'Most it can finish': '最多能完成',
  'running ': '台运行中的',
  ' each': '/槽',
  ', if everything it calls answered instantly': '，前提是它调用的每一环都立刻应答',
  'Slots held': '占用的槽位',
  'Can keep up with': '能跟上的负载',
  'It can finish {pct} of what arrives. The rest waits or fails.':
    '它只能完成到达量的 {pct}。剩下的要么排队，要么失败。',
  'The load arriving now, with room to spare.': '当前到达的负载，还有余量。',

  // Suggested fix and live readings.
  'Suggested fix': '建议的修法',
  'Right now': '当前状态',
  'Being handled now': '正在处理',
  'Waiting on its calls': '等待它的调用',
  'Waiting in line': '排队中',
  Finishing: '完成',
  Arriving: '到达',
  'Not on disk yet': '尚未落盘',
  'Lost when it last went down': '上次宕机时丢失',
  'Typical request': '典型请求',
  'Slower requests': '较慢的请求',
  'Slowest requests': '最慢的请求',
  Failing: '失败',
  'Turned away': '被拒绝',
  'Timed out': '已超时',
  'Completed, total': '累计完成',
  'Failed, total': '累计失败',
  'Nothing has reached this component yet. Press Play and it will start reporting.':
    '还没有任何请求到达这个组件。按播放，它就会开始报告。',

  // Per-kind live rows.
  'Hit rate right now': '当前命中率',
  'Fetched from origin': '从源站取回',
  Admitted: '放行',
  'Refused (rate limit)': '拒绝（限流）',
  Circuit: '熔断状态',
  'OPEN, failing fast': '断开，快速失败',
  probing: '试探',
  closed: '闭合',
  'Downstream errors, windowed': '下游错误率（窗口内）',
  'Probes again in': '距下次试探',
  'Refused (circuit open)': '拒绝（熔断断开）',
  'Times tripped': '跳闸次数',
  Upstream: '上游',
  EJECTED: '已隔离',
  proxying: '转发中',
  'Upstream failures': '上游失败',
  'Consecutive failures': '连续失败',
  'Times ejected': '隔离次数',
  'New connections': '新建连接',
  'Connections refused': '被拒连接',
  'Cold starts': '冷启动',
  'Running now': '正在运行',
  'Warm and idle': '预热且空闲',
  'Refused (at the cap)': '拒绝（并发已满）',
  'Worst group lag': '最落后的组滞后',
  Delivering: '投递中',
  'Lost to retention': '因保留量丢弃',
  Subscribers: '订阅者',
  'Refused (bad auth)': '拒绝（鉴权失败）',
  Reads: '读取',
  Writes: '写入',
  'Lock wait per write': '每次写入的锁等待',
  'Slowdowns, hot prefix': '变慢（热前缀）',
  'Restore jobs running': '进行中的取回任务',
  'Refused (quota full)': '拒绝（配额已满）',
  'Renditions out': '输出版本',
  'Stale searches': '过期搜索',
  Searches: '搜索',
  'Index writes': '索引写入',
  Appends: '追加',
  'Range queries': '范围查询',
  'Cost per traversal, measured': '实测单次遍历代价',
  'Cost per query, measured': '实测单次查询代价',
  'Refused (pool full)': '拒绝（池已满）',
  'Waiting to acquire': '等待获取',
  'Last acquire wait, measured': '实测最近一次获取等待',
  'Acquire timeouts': '获取超时',
  Delivered: '已投递',
  Redelivering: '重投中',
  'Dead-lettering': '进入死信',
  'Dead letters, total': '死信总数',
  Flushing: '刷盘中',
  'Flushes failing': '刷盘失败',
  'Passed to origin': '送往源站',
  'Killed by the CPU budget': '被 CPU 预算终止',
  'High priority admitted': '放行的高优先级',
  'Low priority admitted': '放行的低优先级',
  'Low priority cut': '被削的低优先级',
  'High priority cut': '被削的高优先级',

  // Footer.
  'Delete component': '删除组件',

  // The traffic bar above the canvas.
  'No traffic source': '没有流量来源',
  'No traffic source on the canvas': '画布上没有流量来源',
  'Less load': '减小负载',
  'More load': '加大负载',
  base: '基准',
  ', now ': '，当前 ',
  'requests a second': '请求/秒',
  '{n} request per second': '{n} 请求/秒',
  '{n} requests per second': '{n} 请求/秒',
  'Add a client to send traffic.': '添加一个客户端来发出流量。',
  'Set by the challenge you are in.': '由你所在的挑战设定。',
  'Nothing to measure yet. Add a component to get started.':
    '还没有可测量的东西。先添加一个组件。',
  'System ': '系统 ',
  'no replies': '没有响应',
  Goodput: '有效吞吐',
  Lost: '丢失',
  'Simulation transport': '仿真运行控制',
  'Pause (Space)': '暂停（Space）',
  'Play (Space)': '播放（Space）',
  'Step one tick (S)': '前进一个时间步（S）',
  'Reset simulation': '重置仿真',
  'Speed {speed}': '速度 {speed}',
  'Speed {speed}. Press for {next}': '速度 {speed}。按下切换到 {next}',
  '{x} times': '{x} 倍',
  ' ([ slower, ] faster)': '（[ 更慢，] 更快）',
  'Set to {speed}. This design runs at {slow} on this machine.':
    '已设为 {speed}。这个设计在这台机器上只能跑到 {slow}。',
  'Load is {said}, where 1x is {rate}': '负载为 {said}，其中 1x 为 {rate}',
  'Load as a multiple': '按倍数看负载',
  '1x is ': '1x 是 ',
  ', the rate these multiples count from.': '，这些倍数都以它为基准。',
  'Past the {rate} limit': '已超过 {rate} 的上限',
  'Make ': '把 ',
  ' the new 1x': ' 设为新的 1x',

  // Section headings.
  'What it is doing': '它正在做什么',
  'Packet loss': '丢包',
  'Break it on purpose': '故意弄坏它',
};
