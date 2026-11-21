/**
 * Chinese text for the 6 incidents in INCIDENTS (src/sim/incidents.ts),
 * keyed by incident id. Read through src/i18n/content/incidents.ts at
 * render time; the English data is never rewritten.
 *
 * The story, the tagline and the source title say only what the published
 * postmortem says, translated faithfully and in order; the date and the
 * source URL are facts that pass through in every locale. `simNote` keeps
 * its job in Chinese too: saying how this compressed model differs from the
 * real event, so the replay never reads as the record. Captions pair with
 * the originals by index, so the times stay on the fault schedule.
 */

export interface ZhIncident {
  name: string;
  tagline: string;
  sourceTitle: string;
  story: string[];
  simNote: string;
  /** One per original caption, by index. */
  captions: string[];
}

export const zhIncidents: Record<string, ZhIncident> = {
  'incident-s3-2017': {
    name: 'S3 在一个区域宕机',
    tagline: '一条敲错的命令让存储离线',
    sourceTitle: '亚马逊 S3 北弗吉尼亚（US-EAST-1）区域服务中断总结',
    story: [
      '一名工程师按标准操作手册执行了一条命令，想移除几台供 S3 计费流程使用的服务器。',
      '有一个参数敲错了，被移除的服务器远超预期，其中包括 S3 两个核心系统依赖的服务器。',
      '这两个系统都必须完整重启，在重启完成之前，该区域的 S3 无法响应请求。',
      '重启耗时超出预期，部分原因是这些系统在较大的区域里已经多年没有完整重启过。',
      '构建在 S3 上的服务也纷纷失败，而 AWS 连自己的状态页都没法更新，因为它的控制台依赖 S3。',
      'AWS 修改了那个工具，让移除容量的过程更慢、且永远不会低于安全下限，并把状态控制台改为跨多个区域运行。',
    ],
    simNote: '真实的故障持续了数小时。这里 S3 从第 20 秒宕机到第 50 秒。',
    captions: [
      '平常的一天。应用和状态控制台都把数据放在 S3。',
      '敲错的命令移除了 S3 需要的服务器，S3 停止应答。',
      '把数据放在这里的所有东西都失败了，状态页也在内。',
      'S3 回来了。在真实的故障里，重启花了几个小时。',
    ],
  },

  'incident-cloudflare-2019': {
    name: '一条防火墙规则放倒了整个边缘',
    tagline: '一条坏规则几秒内到达每台服务器',
    sourceTitle: 'Cloudflare 2019 年 7 月 2 日故障详情',
    story: [
      'Cloudflare 上线了一条新的防火墙规则，所用模式本应只观察流量，但这条规则仍然在每个请求上运行。',
      '它的正则表达式（regular expression）会大量回溯，几秒之内就把全球每一个服务网页流量的核心上的处理器耗尽了。',
      '访问每个 Cloudflare 站点的访客都收到 502 错误，客户也连不上仪表盘和 API，因为它们同样要经过边缘。',
      '工程师把防火墙在全球关闭，两分钟后流量恢复正常，此时距离故障开始已过去 27 分钟。',
      'Cloudflare 恢复了在一次重构中被误删的处理器保护，并把规则改为分阶段上线。',
    ],
    simNote:
      '真实的故障持续了 27 分钟。这里规则从第 20 秒运行到第 45 秒，它把每个请求拖慢多少倍，是为这个模型挑的一个数字。',
    captions: [
      '平常的一天。每一个请求，包括仪表盘的，都要经过边缘服务器。',
      '新规则同时到达每台边缘服务器。在这个模型里，每个请求现在要花 50 倍的时间。',
      '边缘服务器满了。访客和仪表盘用户全都收到错误。',
      '防火墙在全球关闭。边缘开始消化排起来的队伍。',
      '恢复正常。',
    ],
  },

  'incident-aws-2021': {
    name: '重试让网络趴着起不来',
    tagline: '没有退避的客户端',
    sourceTitle: 'AWS 北弗吉尼亚（US-EAST-1）区域服务事件总结',
    story: [
      '一个自动扩容任务在 AWS 内部网络里触发了一波连接潮。',
      '连接 AWS 内部网络与主网络的设备被淹没了，经过它们的调用纷纷变慢、失败。',
      '客户端的回应是更多的连接尝试和重试，这让设备拥堵了几个小时。',
      '一个潜伏的缺陷让这些客户端没有按设计退避（back off）。',
      'AWS 关掉了扩容任务，并承诺修好这些客户端，让它们正确退避。',
    ],
    simNote:
      '真实事件里的触发因素是一波连接活动。这里则是设备从第 15 秒到第 20 秒减速到一半，数字是这个模型的。',
    captions: [
      '平常的一天。服务经由网络设备发起调用，一个调用超过 250ms 就再试两次。',
      '一波冲击把设备拖到一半速度。调用开始超时，每个都被重试。',
      '设备恢复全速了，但每个调用现在到三次。',
      '还是趴着。触发因素没了，光靠重试就把设备填满了。',
    ],
  },

  'incident-coinbase-2026': {
    name: '一家交易所失去了它唯一的可用区',
    tagline: '没有自动故障转移的办法',
    sourceTitle: '我们 2026 年 5 月 7 日故障的复盘',
    story: [
      'AWS 同一个数据大厅里的几台冷却机组同时故障，那里的服务器为自保而关机。',
      'Coinbase 的撮合引擎是一个五节点集群，刻意全部放在那个可用区里，因为它的节点承受不起跨可用区通信的延迟。',
      '几乎所有交易停止了。接着五个节点里坏了三个，集群失去了法定人数（quorum），剩下的两个无法继续。',
      '没有自动转移到另一个可用区的办法，重启还需要一次紧急代码修改，因为引擎在启动时默认能找到全部五个节点。',
      '市场分阶段重开，先只允许撤单，凌晨 3:49 全面恢复交易。',
      'Coinbase 正在改进其他可用区的热备用（warm standby），并将按固定节奏在生产环境里进行故障转移演练。',
    ],
    simNote:
      '在这里，五个节点画成一台机器，失去法定人数表现为它在第 20 秒停止。真实事件里交易从晚上 7:48 停到凌晨 3:49。另一个阻塞行情的 Kafka 问题没有包括在内。',
    captions: [
      '平常的一天。每个订单都去往一个可用区里的一台撮合引擎。',
      '大楼失去制冷，引擎停了。',
      '每个订单都失败。没有任何东西把它们送往别处。',
      '模型让引擎回来了。真实的故障里用了几个小时。',
    ],
  },

  'incident-discord-2023': {
    name: '输入状态挤掉了登录',
    tagline: '空间太少，而没有任何东西决定谁得到它',
    sourceTitle: '25%，还是 6 比 4：11/6/23 认证服务故障',
    story: [
      'Discord 把用户会话（session）信息放在一个数据库集群里，用来给人登录。',
      '一次例行升级期间，集群的一个区域被摘下线，而另一个区域里的一个节点硬盘正在损坏。',
      '集群太小，撑不住。Discord 的可用率跌到约 25%，人们登录不上、连不上，也发不出消息。',
      '失败的登录被重试，重试又给集群压上了更多负载。',
      '第 13 分钟，工程师关掉输入状态事件和已读标记来给集群减负，大约一半用户得以回来。',
      '集群在上午 11:43 恢复，距离开始约 50 分钟。随后 Discord 把集群扩了一倍，并用新硬盘重建了那个坏盘节点。',
    ],
    simNote:
      '真实的故障持续了约 50 分钟。这里存储的三个节点之一从第 20 秒趴到第 45 秒，正在损坏的硬盘没有包括在内。',
    captions: [
      '平常的一天。登录和输入状态事件都经过认证服务去往会话存储。',
      '存储的三个节点之一离线。剩下的两个不够用。',
      '登录和输入状态事件的失败率差不多。没有任何东西决定哪个更要紧。',
      '节点回来了，存储开始消化排起的队伍。',
    ],
  },

  'incident-coinbase-2021': {
    name: '缓存重启淹没了它的数据库',
    tagline: '按未命中配的规模，不是按全部',
    sourceTitle: '事故复盘：2021 年 1 月 29 日',
    story: [
      'Coinbase 把货币换汇用的汇率放在 Redis 里，并通过 Memcached 读取。',
      '一台 Memcached 节点重启，一时间大量读取未命中缓存，直接落到 Redis。',
      '服务它们需要的 Redis 连接数约是原来的 50 倍。Redis 的 CPU 打满，无法在 1 秒超时内应答，约 90% 的行情数据请求失败。',
      '超时让 Memcached 一直无法回填，Redis 上的负载始终没有松口气。大约五个小时里，应用里的买入、卖出和交易时好时坏。',
      'Coinbase 起了一个大得多的新 Redis 集群，并把一次全新部署指向了它。',
      '复盘写道，旧集群配置不足，也没有使用只读副本，Coinbase 正考虑更广泛地从副本读取。',
    ],
    simNote:
      '真实的故障持续了约五个小时，因为缓存无法回填。这个模型的缓存不会变冷，所以这里 Memcached 从第 20 秒到第 30 秒够不着，它一回来一切就恢复。行情查询只有在 Memcached 够不着时才使用它通向 Redis 的那条线。',
    captions: [
      '平常的一天。读取都去 Memcached，只有它没接住的少数几个才到 Redis。',
      '一台 Memcached 节点重启。现在每个读取都落到 Redis。',
      'Redis 跟不上了。读取在应用服务器上越堆越多，应用服务器开始拒掉新来的。',
      '这里 Memcached 回来了，Redis 开始消化队伍。在真实的故障里缓存无法回填，故障持续了几个小时。',
    ],
  },
};
