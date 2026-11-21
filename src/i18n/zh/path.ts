/**
 * Chinese copy for the learning path's 9 tracks: the title, the one-line
 * "about", and what each step teaches. Keys are the track ids from
 * src/content/learningPath.ts, which stay English on the wire; only what
 * LearningPath renders goes through pathTrackCopy().
 *
 * `learn` holds one line per step, by index; step ids and kinds stay on the
 * original objects, because progress, names and opening actions all read
 * them. A missing line falls back to the English original.
 */

export interface PathTrackCopyZh {
  readonly title: string;
  readonly about: string;
  /** What the student will learn, one line per step, by index. */
  readonly learn: readonly string[];
}

export const zhPath: Record<string, PathTrackCopyZh> = {
  bottlenecks: {
    title: '最初的瓶颈',
    about: '系统的速度，取决于最先被占满的那一环。',
    learn: [
      '找到那一个最先被占满的环节。',
      '看看为什么共享同一个数据库时，加服务器不管用。',
      '找到请求排队的那条队伍，在那里腾出空间。',
      '揪出一个明明满了、看起来却半闲着的环节。',
    ],
  },
  caching: {
    title: '缓存',
    about: '在请求到达慢环节之前，就把大部分请求答掉。',
    learn: [
      '看看数据库承受的，其实只有缓存没接住的读取。',
      '看看边缘缓存替你挡下了多少流量。',
      '按缓存打不中的量给数据库选型，而不是按全部负载。',
      '别让一个变慢的依赖拖慢每一个请求。',
    ],
  },
  async: {
    title: '队列与异步',
    about: '现在先说“收到了”，活儿之后再干。',
    learn: [
      '观察工作进程跟不上时，积压怎样增长。',
      '弄懂为什么队列只能争取时间，以及真正补上缺口的是什么。',
      '在同一个系统上读懂消费者滞后、扇出和冷启动。',
      '观察消息排队等一等，而不是直接失败。',
    ],
  },
  'saying-no': {
    title: '过载时学会说不',
    about: '早点把一部分活拒之门外，反而能服务更多人。',
    learn: [
      '看看重试怎样把引发它的过载翻上几倍。',
      '让系统在一段短暂变慢结束后恢复过来。',
      '看看在门口设限，怎么让应答保持快速。',
      '当场拒绝一部分人，反而服务了更多人。',
    ],
  },
  failures: {
    title: '在故障中活下来',
    about: '机器和整个区域都会挂。为那一天做好准备。',
    learn: [
      '观察熔断器停止调用一个正在失败的依赖。',
      '把槽位摊到多台机器上，让一台崩溃不至于变成一次事故。',
      '量一量切到备用区域的真正代价。',
      '为用到它的那一天，给备用区域选好规格。',
      '选择让哪些活失败，失败的活又去哪里。',
      '找出那些消失时错误率却依旧干净的保存。',
    ],
  },
  data: {
    title: '数据上规模',
    about: '一台数据库不够用的时候，该怎么办。',
    learn: [
      '看看副本给读取腾出空间，对写入却无能为力。',
      '修好一波加副本也扛不住的写入洪峰。',
      '观察一个热门键怎样压垮单个分片。',
      '给热点分片降温，别被平静的平均值骗了。',
      '看看每种存储各干各的活时，哪一个先满。',
    ],
  },
  verification: {
    title: '检查正确性',
    about: '又快又活着还不够。查一查数据到底怎么样了。',
    learn: [
      '运行“你能把它弄坏吗？”，看它揪出一笔重复扣款。',
      '看看为什么超时后的一次重试，能把一张卡扣两次。',
      '当丢失的只是应答时，让重试变得安全。',
      '抓住那个被网络投递了两次的请求。',
      '当存储抢在磁盘之前应答时，看看“已保存”到底是什么意思。',
      '让用户从有延迟的副本上也能读到自己刚写的内容。',
    ],
  },
  'real-systems': {
    title: '真实系统',
    about: '把学到的东西合在一起，然后拆解你听说过的那些系统。',
    learn: [
      '看看为什么新服务器总是在需要之后才到。',
      '找出每一层同时运转时最先坏掉的那一环。',
      '同时修好一条变慢的路径和一处无声的积压。',
      '看看先耗尽的不是请求，而是连接。',
      '观察一条流悄悄掉队，用户连一个报错都看不到。',
      '看看为什么流媒体几乎不碰云，而真正会坏的又是什么。',
      '观察一个批处理任务怎样让最慢的请求起起伏伏。',
      '看一条名人推文怎样变成写入的洪水。',
      '看看支付系统为什么宁可拒活，也不重复扣款。',
    ],
  },
  outages: {
    title: '真实事故',
    about: '六次真实事故，缩小复刻。先看每一次怎么发生，再把它修好。',
    learn: [
      '看看一个状态页跟着它所报告的东西一起挂掉。',
      '把变更分阶段上线，让一个坏变更只伤到一部分。',
      '看看从不退避的重试怎样让一个网络一直趴着。',
      '看看按缓存打不中的量选型的数据库，在缓存清空时表现如何。',
      '地方不够时，选择把空间让给哪些活。',
      '在没人按按钮的情况下，让故障转移照样发生。',
    ],
  },
};
