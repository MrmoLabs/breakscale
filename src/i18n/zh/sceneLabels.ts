/**
 * Chinese node labels for the incident scenes (the 6 `scene: Topology`
 * objects in src/sim/incidents.ts). Keys are the exact English strings;
 * read through displayLabel() at the canvas, and through nameOf() when a
 * brief's sentence names the node a fault hits.
 *
 * Product names (S3, Memcached, Redis) pass through untranslated, so they
 * have no entries here. A label a reader retypes in Chinese has no entry
 * either and renders as typed, which is correct for user content. The
 * incident scenes carry no notes or sections today, so zhSceneNotes is
 * empty; both files stay merged into display.ts either way.
 */

export const zhSceneLabels: Record<string, string> = {
  // S3, 28 February 2017
  'Apps using S3': '使用 S3 的应用',
  'Status page updates': '状态页更新',
  'App servers': '应用服务器',
  'Status console': '状态控制台',
  'S3, one region': 'S3（单个区域）',

  // Cloudflare, 2 July 2019
  'Visitors to sites': '站点访客',
  'Dashboard and API users': '仪表盘和 API 用户',
  'Traffic router': '流量路由器',
  'Edge servers': '边缘服务器',
  Origins: '源站',

  // AWS, 7 December 2021
  Clients: '客户端',
  'Services making calls': '发起调用的服务',
  'Network devices': '网络设备',

  // Coinbase, 7 May 2026
  'Matching engine': '撮合引擎',
  Traders: '交易者',
  'Exchange API': '交易所 API',

  // Discord, 6 November 2023
  'Sign-ins': '登录',
  'Typing events': '输入状态事件',
  'Auth service': '认证服务',
  'Session store': '会话存储',

  // Coinbase, 29 January 2021
  'Price readers': '行情读取者',
  'Price lookup': '行情查询',
};
