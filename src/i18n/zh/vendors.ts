/**
 * Chinese copy for the vendor layer.
 *
 * Product names stay exactly as the vendors write them (Amazon EC2, Cloud
 * Load Balancer, Azure Front Door, ...): a student will meet these names in
 * a console, and a translated brand name helps nobody, so products have no
 * entries here and render untouched.
 *
 * What DOES translate is the prose around the specs: each mapping's `note`
 * (why this product and not the vendor's other one), the two long caveat
 * sentences (DERIVED_NOTE, COST_NOTE), and the cost panel's chrome. Keys are
 * the exact English strings; the render sites pass them through t(), so a
 * note added before its translation exists degrades to readable English.
 *
 * Numbers, dates, SKUs and unit names keep the forms the vendors publish.
 */

export const zhVendors: Record<string, string> = {
  /* derive.ts: the sentence shown wherever a derived capacity appears. */
  'Capacity is our estimate from the vCPU count, not a figure the vendor publishes. Set it yourself to model your own service.':
    '容量是我们按 vCPU 数量估算出来的，不是厂商公布的数据。要模拟自己的服务，请直接自己设置。',

  /* cost.ts: the caveat under the monthly total. */
  'Compute only, at on-demand rates. A real bill also carries storage, network egress, backups and support, and discounts for commitment.':
    '只算按需价格的计算费用。一张真实账单还要包含存储、网络流出、备份和支持服务，以及承诺用量带来的折扣。',

  /* Cost panel chrome. */
  'Estimated cost': '预估成本',
  'Monthly cost': '每月成本',
  '/mo': '/月',
  'Pick an instance size for a component in the inspector and its cost will appear here.':
    '在检查器里给一个组件选好实例规格，它的花费就会出现在这里。',
  'Not counted, no size chosen: {names}.': '未计入（没选规格）：{names}。',

  /* ---------- AWS ---------- */
  'DBInstanceClassMemory is the instance memory minus an unpublished reservation for the OS and RDS processes, so this cannot be evaluated from the GiB column. AWS gives a worked example where the naive result is 683 and the real value is about 630.':
    'DBInstanceClassMemory 是实例内存减去一份未公开的预留量（留给操作系统和 RDS 进程），所以没法从 GiB 一栏直接算出来。AWS 给过一个算例：想当然算出的结果是 683，真实值约为 630。',
  'Not an AWS product. Traffic originates outside the account, so there is nothing to name here.':
    '这不是 AWS 的产品。流量来自账户之外，所以这里没有可写的产品名。',
  'ELB is three products. ALB is the HTTP one and the one a web system design means; NLB is layer 4, and the Classic balancer is previous generation.':
    'ELB 其实是三个产品。ALB 是管 HTTP 的那个，也是画 Web 系统设计图时指的那个；NLB 工作在第 4 层，Classic 负载均衡器则是上一代产品。',
  'The instance a student pictures when they say "a server". ECS, EKS and App Runner all schedule onto the same hardware, so the sizes below are what any of them ultimately buy.':
    '学生说“一台服务器”时脑子里想的就是它。ECS、EKS 和 App Runner 最终都调度到同样的硬件上，所以下面的规格就是它们实际上买的东西。',
  'RDS runs the engine a student already knows, usually PostgreSQL or MySQL. Aurora is the AWS-built alternative and DynamoDB is not relational at all, so neither is the honest default for a box labelled "database". Prices below are PostgreSQL, Single-AZ; Multi-AZ costs more.':
    'RDS 跑的是学生已经认识的数据库引擎，通常是 PostgreSQL 或 MySQL。Aurora 是 AWS 自建的另一种选择，DynamoDB 则完全不是关系型，所以对一个标着“database”的组件来说，两者都不该是默认选项。下面的价格是 PostgreSQL、单可用区（Single-AZ）的；多可用区（Multi-AZ）更贵。',
  'A queue one consumer drains. Kafka-style fan-out to many independent readers is a different shape and belongs on the stream broker.':
    '一条由单个消费者取空的队列。Kafka 那种扇出给多个独立读者的形状不同，该用流式消息代理。',
  'A worker is a server that reads from a queue instead of from a socket, so it is the same EC2 hardware as a service. Sizes are shared with `service` rather than repeated, because repeating them would let the two drift.':
    '工作进程是从队列取活而不是从端口接请求的服务器，所以它和 service 用的是同一种 EC2 硬件。规格与 `service` 共用而不另写一份，因为各写各的迟早会对不上。',
  'Timestream now covers time series through managed InfluxDB, which is also the engine a student is most likely to have met.':
    'Timestream 现在通过托管的 InfluxDB 提供时序数据库，这也是学生最可能已经接触过的引擎。',
  'A storage class of S3 rather than a separate service, chosen because the retrieval delay is the thing being taught.':
    '它其实是 S3 的一个存储类别，不是单独的服务。选它是因为这里要教的正是取回数据的延迟。',
  'AWS sells no standalone vector database. The nearest purpose-built thing is a vector search collection on OpenSearch Serverless, which is also what Bedrock knowledge bases default to.':
    'AWS 不卖独立的向量数据库。最接近的专用产品是 OpenSearch Serverless 上的向量搜索集合，Bedrock 知识库默认也是用它。',
  'Kinesis is the AWS-native one and shows the shard model plainly. Amazon MSK is the choice if the lesson depends on Kafka itself rather than on partitioned streaming.':
    'Kinesis 是 AWS 自家的产品，分片模型一目了然。如果这一课的重点是 Kafka 本身而不是分区流，那就选 Amazon MSK。',
  'Fan-out to subscribers, as against SQS, which is one queue drained by one consumer group. The pair is usually taught together.':
    '把消息扇出给多个订阅者；SQS 则相反，是一条队列由一个消费组取空。这一对通常放在一起教。',
  'A distinct API type from the REST and HTTP ones, because it holds the connection open and bills per connection-minute.':
    '它和 REST、HTTP 两种 API 是不同的类型，因为它要一直握住连接，并按连接分钟计费。',
  'The HTTP API is the cheaper and simpler of the two request/response types; the REST API is the one with the fuller feature set.':
    'HTTP API 是两种“请求/响应”类型里更便宜、更简单的那个；REST API 则是功能更全的那个。',
  'The current scheduling product. EventBridge rules on a schedule expression still work and are what older material shows.':
    '这是现在的定时调度产品。EventBridge 规则配上调度表达式也仍然可用，旧教材里讲的是它。',
  'Two different products limit rate. WAF drops abusive traffic at the edge, which is what a rate limiter in a diagram usually means; API Gateway usage plans throttle a known caller to a quota.':
    '限速其实由两个不同的产品做。WAF 在边缘丢掉恶意流量，设计图里画的限流器通常指这个；API Gateway 的使用计划则把已知的调用方限在一个配额里。',
  'Not a separate product. A replica is an RDS instance sized on its own, so the `db` sizes apply.':
    '这不是单独的产品。副本就是一台独立选型的 RDS 实例，所以沿用 `db` 的规格。',
  'AWS sells no sharding product for RDS. A shard is one more independent RDS instance and the application decides what goes where, which is the point worth teaching.':
    'AWS 不为 RDS 提供分片产品。一个分片就是多一台独立的 RDS 实例，数据放哪里由应用自己决定，这正是值得教的一点。',
  'Two options run at the edge. CloudFront Functions is the light one, for header and URL work at the point of presence; Lambda@Edge runs longer and costs more.':
    '有两个跑在边缘的选项。CloudFront Functions 更轻量，在边缘节点上做点请求头和 URL 的活；Lambda@Edge 跑得更久，也更贵。',
  'The file-based transcoder, which is the batch "convert this upload" job. MediaLive is the live-stream counterpart. Elastic Transcoder is the previous generation.':
    '这是处理文件的转码器，也就是“把这个上传转个格式”的批处理活。直播对应的伙伴产品是 MediaLive。Elastic Transcoder 是上一代产品。',

  /* ---------- Google ---------- */
  'The layer 7 flavour is the external Application Load Balancer. Google groups every load balancer under one product name and distinguishes them by type rather than selling them separately.':
    '第 7 层的版本是对外的 Application Load Balancer。Google 把所有负载均衡器归在同一个产品名下，用类型区分，而不是分开卖。',
  'A plain virtual machine, chosen here because the sizes are the thing a student is picking. Cloud Run is the same workload without the machine choice, and GKE is the same workload with a cluster around it.':
    '就是一台普通的虚拟机。选它是因为学生在这里挑的就是机器规格。Cloud Run 跑同样的活但不用选机器，GKE 跑同样的活但外面还套着一个集群。',
  'The managed relational database a student reaches for first. Spanner is the other choice and is a different lesson: it scales horizontally and costs accordingly, so it is not the default here.':
    '学生第一个会伸手去用的托管关系型数据库。另一个选择是 Spanner，但那是另一课：它横向扩展，价格也相应地高，所以这里不把它设为默认。',
  'Memorystore also comes in Valkey, Memcached and Redis Cluster flavours. Plain Redis is the one a student means by "add a cache".':
    'Memorystore 还有 Valkey、Memcached 和 Redis Cluster 几种版本。学生说“加个缓存”时指的就是原味 Redis。',
  'Cloud Tasks rather than Pub/Sub, because a queue in this sense has a named worker at the other end. Google draws the same line: with Cloud Tasks "a publisher specifies an endpoint where each message is to be delivered", while a Pub/Sub publisher needs to know nothing about its subscribers.':
    '选 Cloud Tasks 而不是 Pub/Sub，因为这里的队列另一头接着一个指名道姓的工作进程。Google 自己也这么划线：Cloud Tasks 是“发布者指定每个消息要送到哪个端点”，而 Pub/Sub 的发布者对订阅者一无所知。',
  'A job runs its work and exits, which is what a background worker does. Google contrasts it with a Cloud Run service, which "listens for and serves requests". Cloud Run worker pools fit a queue consumer even better, but they are still in preview, so the stable answer is the one named here.':
    '一个任务把活干完就退出，这正是后台工作进程的干法。Google 把它和“监听并响应请求”的 Cloud Run 服务相对照。Cloud Run worker pools 其实更适合队列消费者，但还处于预览阶段，所以这里写的是更稳的那个答案。',
  'Google has no managed Elasticsearch or OpenSearch of its own, which is the honest answer for a student who wants a search index you operate. Agent Search is the first-party product for searching your own data, and it is a retrieval service rather than an inverted index. Its own docs list six former names, including Vertex AI Search and Enterprise Search, so expect older material to call it something else.':
    'Google 没有自己的托管 Elasticsearch 或 OpenSearch，对一个想要自管搜索索引的学生来说，这就是最诚实的答案。Agent Search 是搜索自家数据的第一方产品，但它是检索服务，不是倒排索引。它自己的文档列过六个曾用名，包括 Vertex AI Search 和 Enterprise Search，所以旧教材里它可能叫别的名字。',
  'No dedicated time series database exists at Google. Bigtable is the usual home for the workload, and Google lists "time-series data, such as CPU and memory usage over time for multiple servers" among its uses, but it is a wide-column store rather than a time series product.':
    'Google 没有专门的时序数据库。这类负载通常安家在 Bigtable 上，Google 也把“时序数据，例如多台服务器随时间的 CPU 和内存占用”列在它的用途里，但它是宽列存储，不是时序产品。',
  'A feature of Spanner rather than a standalone graph database, and it needs the Enterprise or Enterprise Plus edition. Google has nothing that corresponds to a dedicated graph service.':
    '它是 Spanner 的一个功能，不是独立的图数据库，而且需要 Enterprise 或 Enterprise Plus 版本。Google 没有任何能对应独立图服务的东西。',
  'The dedicated vector index, renamed from Matching Engine and still carrying that name in some client library classes. If the vectors live beside relational data, pgvector on Cloud SQL or AlloyDB is the other route and avoids running a second system.':
    '这是专门的向量索引，从 Matching Engine 改名而来，一些客户端库的类名里还留着旧名。如果向量就存在关系数据旁边，Cloud SQL 或 AlloyDB 上的 pgvector 是另一条路，还省得再维护一套系统。',
  'Real Kafka, run by Google, for when the lesson is specifically Kafka. Pub/Sub covers the same shape of problem without the Kafka API.':
    '由 Google 运营的正牌 Kafka，专给课程真的在讲 Kafka 的场合。Pub/Sub 不用 Kafka API 也能覆盖同一类问题。',
  'Written without a "Cloud" prefix. Publishers "trigger subscriber execution just by publishing an event", which is the distinction from Cloud Tasks.':
    '名字里没有“Cloud”前缀。发布者“只需发布一个事件，就能触发订阅者执行”，这正是它和 Cloud Tasks 的分界。',
  'Google sells no dedicated WebSocket product the way a gateway with a WebSocket mode would be. Cloud Run supports them "with no additional configuration required", holding a stream open for as long as the request timeout, up to 60 minutes.':
    'Google 不卖那种自带 WebSocket 模式的网关类产品。Cloud Run “无需额外配置”就能支持 WebSocket，一条流可以握到请求超时为止，最长 60 分钟。',
  'The small, cheap one for putting an API in front of serverless backends. Apigee is the other product and is a full API management platform, which is a different scale of decision.':
    '它是那个小而便宜的选项，给无服务器后端在前面挂一个 API。另一个产品是 Apigee，一整套 API 管理平台，那是另一个量级的决定。',
  'Renamed from Cloud Functions. Google folded the functions product into Cloud Run, so the name a student sees today is this one.':
    '从 Cloud Functions 改名而来。Google 把函数产品并进了 Cloud Run，所以学生今天看到的名字是这个。',
  'Rate limiting is a policy on the load balancer edge rather than a component you place. Cloud Armor offers throttling to a configured threshold and rate-based bans.':
    '限流是负载均衡边缘上的一条策略，不是一个摆放出来的组件。Cloud Armor 提供按配置阈值限速和按速率封禁。',
  'Google recommends keeping direct read replicas to ten or fewer, and that is guidance rather than an enforced limit, so no number is stored here.':
    'Google 建议直接只读副本保持在 10 个以内，这是指导建议而不是强制上限，所以这里不存数字。',
  'The closest thing to sharding you do not operate yourself. Spanner splits data automatically rather than asking you to choose a shard key the way a sharded Cloud SQL fleet would.':
    '这是最接近“免自己运维的分片”的东西。Spanner 自动拆分数据，不像分片化的 Cloud SQL 集群那样要你自己挑分片键。',
  'Not a general edge runtime, so this is a partial match rather than an equivalent. Service Extensions run your own WebAssembly inside the load balancer, which suits rewriting a header and not hosting an application. The load balancer extensions are generally available; the Media CDN ones are still in preview.':
    '它不是通用的边缘运行时，所以只能算部分匹配，不是等价物。Service Extensions 在负载均衡器里跑你自己的 WebAssembly，适合改写请求头，不适合托管整个应用。负载均衡的扩展已正式可用；Media CDN 的还在预览。',

  /* ---------- Azure ---------- */
  'The client is a browser or a phone, which is not an Azure product at all. Front Door is the first Azure thing a request touches, so it stands in for the edge.':
    '客户端是浏览器或手机，根本不是 Azure 的产品。Front Door 是请求碰到的第一个 Azure 组件，所以它在这里代表边缘。',
  'Azure splits load balancing in two. Load Balancer works at the TCP and UDP level; Application Gateway reads HTTP and can route on the URL path. Balancing traffic across identical servers is the Load Balancer job.':
    'Azure 把负载均衡拆成两个。Load Balancer 工作在 TCP 和 UDP 层；Application Gateway 读 HTTP，还能按 URL 路径分流。把流量摊到一模一样的服务器上，是 Load Balancer 的活。',
  'Virtual Machines is the size-and-price story a student can reason about. App Service and Container Apps run the same code with the machine hidden, which deploys more easily but hides the capacity number.':
    'Virtual Machines 的规格和价格是学生能推理得动的部分。App Service 和 Container Apps 跑同样的代码但把机器藏了起来，部署更容易，却把容量数字也藏掉了。',
  'Azure Cache for Redis is the name in most tutorials, but Microsoft has set its retirement for 30 September 2028 and blocks new creation for existing customers from 1 October 2026. New work goes to Azure Managed Redis.':
    '大多数教程里写的名字是 Azure Cache for Redis，但 Microsoft 已定于 2028 年 9 月 30 日让它退役，并从 2026 年 10 月 1 日起不允许老客户新建。新项目请用 Azure Managed Redis。',
  'The managed relational database. Azure also sells Database for PostgreSQL and for MySQL, the same idea with a different engine. SQL Database is the one Azure documents most deeply and prices per vCore.':
    '这是托管关系型数据库。Azure 也卖 Database for PostgreSQL 和 for MySQL，同一个思路、不同引擎。SQL Database 是 Azure 文档写得最深、按 vCore 计价的那个。',
  'Azure has two queue products. Storage queues are simpler and hold more data; Service Bus queues add what a job queue actually needs, including dead-lettering. Microsoft points work-queue designs at Service Bus.':
    'Azure 有两个队列产品。存储队列更简单、装得更多；Service Bus 队列补上了任务队列真正需要的东西，包括死信（dead-lettering）。Microsoft 让工作队列的设计用 Service Bus。',
  'A worker pulls from a queue and scales with queue depth, which Container Apps jobs do natively. The same loop runs on a Virtual Machine, but then the scaling is yours to write.':
    '工作进程从队列取活、按队列深度伸缩，Container Apps 任务原生就会这一套。同样的循环也能跑在 Virtual Machine 上，但伸缩就得自己写了。',
  'Azure CDN Standard from Microsoft was folded into Front Door, so one product is both the global load balancer and the CDN.':
    'Microsoft 的 Azure CDN Standard 已并入 Front Door，所以一个产品既是全球负载均衡器又是 CDN。',
  'Blob Storage is one product with several access tiers. Hot is the tier for data read often, which is what object storage usually means. Cool, Cold and Archive are the same blobs priced for data read rarely.':
    'Blob Storage 是一个产品，带几档访问层级。Hot 是给常读数据用的那档，也就是“对象存储”通常的意思。Cool、Cold 和 Archive 是同一批 blob，按少读的价格卖。',
  'Formerly Azure Cognitive Search. Same service, renamed.':
    '原名 Azure Cognitive Search。同一个服务，改了个名。',
  'Azure Time Series Insights was retired and this is where its workload went. Data Explorer is built for timestamped append-heavy data and queries it with KQL.':
    'Azure Time Series Insights 已退役，它的活搬到了这里。Data Explorer 专为带时间戳、不停追加的数据而生，用 KQL 查询。',
  'Cosmos DB is one database with several APIs. Picking the Gremlin API at creation time is what makes an account a graph database.':
    'Cosmos DB 是一个数据库配好几种 API。创建时选了 Gremlin API，这个账户就成了图数据库。',
  'The same blobs as object storage, in the tier priced for data almost never read. Reading from Archive means rehydrating first, which takes hours, so it behaves like a different product.':
    '和对象存储是同一批 blob，只是选了给几乎不读的数据定价的那一档。从 Archive 读要先“解冻”，一解就是几个小时，所以用起来像另一个产品。',
  'Azure has no standalone vector database. Vector search is a feature added to existing products: AI Search indexes vectors alongside text, Cosmos DB stores them next to documents. AI Search is the one built for retrieval.':
    'Azure 没有独立的向量数据库。向量搜索是加在现有产品上的功能：AI Search 把向量和文本放一起建索引，Cosmos DB 把向量和文档存在一起。为检索而生的是 AI Search。',
  'The partitioned append-only log, the same shape as Kafka. Event Hubs speaks the Kafka protocol, so Kafka clients connect unchanged.':
    '分区、只追加的日志，形状和 Kafka 一样。Event Hubs 说 Kafka 协议，Kafka 客户端不用改就能连上。',
  'Fan-out to independent subscribers. Event Grid also fans out but is built for reacting to Azure resource events; topics are the general publish and subscribe primitive for your own messages.':
    '把消息扇出给相互独立的订阅者。Event Grid 也会扇出，但它专为响应 Azure 资源事件而生；topics 才是给自己的消息用的通用发布/订阅原语。',
  'Azure has two. SignalR Service carries the SignalR protocol and its client libraries; Web PubSub is plain WebSocket with no framework attached.':
    'Azure 有两个。SignalR Service 走 SignalR 协议、配自家客户端库；Web PubSub 是不加任何框架的纯 WebSocket。',
  'Azure has no separate scheduler product. A scheduled job is an ordinary Function with a timer trigger and a cron expression.':
    'Azure 没有单独的定时调度产品。一个定时任务就是普通 Function 加计时器触发器和一个 cron 表达式。',
  'Not a product you buy. Rate limiting is a policy attached to an API Management API, or a rule in Front Door WAF to do it at the edge instead.':
    '这不是一个买来的产品。限流是挂在 API Management API 上的一条策略，或者改在边缘做，写成 Front Door WAF 里的一条规则。',
  'Which feature depends on the goal: active geo-replication for a readable copy in another region, or the read scale-out replica included in Business Critical and Hyperscale for spreading read load.':
    '用哪个功能看目标：想在另一个区域留一个可读副本，用活动异地复制（active geo-replication）；想把读取负载摊开，用 Business Critical 和 Hyperscale 自带的读取横向扩展副本。',
  'Azure has no sharding product. Cosmos DB shards for you once you pick a partition key. For Azure SQL Database, sharding is something you build, with Elastic Database tools as a helper library.':
    'Azure 没有分片产品。Cosmos DB 在你选定分区键后就替你分片。Azure SQL Database 的分片则要自己搭，Elastic Database 工具是个辅助库。',
  'Azure has no real equivalent of Cloudflare Workers. The rules engine rewrites and routes at the point of presence but does not run arbitrary code. IoT Edge is unrelated: it runs containers on hardware you own.':
    'Azure 没有真正对得上的 Cloudflare Workers。规则引擎能在边缘节点改写和路由，但不跑任意代码。IoT Edge 与此无关：它是在你自己的硬件上跑容器。',
};
