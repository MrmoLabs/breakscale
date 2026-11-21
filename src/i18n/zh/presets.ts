/**
 * Chinese copy for the 24 example presets: the name, the one-line tagline and
 * the full description. Keys are the preset ids from src/sim/presets.ts, which
 * stay English on the wire (share links, saved designs and the learning path
 * all carry the id); only what is rendered goes through presetCopy().
 *
 * Names keep the brand prefix (Discord, Uber, ...) and translate the rest.
 * Terminology follows the shared vocabulary in the other dictionaries: 熔断器,
 * 舱壁隔离, 负载削减器, 扇出, and so on; the first mention of a term that a
 * student will meet again in English carries the English in parentheses.
 */

export const zhPresets: Record<
  string,
  { name: string; tagline: string; description: string }
> = {
  'single-server': {
    name: '单台服务器',
    tagline: '看着数据库成为瓶颈',
    description: '一个服务，后面带一个数据库。随着数据库被占满，延迟会陡然上升。',
  },
  'load-balanced': {
    name: '负载均衡',
    tagline: '服务器更多，背后的数据库还是同一个',
    description: '三台服务器分担负载，但它们要访问的仍然是同一个数据库。',
  },
  'cache-aside': {
    name: '旁路缓存（cache aside）',
    tagline: '命中率下降时会发生什么',
    description: '缓存挡住了大部分读取。把命中率调低，整个负载就全压到数据库身上。',
  },
  'async-workers': {
    name: '异步工作进程（async workers）',
    tagline: '积压增长得比消化还快',
    description:
      '请求会被立即确认，然后缓冲起来。看看工作进程跟不上时，积压是怎样增长的。',
  },
  'retry-storm': {
    name: '重试风暴（retry storm）',
    tagline: '重试让过载雪上加霜',
    description:
      '小数据库前面配了短超时和重试。重试会把当初引发重试的那点负载放大成几倍。',
  },
  'cdn-origin': {
    name: 'CDN 与源站',
    tagline: '有多少流量根本到不了你这里',
    description:
      'CDN 在边缘就回应了大部分请求，只有涓涓细流到达源站。调低命中率，看源站被压垮。',
  },
  'rate-limited-api': {
    name: '限流的 API',
    tagline: '在排队之前把多余的请求挡在门外',
    description:
      '限流器在门口就拒绝多余的流量。它处理的总量略少一点，但处理掉的每一个请求都保持快速，不会排在长队里。',
  },
  'circuit-breaker': {
    name: '熔断器（circuit breaker）',
    tagline: '给故障中的依赖留出恢复的空间',
    description:
      '熔断器盯着一个出故障的依赖，并停止调用它。把支付 API 弄坏，看熔断器跳闸，再看它恢复。',
  },
  'read-replicas': {
    name: '只读副本（read replicas）',
    tagline: '读取可以扩展，但也会读到旧数据',
    description:
      '副本扩展的是读取，不是写入；而且某次读取可能赶在它本该看到的写入之前到达。',
  },
  'sharded-database': {
    name: '数据库分片（sharding）',
    tagline: '一个热点键毁掉所有分片',
    description:
      '四个分片原本均匀分摊负载，直到某个键变热：单个分片被压垮时，平均值看上去依然健康。',
  },
  'autoscaling-service': {
    name: '自动扩缩容（autoscaling）',
    tagline: '容量总在需要之后才赶到',
    description: '容量在追赶负载，但新服务器启动需要时间，请求就失败在这段空档里。',
  },
  'multi-region': {
    name: '多区域故障转移（failover）',
    tagline: '一次故障转移真正让你付出什么',
    description:
      '两个区域，只有一个在服务。把活跃的那个弄崩，故障转移完成之前每个请求都会失败。',
  },
  'full-stack': {
    name: '完整架构',
    tagline: '所有组件同台，承受真实负载',
    description:
      '每一层都在同一张图里：边缘缓存、负载均衡器、服务、缓存、分片，以及这一切背后的异步任务队列。',
  },
  'specialised-stores': {
    name: '专用存储',
    tagline: '每种活儿配一种存储，并肩而立',
    description:
      '搜索、向量、图谱、大对象、指标和归档层，每种存储只为一种活儿而生。看哪一个先饱和，哪一个悄无声息地失败。',
  },
  'event-driven': {
    name: '事件驱动后端',
    tagline: '滞后、扇出、冷启动和 Cron 突发',
    description:
      '一条带两个消费者组（consumer group）的流、一个扇出主题、一层 WebSocket 网关、一个 Sidecar、一个 Lambda 函数和一次 Cron 突发。看消费者滞后（lag）如何增长，冷启动如何每 15 秒掀起一次尖峰，以及先耗尽的为什么是连接数而不是请求数。',
  },
  'resilient-delivery': {
    name: '有韧性的交付',
    tagline: '选择谁失败，失败又去往何处',
    description:
      '有计划地失败：削减器丢掉最不重要的流量，舱壁把缓慢的依赖隔离起来，重试的投递最终落在死信（dead letter）架上，后写缓冲则用耐久性换速度。',
  },
  checkout: {
    name: '结账与支付',
    tagline: '又快又稳，就是有人被扣了两次款',
    description:
      '结账 API 会调用支付服务和订单数据库。一次缓慢的响应会让 API 在第一次还在扣款时就重试，于是看板一片绿，却有顾客被扣了两次钱。',
  },
  discord: {
    name: 'Discord：实时聊天',
    tagline: '百万级连接，每条消息都要扇出',
    description:
      '根据 Discord 工程博客做的简化重建，数字只为示意。网关先耗尽的是连接数，不是请求数；一条消息会扇出给每一个网关副本，两倍负载时推送层丢掉投递而发送方毫无察觉；让一个频道变热，存储里就只有它的那个分片被压垮。语音走的是自己独立的服务器。',
  },
  uber: {
    name: 'Uber：叫车派单',
    tagline: '把乘客与司机一城一城地匹配起来',
    description:
      '根据 Uber 公开的架构做的简化重建，数字只为示意。司机位置上报是乘客请求的 13 倍，走的是 Kafka 风格的事件流；四倍负载时地理索引的消费者开始滞后，派单便悄悄基于过时的位置做匹配，与此同时支付服务被塞满，开始拒收行程请求。把支付处理弄崩，熔断器会把它隔离开。',
  },
  netflix: {
    name: 'Netflix：大规模视频流',
    tagline: '几乎一切都从边缘直接送达',
    description:
      '根据 Netflix 技术博客做的简化重建，数字只为示意。放在 ISP 机房里的 Open Connect 设备送出了约 96% 的字节，视频流几乎不碰云；真正被四倍负载打疼的是 Zuul 身后的控制面：授权服务触发 Hystrix 熔断器，推荐的舱壁被填满，Keystone 悄悄掉队，转码集群的积压不断增长，而观众的视频一路畅通。',
  },
  spotify: {
    name: 'Spotify：音乐与发现',
    tagline: '安稳的曲库旁边，站着一个沉重的推荐系统',
    description:
      '根据 Spotify 工程博客做的简化重建，数字只为示意。音频从对象存储经 CDN 送出，与元数据路径互不相干。播放列表的写入全部落在唯一的主副本上，读取则摊到各个副本；四倍负载时事件洪流跑赢了版税消费者；而每 20 秒，Discover Weekly 批处理都会写入首页信息流正在读的同一个向量索引，索引上的负载随批处理时钟一起跳动。',
  },
  twitter: {
    name: 'Twitter/X：时间线扇出',
    tagline: '一条推文变成十万次写入',
    description:
      '根据 Raffi Krikorian 的“Timelines at Scale”演讲对 Twitter 时间线做的简化重建，数字只为示意。推文在写入时扇出进预先算好的时间线，读取因此只需命中一次缓存；每 20 秒，一条名人推文会把 200 个扇出任务倒进事件流。超过两倍负载后，扇出组再也追不回来：读取一路绿灯，时间线却悄悄过期，只有消费者滞后说了真话。',
  },
  stripe: {
    name: 'Stripe：正确性优先于可用性',
    tagline: '宁可拒收，也不重复扣款',
    description:
      '根据 Stripe 公开的限流、幂等性与账本文章做的简化重建，数字只为示意。重复的重试由幂等存储直接回应；卡组织服务降级时，熔断器让扣款快速失败；Webhook 经由重试队列重新投递，最终落在死信（dead letter）架上；四倍负载时，网关在门口就削减多余的扣款，而看板按自己的副本限流。把账本弄崩：扣款戛然而止，看板照常读取，这个先后次序就是设计本身。',
  },
  whatsapp: {
    name: 'WhatsApp：存储转发',
    tagline: '消息选择等待，而不是失败',
    description:
      '根据 Rick Reed 的 Erlang 扩展性演讲对 WhatsApp 做的简化重建，数字只为示意。聊天核心刻意做得极小且几乎闲置：一跳路由，在线的收件人直接推送，离线的停在 Mnesia 存储里等重连，因此发送方几乎不可能失败。四倍负载时，未送达的消息每秒堆积数百条，错误数却是零；网关先耗尽的是握在手里的连接数，不是请求数。要看队列深度，而不是错误率。',
  },
};
