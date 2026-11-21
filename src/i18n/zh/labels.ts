/**
 * Chinese node labels for the preset topologies (and the default label each
 * kind gets when a reader drops a new node). Keys are the exact English
 * label strings; see src/i18n/display.ts for why data stays English.
 *
 * Labels render inside a node box 184px wide, so they stay short: two to six
 * characters plus any brand word. Terminology follows the shared vocabulary
 * already in zh/canvas.ts (the palette's kind names): 自动扩缩容, 舱壁隔离,
 * 负载削减器, 异步写缓存, 只读副本, 分片存储, and so on. Brand and product
 * names keep their English form (S3, Redis, Kafka, EVCache, Hystrix, Zuul,
 * Mnesia, Open Connect OCA, PlayAPI, Lambda, Sidecar, Cron, Webhook, WS),
 * because the student will meet those words in real dashboards. Labels that
 * are already language-neutral ("API 1", "CDN", "Lambda") have no entry and
 * pass through unchanged.
 */

export const zhLabels: Record<string, string> = {
  // ---- defaults: DEFAULT_LABEL in src/sim/presets.ts (one per kind) ----
  Client: '客户端',
  'Load Balancer': '负载均衡器',
  Service: '服务',
  Cache: '缓存',
  Database: '数据库',
  Queue: '队列',
  Worker: '工作进程',
  'Read Replicas': '只读副本',
  'Sharded Store': '分片存储',
  'Rate Limiter': '限流器',
  'Circuit Breaker': '熔断器',
  Autoscaler: '自动扩缩容',
  Region: '区域',
  'Object Storage': '对象存储',
  'Search Index': '搜索索引',
  'Time-Series DB': '时序数据库',
  'Graph Database': '图数据库',
  'Cold Storage': '冷存储',
  'Vector Database': '向量数据库',
  'Stream Broker': '流代理',
  'Pub/Sub Topic': '发布/订阅主题',
  'WebSocket Gateway': 'WebSocket 网关',
  'API Gateway': 'API 网关',
  'Sidecar Proxy': 'Sidecar 代理',
  'Cron Job': 'Cron 任务',
  Bulkhead: '舱壁隔离',
  'Retry Queue': '重试队列',
  Transcoder: '转码器',
  'Edge Compute': '边缘计算',
  'Write-Behind Cache': '异步写缓存',
  'Load Shedder': '负载削减器',

  // ---- 1-5. single server, load balanced, cache aside, async, retry ----
  'API Server': 'API 服务',
  'Message Queue': '消息队列',
  Workers: '工作进程',

  // ---- 6. CDN and origin ----
  'CDN Edge': 'CDN 边缘节点',
  'Origin Server': '源站服务器',

  // ---- 8. circuit breaker ----
  'Payments API': '支付 API',

  // ---- 9. read replicas ----
  'Replica Set': '只读副本集',

  // ---- 12. multi-region ----
  'Region Router': '区域路由',
  'US API': '美国 API',
  'EU API': '欧洲 API',
  'US Database': '美国数据库',
  'EU Database': '欧洲数据库',

  // ---- 13. full stack ----
  'Job Queue': '任务队列',

  // ---- 14. specialised stores ----
  'Batch Jobs': '批处理任务',
  'Archive Queue': '归档队列',
  'Search API': '搜索 API',
  'Recs API': '推荐 API',
  'Media API': '媒体 API',
  Archiver: '归档器',
  'Vector Index': '向量索引',
  'Social Graph': '社交图谱',
  'Metrics Store': '指标库',

  // ---- 15. event-driven ----
  'API Clients': 'API 客户端',
  'API Service': 'API 服务',
  'Event Stream': '事件流',
  'Search Indexer': '搜索索引器',
  Billing: '计费',
  'Fan-out Topic': '扇出主题',
  'Push Notifs': '推送通知',
  'Audit Log': '审计日志',
  Metrics: '指标',
  'Chat Clients': '聊天客户端',
  'WS Gateway': 'WS 网关',
  'Chat Sidecar': '聊天 Sidecar',
  'Chat Service': '聊天服务',
  'Nightly Report': '每日报表',
  'Report Fn': '报表函数',

  // ---- 16. resilient delivery ----
  'Recs Bulkhead': '推荐舱壁',
  Recommendations: '推荐服务',
  'Notify Queue': '通知队列',
  'Notification Service': '通知服务',
  'Upload Client': '上传客户端',
  'Encode Queue': '转码队列',
  'Transcoder Farm': '转码集群',

  // ---- 17. checkout ----
  Shop: '商店',
  'Checkout API': '结账 API',
  Payments: '支付服务',
  'Orders DB': '订单数据库',

  // ---- 18. Discord ----
  'New Connections': '新连接',
  'Gateway (WS)': '网关（WS）',
  'Session Servers': '会话服务器',
  'Message Senders': '消息发送方',
  'API Rate Limit': 'API 限流',
  'Message API': '消息 API',
  'Guild Fan-out': '服务器扇出',
  'Gateway Push A': '网关推送 A',
  'Gateway Push B': '网关推送 B',
  'Gateway Push C': '网关推送 C',
  'Message Store': '消息存储',
  'Index Queue': '索引队列',
  'Message Search': '消息搜索',
  'Media Fetch': '媒体拉取',
  'Media CDN': '媒体 CDN',
  Attachments: '附件',
  'Voice Joins': '语音接入',
  'RTC Discovery': 'RTC 发现',
  'Voice Server A': '语音服务器 A',
  'Voice Server B': '语音服务器 B',

  // ---- 19. Uber ----
  'Rider Apps': '乘客应用',
  'Edge Gateway': '边缘网关',
  Dispatch: '派单服务',
  'Maps ETA': '地图 ETA',
  'Offer Push': '订单推送',
  'Dynamic Pricing': '动态定价',
  'Surge KV Store': '加价 KV 存储',
  'Trip Service': '行程服务',
  'Trip Store': '行程存储',
  'Payment Breaker': '支付熔断器',
  'Driver Pings': '司机上报',
  'Location Ingest': '位置接入',
  'Kafka Event Bus': 'Kafka 事件总线',
  'Geo Updater': '位置更新器',
  'Geo Index (H3)': '地理索引（H3）',
  'Surge Pipeline': '加价流水线',
  'M3 Metrics': 'M3 指标',

  // ---- 20. Netflix ----
  'Stream Viewers': '观看用户',
  'S3 Origin (fill)': 'S3 源站（回填）',
  'Studio Ingest': '片源接入',
  'Cosmos Job Queue': 'Cosmos 任务队列',
  'VES Encode Farm': 'VES 转码集群',
  'Atlas Telemetry': 'Atlas 遥测',
  'Device API Calls': '设备 API 调用',
  'Zuul 2 Gateway': 'Zuul 2 网关',
  'Hystrix Breaker': 'Hystrix 熔断器',
  'DRM License Svc': 'DRM 授权服务',
  'EVCache (viewing)': 'EVCache（观看记录）',
  'Cassandra Ring': 'Cassandra 环',
  'Keystone Pipeline': 'Keystone 管道',
  'Viewing History': '观看历史',
  'Browse API': '浏览 API',
  Personalisation: '个性化推荐',
  'EVCache (recs)': 'EVCache（推荐）',

  // ---- 21. Spotify ----
  'Listeners (audio)': '听众（音频）',
  'Audio CDN': '音频 CDN',
  'GCS Audio Storage': 'GCS 音频存储',
  'App Clients': '应用客户端',
  'Metadata Service': '元数据服务',
  'Metadata Cache': '元数据缓存',
  'Track Metadata DB': '曲目元数据库',
  'Search Index (ES)': '搜索索引（ES）',
  'Playlist Service': '播放列表服务',
  'Playlist Store': '播放列表存储',
  'Home & Discover Feed': '首页与发现流',
  'Taste Vectors': '口味向量',
  'Discover Weekly Batch': 'Discover Weekly 批处理',
  'Feature Job Queue': '特征任务队列',
  'Feature Pipeline': '特征流水线',
  'Event Firehose': '事件洪流',
  'Event Delivery': '事件投递',
  'Royalty & Reporting': '版税与报表',
  'Analytics Store': '分析库',

  // ---- 22. Twitter/X ----
  'Timeline Readers': '时间线读取',
  'Timeline Service': '时间线服务',
  'Timeline Cache (Redis)': '时间线缓存（Redis）',
  'Tweet Store (sharded)': '推文存储（分片）',
  'Search Blender': '搜索混合器',
  'Earlybird Index': 'Earlybird 索引',
  'Tweet Writers': '发推用户',
  'Write Rate Limit': '发推限流',
  'Tweet Write API': '推文写入 API',
  'Tweet Firehose': '推文洪流',
  'Fanout Workers': '扇出工作进程',
  'Timeline Store (Redis)': '时间线存储（Redis）',
  'Celebrity Tweet': '名人推文',
  'Push Notifications': '推送通知',

  // ---- 23. Stripe ----
  'Merchant API Calls': '商户 API 调用',
  'Idempotency Keys': '幂等键',
  'Payment Service': '支付服务',
  'Radar Fraud Check': 'Radar 风控检查',
  'Network Breaker': '卡组织熔断器',
  'Card Networks (external)': '卡组织（外部）',
  'Ledger (double-entry)': '账本（复式记账）',
  'Payment Events': '支付事件',
  'Webhook Delivery': 'Webhook 投递',
  'Merchant Endpoints': '商户端点',
  'Billing Metrics': '计费指标',
  'Payout Batch': '出款批次',
  'Payout Jobs': '出款任务',
  'Dashboard Readers': '看板读取方',
  'Reporting Limiter': '报表限流器',
  'Reporting API': '报表 API',
  'Ledger Replicas': '账本副本',

  // ---- 24. WhatsApp ----
  'Erlang Router': 'Erlang 路由器',
  'Recipient Lookup (70% online)': '收件人查找（70% 在线）',
  'Push to Connected': '在线推送',
  'Offline Store (Mnesia)': '离线存储（Mnesia）',
  'Deliver on Reconnect': '重连后投递',
  'Midnight Spike': '午夜峰值',
  'Phones Connecting': '手机连接',
  'Chat Gateway (Erlang)': '聊天网关（Erlang）',
  'Session Store (Mnesia)': '会话存储（Mnesia）',
  'Media Uploads': '媒体上传',
  'Media HTTP Service': '媒体 HTTP 服务',
  'Media Blob Store': '媒体对象存储',
  'Media Downloads': '媒体下载',
  'Media Cache': '媒体缓存',
};
