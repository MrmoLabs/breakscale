/**
 * Chinese note texts and section titles for the preset topologies. Keys are
 * the exact English strings; see src/i18n/display.ts.
 *
 * Notes are the teaching prose a student reads on the canvas, so they
 * translate the full argument rather than compressing it: same numbers, same
 * causal order, plain language, full-width punctuation, and the English term
 * in parentheses only where the student will meet it again in an interface
 * (fault buttons keep their dictionary names: 弄崩, 变慢, 抖动). Numbers keep
 * their digits; "4x" stays "四倍" because the load slider itself is labelled
 * in multiples. Section titles stay short, because the plate they render on
 * is one label-plate tall.
 */

export const zhNotes: Record<string, string> = {
  // ---- 1. single server ----
  'One server, one database. The database is the smaller of the two: 6 requests at a time at 30ms each, so it runs out near 200 a second. Drag the load past 200 a second and the wait builds there first, not at the API.':
    '一台服务器，一个数据库。两者中数据库更小：一次只能接待 6 个请求，每个 30ms，所以每秒 200 左右它就到头了。把负载拖过每秒 200，排队先出现在数据库这里，而不是 API。',

  // ---- 2. load balanced ----
  'Three servers share one database. That triples the API capacity and does nothing for the database, which still tops out near 430 a second. Adding servers only helps when the servers were the problem.':
    '三台服务器共享一个数据库。这把 API 的容量变成三倍，对数据库却毫无帮助：它仍然在每秒 430 左右到顶。加服务器只有在服务器本身是瓶颈时才帮得上忙。',

  // ---- 3. cache aside ----
  'The database only ever sees the misses. At an 85 percent hit rate it takes about 30 requests a second out of 200. Drag the hit rate down to 0.3 and it is instantly over its 133 a second ceiling, with no change in load at all.':
    '数据库只见到未命中的那部分。命中率 85% 时，200 个请求里每秒只有约 30 个落到它身上。把命中率拖到 0.3，它立刻越过每秒 133 的天花板，而总负载一点都没变。',

  // ---- 4. async workers ----
  'The workers drain 200 a second. Push the load past that and the client still gets an instant yes, because the queue is absorbing the difference. Nothing looks wrong until the queue fills, so the graph to watch is the queue depth, not the error rate.':
    '工作进程每秒能消化 200 个。把负载推过这条线，客户端仍然立刻得到应答，因为队列在吸收差额。队列填满之前一切看起来都正常，所以要盯的图是队列深度，而不是错误率。',

  // ---- 5. retry storm ----
  'The database handles 100 a second. Once waiting passes the 250ms timeout on the API, every request starts trying three times, so the load triples onto a database that was already full. It is steady at 80 a second. Push to 85 and it can tip over and lose most of its traffic; by 95 almost none gets through.':
    '数据库每秒能处理 100 个。一旦等待超过 API 上 250ms 的超时，每个请求都开始试三次，负载变成三倍，砸向一个本来就满负荷的数据库。每秒 80 时它很稳。推到 85，它就可能翻倒，丢掉大部分流量；到 95，几乎什么都过不去了。',

  // ---- 6. CDN and origin ----
  'The origin only ever sees what the cache misses. It handles 120 a second, and the cache is currently hiding 90 percent of the traffic from it. Drag the hit rate down and the origin gets a load nobody ever sized it for.':
    '源站只见到缓存没接住的部分。它每秒能处理 120 个，而缓存目前替它挡下了 90% 的流量。把命中率拖低，源站就会迎来一个从来没人为它规划过的负载。',

  // ---- 7. rate limited API ----
  'The limiter does not add capacity. It refuses some requests quickly so the rest are answered quickly: at 600 offered it serves 200 at 36ms, where removing it serves 240 at 235ms. Saying no fast is what buys the predictable wait.':
    '限流器并不增加容量。它快速拒绝一部分请求，好让其余请求也被快速回应：同样是 600 的请求量，有限流器时它以 36ms 服务 200 个；拆掉它则是以 235ms 服务 240 个。快速说不，换来的正是可预期的等待。',

  // ---- 8. circuit breaker ----
  'Select the payments API and press Crash in the inspector. Once half the calls in a four second window fail, the breaker opens and the rest fail in microseconds instead of waiting out a timeout. After three seconds it lets a few test calls through, and closes again only if they succeed.':
    '选中支付 API，在检查器里按下“弄崩”（Crash）。一旦四秒窗口内有一半调用失败，熔断器就会断开，剩下的调用在微秒内失败，而不是干等超时。三秒后它会放行几个试探调用，只有试探成功才会重新闭合。',

  // ---- 9. read replicas ----
  'Copies give you read capacity and nothing else: 600 reads a second across three of them, but still only 200 writes against the one primary. Adding copies fixes one of those and does nothing at all for the other.':
    '副本给你的只是读取能力：三份副本合计每秒 600 次读取，但写入依然只有那一个主库，每秒 200 次。加副本能解决其中一半问题，对另一半毫无作用。',

  // ---- 10. sharded database ----
  'Four shards carry 160 a second each. Push the hot key share to 0.8 and one shard alone is offered 320 against its own 160, so it pins and sheds while the utilisation meter, an average across all four, still looks comfortable.':
    '四个分片各自承担每秒 160。把热点键占比推到 0.8，仅一个分片就要面对 320，而它自己只有 160：它被钉死并开始丢弃，而利用率仪表（四个分片的平均）看起来依然从容。',

  // ---- 11. autoscaling service ----
  'Raise the load and capacity does not follow. The controller waits out three seconds of cooldown, decides, and the new machines take four more to boot. Requests fail in that gap, and the gap is the point: an autoscaler lags, it does not shield.':
    '把负载调高，容量不会立刻跟上。控制器先等满三秒冷却期，再做决定，新机器还要再花四秒启动。请求就失败在这段空档里，而这正是重点：自动扩缩容是滞后的，它不是盾牌。',

  // ---- 12. multi-region ----
  'Crash the US API. For five seconds every request fails while the router notices, then Europe picks it all up. Only one region takes traffic at a time, so this pair buys you survival, not extra capacity: at 4x the active region melts while the standby sits at zero.':
    '把美国 API 弄崩。路由器察觉的五秒里每个请求都在失败，然后欧洲把全部流量接了过去。同一时刻只有一个区域接流量，所以这对区域买到的是活下来的能力，不是额外容量：四倍负载时，活跃区域被压垮，备用区域却在原地纹丝不动。',
  'United States, taking traffic': '美国：正在接流量',
  'Europe, idle until it is needed': '欧洲：待命，需要时才上场',

  // ---- 13. full stack ----
  'Two thirds of the traffic never gets past the edge cache. Only the misses reach anything below, which is why everything behind it looks so lightly loaded at rest.':
    '三分之二的流量根本过不了边缘缓存。只有未命中的才会到达下面任何一层，这就是静止时它后面所有东西都显得那么轻载的原因。',
  "Take the load to 4x and watch the job queue. The workers fall behind and for a few seconds the queue swallows the excess, so the client is still told everything is fine. Then its 5000 places fill, and the errors the client sees come from there, while the sharded store's busiest partition is maxed out but turns almost nothing away.":
    '把负载调到四倍，盯着任务队列。工作进程落后了，接下来几秒里队列吞下超额部分，客户端仍然被告知一切正常。然后它的 5000 个位置被填满，客户端看到的错误都来自这里；与此同时，分片存储里最忙的那个分区早已满负荷，却几乎什么都没拒绝过。',
  'Answered while you wait': '当场回应',
  'Answered later': '稍后回应',

  // ---- 14. specialised stores ----
  'One general purpose database would do all of this badly. A text index, a vector index and a graph each answer a question the others are slow at, and the price is four stores to run instead of one.':
    '一个通用数据库会把这一切都做得很差。文本索引、向量索引和图谱各自回答一个其他存储不擅长的问题，代价是要运行四个存储而不是一个。',
  'Take the load to 4x. The vector index saturates and the client sees the errors immediately. The archive path saturates too and says nothing: the batch client is still acked while cold storage turns restores away behind the queue.':
    '把负载调到四倍。向量索引饱和，客户端立刻看到错误。归档路径同样饱和，却一声不吭：批处理客户端照样收到确认，而冷存储在队列后面悄悄把取回请求拒之门外。',
  'Cold storage is slow on purpose, seconds per restore, because almost nothing is ever read back. Paying for fast storage you never read is the mistake this avoids.':
    '冷存储的慢是故意的：每次取回要花几秒，因为几乎没有什么会被读回来。为从来不读的快速存储买单，才是这里要避免的错误。',
  'A different store for each question': '每个问题配一种存储',
  'Moving old data somewhere cheaper': '把旧数据挪去更便宜的地方',

  // ---- 15. event-driven ----
  'Everything on the left is a caller waiting for an answer. Everything on the right runs after that answer was already sent.':
    '左边的一切，都是还在等回应的调用方。右边的一切，都发生在回应已经发出之后。',
  'One event becomes five pieces of work here, each read by its own consumer. Turn the load up to 2x and watch the audit log and the search indexer: the audit log runs out of room and drops messages, and the indexer falls further behind the stream, while billing, push and metrics keep up. Nobody calling the API sees a thing.':
    '在这里，一个事件变成五份工作，各由自己的消费者读取。把负载调到两倍，盯住审计日志和搜索索引器：审计日志装不下就开始丢消息，索引器离流越来越远，而计费、推送和指标都跟得上。调用 API 的任何人都察觉不到这一切。',
  'The report function starts cold. The first call after a quiet spell pays 350ms of startup, then stays warm for ten seconds. Watch the first burst after the timer fires.':
    '报表函数是冷启动的。安静一阵之后的第一笔调用要付 350ms 的启动费，然后保暖十秒。盯住计时器触发后的第一批突发。',

  // ---- 16. resilient delivery ----
  'At 4x the shedder drops the traffic marked best effort first, to protect the rest. Choosing what to drop beats letting a queue choose for you.':
    '四倍负载时，削减器先丢弃标记为尽力而为（best effort）的流量，以保护其余部分。自己选择丢什么，好过让队列替你做决定。',
  "Select recommendations and press Slow in the inspector. The bulkhead in front fills within one round trip, and after that the extra calls fail in microseconds instead of queueing. One slow feature stops being everyone else's problem.":
    '选中推荐服务，在检查器里按下“变慢”（Slow）。它前面的舱壁一个往返之内就被填满，之后多出来的调用在微秒内失败，不再排队。一个慢功能从此不再是所有人的问题。',
  'The write cache acks in about a millisecond and flushes 200ms later, so roughly 50 rows are always acknowledged but not yet stored. Crash it and exactly that many writes are gone.':
    '写缓存在约一毫秒内确认，200ms 后才落盘，所以任何时刻都有约 50 行已确认但尚未存储。把它弄崩，丢掉的恰好就是这么多写入。',
  'The transcoders drain about 3.3 jobs a second against 3 arriving, so they are already 90 percent busy at rest. Turn the load up and the backlog grows about 9 jobs every second and never drains on its own. Raise the number of instances to fix it.':
    '转码器每秒消化约 3.3 个任务，而到达的是 3 个，所以它们静止时就已有九成忙碌。把负载调高，积压大约每秒增加 9 个任务，而且永远不会自行消化。调高实例数才能解决。',
  'Failing on purpose, not by surprise': '有计划地失败，不出意外',
  'Work that can wait': '等得起的工作',

  // ---- 17. checkout ----
  'Every call that finishes at Payments charges a card. The API gives Payments 300ms, then tries again while the first try is still running, and that one charges too. Open Can you break it? and ask that nobody pays twice. Push the load to 3x and it is broken with no faults at all, while the error chart barely moves.':
    '每一笔在支付服务跑完的调用都会扣一次卡。API 给支付服务 300ms，超时就在第一次还在执行时重试，而重试同样会扣款。打开“你能把它弄坏吗？”（Can you break it?），并要求做到没有任何人被扣两次款。把负载推到三倍，不注入任何故障它就坏了，而错误曲线几乎不动。',

  // ---- 18. Discord ----
  'The gateway counts open connections, not requests. 30 new a second, each held for 40 seconds, is 1200 sockets against a ceiling of 1600. Double the load and it starts refusing connections outright.':
    '网关数的是打开的连接，不是请求。每秒 30 个新连接，每个握住 40 秒，就是 1200 个套接字，上限是 1600。负载翻倍，它就开始直接拒绝连接。',
  'Drag the message rate up and watch the push servers. One message becomes one delivery per pod, and each pod can only do about 130 a second. Past that, members stop seeing messages while the senders see no errors at all. That silence is what makes fan-out hard.':
    '把消息速率调高，盯住推送服务器。一条消息变成每个副本一份投递，而每个副本每秒只能处理约 130 份。超过之后，成员看不到新消息，发送方却看不到任何错误。正是这种沉默让扇出变得困难。',
  'Messages are split across six channel shards. Give the message store a hot key and one busy channel takes far more than its share, so that shard melts while the average still looks healthy.':
    '消息被切分到六个频道分片上。给消息存储一个热点键，一个繁忙频道就会拿走远超它的份额：那个分片被压垮，而平均值看起来依然健康。',
  'Voice runs on its own servers and never touches the text path, so chat can be on fire while calls stay up.':
    '语音跑在独立的服务器上，从不碰文字路径，所以聊天可以一片火海，通话却安然无恙。',
  'Holding the sockets open': '握住这些连接',
  'Writing a message': '发出一条消息',
  'Pushing it out': '推送给每个人',
  'Indexed later, off to the side': '稍后索引，另起一摊',
  Attachments: '附件',
  'Voice, on its own hardware': '语音：独立的硬件',

  // ---- 19. Uber ----
  'One rider request touches four services before an offer comes back. The slowest of them sets the wait, so a match happens at the speed of the weakest link here.':
    '一个乘客请求在应答回来之前要经过四个服务。其中最慢的那个决定了等待时长，所以派单的速度取决于这里最弱的一环。',
  'Drag the load to 4x and watch payments. Each charge takes 200ms and only four run at once, so it tops out near 20 a second and the extra trip requests are turned away. The breaker in front opens once half its calls fail. At 4x about a third do, so it trips only now and then. Crash payments to watch it open and fail fast.':
    '把负载拖到四倍，盯住支付。每笔扣款要 200ms，同时只能跑四笔，所以它每秒 20 左右就到顶，多出来的行程请求被拒之门外。它前面的熔断器在一半调用失败时断开；四倍负载下大约三分之一会失败，所以它只是偶尔跳闸。把支付弄崩，看它断开并快速失败。',
  'The location index is split by map cell. Give it a hot key and the whole city crowds into one cell, so that one shard saturates while the rest sit idle.':
    '位置索引按地图网格切分。给它一个热点键，全城的人就挤进一个网格：那一个分片饱和，其余的无所事事。',
  '400 driver pings a second go onto one stream, and three readers consume it on their own clocks. If the map updater falls behind, dispatch quietly matches on stale positions and nothing on the rider path shows an error.':
    '每秒 400 条司机上报进入同一条流，三个读者按各自的节奏消费它。地图更新器一旦落后，派单就悄悄基于过时的位置做匹配，而乘客路径上没有任何错误提示。',
  'Finding a driver': '寻找司机',
  'The trip, and getting paid': '行程与收款',
  'Where the drivers are, updated constantly': '司机在哪里：实时更新',

  // ---- 20. Netflix ----
  '1500 requests a second of video, and 240 of everything else. The video almost never reaches Netflix: the edge cache answers 96 percent of it from inside your ISP.':
    '每秒 1500 个视频请求，其他一切加起来只有 240 个。视频几乎从不真正到达 Netflix：边缘缓存在你的 ISP 内部就回应了其中的 96%。',
  'Encoding is slow and that is fine. Jobs wait in a queue and nobody is watching a spinner, so seconds here cost nothing.':
    '转码很慢，但这没关系。任务在队列里排队，没有人盯着转圈，所以这里的几秒钟毫无成本。',
  'The bottleneck is the licence service, not the video. It has 5 slots at 18ms, so it runs out at about 280 requests a second. Raise the load and watch it fill before anything else does.':
    '瓶颈是授权服务，不是视频。它有 5 个槽位，每个 18ms，所以每秒 280 个请求左右它就到头了。调高负载，看它比谁都先被填满。',
  'The breaker in front of it is what stops one slow service from holding every request open. Trip it and playback fails fast instead of hanging.':
    '它前面的熔断器，正是让一个缓慢服务拖不住所有请求的那道闸。让它跳闸，播放会快速失败，而不是挂死。',
  'Recommendations sit behind a bulkhead, so if they get slow the play path is untouched. Browsing breaking is survivable; playback breaking is not.':
    '推荐服务躲在舱壁后面，它变慢时播放路径毫发无损。浏览坏掉还能活，播放坏掉不能。',
  'Moving the video': '搬运视频',
  'Where API calls arrive': 'API 调用的入口',
  'Starting a stream': '开始播放',
  'Browsing, kept separate': '浏览：独立开来',

  // ---- 21. Spotify ----
  'Audio and everything else are separate systems. 1100 song fetches a second go to a cache near the listener, but a music catalogue has a long tail, so nearly one in five still reaches storage.':
    '音频和其他一切都是分开的系统。每秒 1100 次取歌请求发往听众附近的缓存，但曲库有一条长尾，所以差不多每五个里仍有一个落到存储上。',
  'Adding a song is a write, and writes only go to the one main copy of the playlist store. It manages about 100 a second, and its three read copies only help reads. Reads also run up to 150ms behind, so a song you just added can be missing when the playlist loads back.':
    '添加歌曲是一次写入，而写入只去播放列表存储的唯一主副本。它每秒约能应付 100 次，三个读取副本只帮得上读取。读取还会落后最多 150ms，所以刚加的歌可能在列表重新加载时还没出现。',
  'Watch the taste vectors. Every 20 seconds the recommendation batch writes into the same index the home feed reads from, and the index jumps from about 15 to nearly 90 percent busy for a second. There is room to spare, so the slowest requests on the feed barely move.':
    '盯住口味向量。每 20 秒，推荐批处理就写入首页信息流正在读的同一个索引，索引的忙碌度在一秒内从约 15% 跳到接近 90%。余量足够，所以信息流上最慢的请求几乎不受影响。',
  'Two readers share one event stream. Turn the load up and the royalty job cannot keep up while the analytics store beside it does fine. Royalty falls behind silently, and eventually the oldest events expire before it reaches them.':
    '两个读者共享同一条事件流。调高负载，版税任务跟不上，旁边的分析库却安然无恙。版税悄悄掉队，最终最老的事件没等到它处理就过期了。',
  'Playing the music': '播放音乐',
  'Everything else the app asks for': '应用要的其余一切',
  'Recomputing recommendations offline': '离线重算推荐',
  'What was played, counted twice': '播放过的内容，记两遍账',

  // ---- 22. Twitter/X ----
  'Reading a timeline is cheap because the answer was written in advance. 300 reads a second are almost all served straight from cache; only a miss goes back to look up who you follow and rebuild it.':
    '读时间线之所以便宜，是因为答案早就写好了。每秒 300 次读取几乎全部直接命中缓存；只有未命中才回头查你关注了谁，再重建一遍。',
  'Turn the load up to 2x and watch the fan-out workers. One tweet means one insert into every follower timeline, about 120ms each, and only eight run at once. They fall behind and never catch up, so timelines go stale while every read still comes back fast and green.':
    '把负载调到两倍，盯住扇出工作进程。一条推文意味着往每个关注者的时间线里插一条，每次约 120ms，而且同时只能跑八个。它们落后了，而且再也追不上：时间线悄悄过期，而每一次读取仍然又快又绿。',
  'Every 20 seconds a famous account tweets, and that one tweet becomes 200 fan-out jobs at once. This is why very large accounts get handled differently from everyone else.':
    '每 20 秒，一个大账号发一条推文，这条推文瞬间变成 200 个扇出任务。这就是超大账号要被区别对待的原因。',
  'Reading a timeline': '读取时间线',
  'Writing one, which costs far more': '写入时间线：贵得多',

  // ---- 23. Stripe ----
  'A payment is the one thing you must never do twice. Each charge carries a key, and a retry of a charge already made gets the stored answer back instead of a second charge.':
    '支付是唯一绝不能做两遍的事。每笔扣款都带着一个键，对已扣款项的重试会取回存好的答案，而不是再扣一次。',
  'Select the card networks and press Glitch in the inspector. The breaker beside them opens, and charges start failing immediately instead of hanging. A payment that fails cleanly can be retried; one left in the air while a slow network times out is the one nobody can account for.':
    '选中卡组织，在检查器里按下“抖动”（Glitch）。旁边的熔断器随即断开，扣款立刻失败，不再悬挂。干净失败的支付可以重试；被晾在半空、等一个缓慢网络慢慢超时的那笔，才是没人能对上账的。',
  'Dashboards read copies of the ledger, behind their own limit. Someone loading a big report can never make a payment wait, because the two never share a queue.':
    '看板读的是账本副本，而且挂在自己专属的限流器后面。有人加载一份大报表，也绝不可能让一笔支付等待，因为两者从来不同队。',
  'Taking one payment': '收一笔款',
  'What happens after the money moves': '钱动过之后发生的事',
  'Reading the money back out': '把钱读出来',

  // ---- 24. WhatsApp ----
  'What runs out here is open connections, not requests. 45 phones connect a second and each holds on for 30 seconds, filling 1350 of the 1800 slots. This box is run deliberately hot, because connections were the entire cost of the system.':
    '这里先耗尽的是打开的连接，不是请求。每秒 45 部手机接入，每部握住 30 秒，填满 1800 个槽位中的 1350 个。这台机器刻意跑得很热，因为连接数就是整个系统的全部成本。',
  'The router does almost nothing per message: it cannot even read them. At 400 a second it is about one percent busy. Simple and small beat big here, and that was the point.':
    '路由器对每条消息几乎什么也不做：它甚至读不了它们。每秒 400 条时，它的忙碌度约为百分之一。简单和小巧在这里战胜了庞大，而这正是重点。',
  'Turn the load up to 4x and watch the offline store, not the error rate. A message to a phone that is not online parks here until it reconnects, so senders keep succeeding while undelivered messages pile up by the hundreds a second.':
    '把负载调到四倍，盯住离线存储，而不是错误率。发给不在线手机的消息会先停在这里，等它重连，于是发送方一路成功，而未送达的消息每秒堆积数百条。',
  'Photos and video ride a separate path and never touch the chat core, so a media outage leaves messaging alone.':
    '照片和视频走一条独立的路径，从不碰聊天核心，所以媒体出故障也殃及不到消息本身。',
  'Keeping phones connected': '让手机保持在线',
  'Sending a message, or parking it': '送出一条消息，或者先停一停',
  'Photos and video, on their own path': '照片和视频：走自己的路',
};
