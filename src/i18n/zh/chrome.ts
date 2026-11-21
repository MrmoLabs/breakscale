/**
 * Chinese interface copy.
 *
 * Keys are the exact English source strings that appear in the components,
 * so a translation and the string it renders for can never drift apart, and
 * `src/i18n/parity.test.ts` can scan the source tree for `t('...')` literals
 * and fail when one has no entry here.
 *
 * The same copy rules apply as in English (AGENTS.md, "Copy"): plain
 * language for a reader who has never taken a queueing course, and no em
 * dashes, which the dashes test also enforces on this file. Chinese uses
 * full-width punctuation throughout.
 *
 * Terminology: a technical term is translated once and keeps its English
 * name in parentheses the first time it matters (熔断器（circuit breaker）),
 * because a student will meet the English word in real dashboards, in
 * posts, and in this tool's own metrics.
 */

export const zhChrome = {
  // Settings dialog
  Settings: '设置',
  Appearance: '外观',
  Theme: '主题',
  Light: '浅色',
  Dark: '深色',
  System: '跟随系统',
  dark: '深色',
  light: '浅色',
  'Following your device, which is currently {theme}.': '跟随设备，当前为{theme}。',
  'Kept across visits, whatever your device is set to.':
    '在多次访问之间保留，不受设备当前设置影响。',

  'Your design': '你的设计',
  'Share a link': '分享链接',
  'Encrypted in your browser first, so the store cannot read it. Nobody needs an account.':
    '先在浏览器里加密，存储服务器也读不到内容，而且不需要注册任何账号。',
  'Save to a file': '保存到文件',
  'Downloads the whole design, notes and all.': '下载完整的设计，注释也一并带上。',
  'Save as a picture': '保存为图片',
  'A PNG of the whole diagram, for a slide or a report.':
    '整张图的 PNG，适合放进幻灯片或报告。',
  'Save as an SVG': '保存为 SVG',
  'Stays sharp at any size, and the text is still text.':
    '任意缩放都清晰，文字仍是可选中的文本。',
  'Open a file': '打开文件',
  'A design you saved from Breakscale.': '你在 Breakscale 保存过的设计文件。',
  'Or drop one straight onto the canvas.': '也可以直接把文件拖到画布上。',

  'This browser': '此浏览器',
  'Download everything': '导出全部数据',
  'One file with every saved design, your settings and the canvas you have open. This is how you move to another browser or machine.':
    '一个文件包含全部已保存的设计、你的设置和当前打开的画布。换浏览器或换电脑时用它。',
  'Restore from a file': '从文件恢复',
  'Replaces what this browser holds with the contents of a downloaded file.':
    '用导出文件的内容替换此浏览器里的全部数据。',

  Naming: '命名',
  'Component names': '组件名称',
  Generic: '通用',
  'Components keep their plain names. Learn the idea first; the product names are easier afterwards.':
    '组件保留通用名称。先记住概念，之后再认产品名会容易得多。',
  'Components are named after this vendor’s products, and you can pick a real instance size. The published specs are cited; how they map to capacity is our own estimate.':
    '组件按该云厂商的产品命名，还能选择真实的实例规格。公开规格都有出处；规格如何折算成容量是我们的估算。',

  Canvas: '画布',
  'Explain metric names': '解释指标名称',
  'Tap a term like p99 to see what it means.': '点按 p99 这类术语，查看它的含义。',
  'Show what terms like p99 mean on hover.':
    '悬停在 p99 这类术语上，即可看到它的含义。',
  'Trend lines on components': '组件趋势线',
  'Draw the recent history of each component on its box.':
    '在组件方框上画出它最近的变化趋势。',
  'Snap to the grid': '对齐网格',
  'Keep components aligned while dragging.': '拖动时让组件保持对齐。',
  'Keep components aligned while dragging. G toggles it, and holding Ctrl bypasses it for one drag.':
    '拖动时让组件保持对齐。按 G 可开关；按住 Ctrl 可让单次拖动不受影响。',
  Minimap: '小地图',
  'A small map of the whole diagram, for finding your way around a big one.':
    '整张图的缩略地图，图很大时用来定位。',
  'Show requests moving along connections': '显示连接上移动的请求',
  'Busier connections carry more dots. The colours show whether calls got through, failed, were lost or were turned away, and a ring marks a call tried again.':
    '越繁忙的连接上的点越多。颜色表示调用是成功、失败、丢失还是被拒绝，圆圈标记的是一次重试。',

  // Language section
  Language: '语言',
  'Interface language': '界面语言',
  'Simplified Chinese': '简体中文',
  English: 'English',
  'Following your browser, which is set to Chinese.': '跟随浏览器，当前为中文。',
  'Following your browser, which is set to English.': '跟随浏览器，当前为英文。',
  'Kept across visits, whatever your browser is set to.':
    '在多次访问之间保留，不受浏览器语言影响。',

  // Close button
  Close: '关闭',
  'Close (Esc)': '关闭（Esc）',
};
