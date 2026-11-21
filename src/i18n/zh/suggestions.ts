/**
 * Chinese copy for the seven inspector suggestions, keyed by NodeKind.
 *
 * One paragraph per kind that has a throughput ceiling; the six kinds that
 * share the same generic advice (service, objectstore, coldstorage,
 * retryqueue, transcoder, edgecompute) all read the `generic` entry. Keys are
 * the English kinds, which stay the engine's vocabulary; only what renders in
 * the suggestion line goes through suggestionFor().
 *
 * The two traps the English copy deliberately avoids stay avoided here: a
 * saturated cache is not told to raise its hit rate, and a slow database is
 * not told to get bigger.
 */

export const zhSuggestions: Record<string, string> = {
  cache:
    '加实例，或者增加每个实例的槽位数。提高命中率在这里帮不上忙，因为命中和未命中占用槽位的时间一样长。命中率改变的是这个缓存往下游转发什么，而不是它要扛住什么。',
  db: '数据库变大并不会变快。看看到达它这里的到底是什么。在它前面放一个命中率更高的缓存，或者减少层层叠加的重试，都比给这个节点扩容更有用。',
  lb: '负载均衡器达到饱和并不常见。在给它加容量之前，先确认它背后的组件不是真正的极限。',
  sidecar:
    '每一跳都要向这个代理交一次税。加容量之前先检查重试和超时；这里的重试风暴造成的开销比基础负载还大。',
  apigateway: '这是一个无状态的前门，加实例就能把负载摊到更多实例上。',
  worker: '工作进程按自己的节奏消化队列。加实例能让队列消化得更快。',
  generic: '加实例以获得更多并行槽位，或者如果活本身能做得更快，就降低服务时间。',
};
