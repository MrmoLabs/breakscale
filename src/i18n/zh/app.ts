/**
 * Chinese interface copy for the app shell: menus, toasts, command palette,
 * context menus, history labels. Same contract as chrome.ts. */

export const zhApp: Record<string, string> = {
  // The wordmark stays Breakscale; the tagline around it is translated.
  'Build it, load it, watch it break': '搭建它，加载流量，看它垮掉',
  'Skip to diagram': '跳到画布',

  // Top bar: saved indicator, undo/redo, share, the menu button.
  'Your work is saved in this browser': '你的工作已保存在此浏览器中',
  'Saving your work': '正在保存你的工作',
  Saved: '已保存',
  Saving: '保存中',
  Undo: '撤销',
  Redo: '重做',
  'Undo ({key})': '撤销（{key}）',
  'Redo ({key})': '重做（{key}）',
  'Source on GitHub': 'GitHub 源码',
  'Source on GitHub, {stars} stars': 'GitHub 源码，{stars} 颗星',
  'Can you break it?': '你能把它弄坏吗？',
  'Break it': '弄坏它',
  'Throw faults at this design until it fails (F)':
    '给这个设计注入故障，直到它撑不住为止（F）',
  'Get a link to this design': '获取这个设计的链接',
  Share: '分享',
  Menu: '菜单',
  'Examples, settings and help': '示例、设置和帮助',

  // Panel toggles and resizers.
  'Hide components': '隐藏组件',
  'Show components': '显示组件',
  'Hide components (C)': '隐藏组件（C）',
  'Show components (C)': '显示组件（C）',
  'Hide inspector': '隐藏检查器',
  'Show inspector': '显示检查器',
  'Hide inspector (I)': '隐藏检查器（I）',
  'Show inspector (I)': '显示检查器（I）',
  'Hide charts': '隐藏图表',
  'Show charts': '显示图表',
  'Hide charts (M)': '隐藏图表（M）',
  'Show charts (M)': '显示图表（M）',
  'Resize the charts strip': '调整图表条的高度',
  'Resize the components rail': '调整组件栏的宽度',
  'Resize the inspector': '调整检查器的宽度',
  'Close panel': '关闭面板',
  Panels: '面板',
  Build: '搭建',
  Inspect: '检查',
  Charts: '图表',
  'Tap a part on the canvas to see its settings and break it.':
    '点按画布上的组件，即可查看它的设置并把它弄坏。',

  // The main menu.
  'Learning path': '学习路径',
  'Your designs': '你的设计',
  Challenges: '挑战',
  Examples: '示例',
  Glossary: '术语表',
  'Keyboard shortcuts': '键盘快捷键',
  'Search actions': '搜索操作',

  // Boot and workspace toasts.
  'Picked up where you left off. Your design is set aside until you leave.':
    '已从上次中断的地方继续。你的设计已收起，离开挑战后恢复。',
  'Your design is set aside. It comes back when you leave.':
    '你的设计已收起，离开挑战后会自动恢复。',
  'Picked up where you left off.': '已从上次中断的地方继续。',
  'Back to your design.': '已回到你的设计。',
  'Back to your design, without the faults.': '已回到你的设计，故障已撤掉。',
  'Opened a replay. It plays from the start, and each fault lands at the same moment it did in the original run.':
    '已打开回放。它会从头播放，每个故障都会在原始运行中出现的时刻落下。',
  'Opened a shared design': '已打开分享的设计',

  // Undo / redo toasts. Entry labels are the short phrases below.
  'Undid {label}': '已撤销：{label}',
  'Redid {label}': '已重做：{label}',
  add: '添加',
  'add note': '添加便签',
  'add section': '添加分区',
  delete: '删除',
  'note edit': '编辑便签',
  'label edit': '编辑标签',
  'note size': '便签字号',
  'note style': '便签样式',
  'section shade': '分区底色',
  connection: '添加连接',
  duplicate: '创建副本',
  paste: '粘贴',
  'setting change': '修改设置',
  rename: '重命名',
  move: '移动',
  resize: '调整大小',
  'packet loss': '设置丢包',
  'leave challenge': '退出挑战',
  'open design': '打开设计',
  'example load': '打开示例',
  'challenge start': '开始挑战',
  'start over': '重新开始',
  'watch run': '查看运行',
  'watch break': '查看破坏过程',
  replay: '回放',
  incident: '打开事故',
  'incident replay': '重放事故',
  'file import': '导入文件',

  // Delete, copy, paste and add toasts.
  'Deleted {name}': '已删除 {name}',
  'Deleted {n} components': '已删除 {n} 个组件',
  '{n} components': '{n} 个组件',
  'Copied {what}. Press and hold the canvas to paste.':
    '已复制 {what}。长按画布即可粘贴。',
  'Copied {what}. {key} pastes at the pointer.':
    '已复制 {what}。按 {key} 可粘贴到指针处。',
  'Nothing to paste yet. Copy a component first.':
    '还没有可以粘贴的内容，请先复制一个组件。',
  'Pick a component and it lands here.': '选一个组件，它会落在这里。',

  // Saved designs, backups and file imports.
  'That design is no longer saved.': '这个设计已经不在保存列表里了。',
  'Opened {name}': '已打开 {name}',
  'Opened design': '已打开设计',
  'Opened {name} in place of your design. Undo brings yours back.':
    '已打开 {name}，替换了你原来的设计，撤销即可找回。',
  '{opened} in place of your design. Undo brings yours back.':
    '{opened}，替换了你原来的设计，撤销即可找回。',
  'Opened {name}. Undo brings your design back.':
    '已打开 {name}，撤销即可找回你的设计。',
  'Downloaded everything': '已导出全部数据',
  'That file could not be read. Choose a backup file saved from Breakscale (.json).':
    '无法读取该文件。请选择从 Breakscale 导出的备份文件（.json）。',
  'Restoring replaces every saved design and setting in this browser with the ones in the file. Continue?':
    '恢复会用文件里的内容替换此浏览器中保存的全部设计和设置。要继续吗？',
  'Restored. Reloading...': '已恢复，正在重新加载……',
  'Saved {name}': '已保存 {name}',
  'Saved {name}. Removed the oldest, {evicted}.':
    '已保存 {name}，并移除了最早的 {evicted}。',

  // Space, the rail and the picture export.
  'Hid components to fit the diagram. Press C to show them.':
    '为了让整张图放进画布，已收起组件栏。按 C 重新显示。',
  'Hid components to fit the diagram. The button at the top left shows them.':
    '为了让整张图放进画布，已收起组件栏。点左上角的按钮重新显示。',
  'There is nothing on the canvas to export yet.': '画布上还没有可以导出的内容。',
  'The picture could not be saved. Try again, or save the design to a file.':
    '图片保存失败，请重试，或改用文件保存设计。',

  // Share and challenge links.
  'Could not copy the link. It is in the address bar.':
    '无法复制链接，链接就在地址栏里。',
  'Copied a link to this challenge.': '已复制这个挑战的链接。',
  'Could not build the link.': '无法生成链接。',
  'This {kind} is too big for a link ({chars} characters; links stop working past {limit}). Save it to a file instead.':
    '这个{kind}太大，放不进链接（共 {chars} 个字符；超过 {limit} 个字符链接就会失效）。请改用文件保存。',
  run: '运行',
  design: '设计',
  'Next: {name}': '下一步：{name}',
  'Next challenge: {name}': '下一个挑战：{name}',

  // Presenting mode.
  'Pick a part first. Click one or Tab to it.':
    '请先选中一个组件：点按它，或按 Tab 移到它上面。',
  '{name} is already crashed. R fixes it.': '{name} 已经是崩溃状态，按 R 修复。',
  '{name} does no work of its own to slow down.':
    '{name} 本身不做处理，放慢它没有效果。',
  'Fix {name} first. R fixes it.': '请先修复 {name}，按 R 即可修复。',
  '{name} has nothing to fix.': '{name} 没有正在发生的故障。',
  'Can you break it? is off during a challenge.':
    '挑战进行期间，“你能把它弄坏吗？”不可用。',

  // "Can you break it?" prerequisites and the replay watch line.
  'Add a client first, so there is traffic to break.':
    '请先添加一个客户端，这样才有流量可以破坏。',
  'Add something behind the client to break.':
    '请在客户端后面接一些组件，这样才有东西可以破坏。',
  'the connection from {from} to {to}': '{from} 到 {to} 的连接',
  'Charged twice: request {rid}': '重复计费：请求 {rid}',
  'request {rid} was charged a second time': '请求 {rid} 被再次计费',
  'Lost after saved: request {rid}': '保存后丢失：请求 {rid}',
  'request {rid} was lost after it was saved': '请求 {rid} 在保存后丢失',
  'Stale read: request {rid}': '读到了旧值：请求 {rid}',
  'request {rid} read the value from before its own write':
    '请求 {rid} 读到的是自己写入之前的值',
  'Watch {where} at {at}.': '请留意 {at} 时的 {where}。',
  '{at}: {text}': '{at}：{text}',
  'At {at}, {past}, at {where}. The search counted {count} in the window.':
    '{at} 时，{past}，位置在 {where}。搜索在窗口内数到 {count} 次。',
  'Measuring starts at {at}.': '测量从 {at} 开始。',
  'nothing got through': '没有任何请求走完全程',
  'requests piled up faster than they finished ({kept} got an answer), which counts as broken':
    '请求堆积的速度超过了完成的速度（只有 {kept} 得到响应），判定为已被压垮',
  'nothing has settled': '系统尚未稳定下来',
  '{pct} failed': '{pct} 失败',
  'the slowest took {ms}': '最慢的请求耗时{ms}',
  'nothing yet': '尚无数据',
  '{n} lost': '丢失 {n} 个',
  'Between {from} and {to}, {figure}.': '在 {from} 到 {to} 之间，{figure}。',
  'In the window so far, {figure}.': '到目前为止的窗口内，{figure}。',

  // Command palette chrome.
  'Type an action, a part or an example': '输入操作、组件或示例的名称',
  Actions: '操作',
  'Nothing matches that. Try fewer letters.': '没有匹配的结果，试试更少的字母。',
  'No matches': '无匹配',
  '1 match': '1 个匹配',
  '{n} matches': '{n} 个匹配',

  // Command palette rows (appCommands.ts).
  Pause: '暂停',
  Play: '播放',
  Step: '单步',
  Reset: '重置',
  Space: '空格',
  'Step one tick': '前进一个时间步',
  'Reset the run': '重置运行',
  'Play at {speed}': '以 {speed} 播放',
  Now: '当前',
  'Pin this run': '固定这次运行',
  'Pin this run again': '再次固定这次运行',
  'Clear the pinned run': '清除固定的运行',
  'Nothing measured yet. Let some traffic run.':
    '还没有任何测量数据，先让流量跑一会儿。',
  'Crash {name}': '使 {name} 崩溃',
  'Slow down {name} {factor}': '将 {name} 放慢 {factor}',
  'Fix {name}': '修复 {name}',
  'Stop presenting': '停止演示',
  'Start presenting': '开始演示',
  'Leave full screen': '退出全屏',
  'Full screen': '全屏',
  'Fit the diagram': '适应整张图',
  'The diagram is empty.': '图上还没有内容。',
  'Hidden while presenting.': '演示模式期间不可用。',
  'Turn grid snap off': '关闭网格对齐',
  'Turn grid snap on': '开启网格对齐',
  'Use the light theme': '使用浅色主题',
  'Use the dark theme': '使用深色主题',
  'Match the system theme': '跟随系统主题',
  'Share a link to this design': '分享这个设计的链接',
  'Off during a challenge.': '挑战期间不可用。',
  'Browse examples': '浏览示例',
  'Browse challenges': '浏览挑战',
  'Open the glossary': '打开术语表',
  'Add {name}': '添加 {name}',
  'Leave the challenge first.': '请先退出挑战。',

  // Command palette group names, rendered beside every row.
  Run: '运行',
  Faults: '故障',
  Add: '添加',
  Example: '示例',
  Challenge: '挑战',
  Incident: '事故',
  View: '视图',
  Help: '帮助',

  // Canvas context menu (contextMenuItems.ts).
  '{from} to {to}': '{from} 到 {to}',
  Duplicate: '创建副本',
  'Duplicate all {n}': '创建全部 {n} 个副本',
  Copy: '复制',
  'Copy all {n}': '复制全部 {n} 个',
  'Connect to…': '连接到…',
  Crash: '弄崩',
  'Slow down {factor}': '放慢 {factor}',
  Fix: '修复',
  Delete: '删除',
  'Delete all {n}': '删除全部 {n} 个',
  'Cut connection': '切断连接',
  'Restore connection': '恢复连接',
  'Remove packet loss': '移除丢包',
  'Add {pct} packet loss': '添加 {pct} 丢包',
  'Delete connection': '删除连接',
  'Paste here': '粘贴到这里',
  'Add component here': '在这里添加组件',
  'Fit diagram': '适应整张图',
};
