/**
 * Chinese interface copy for the learning layer: tour, task cards, find the
 * problem, learning path, glossary panel chrome, shortcuts card, vendor
 * panel, and the long tail of small components. Same contract as chrome.ts:
 * keys are the exact English source strings, values are the Chinese shown in
 * the zh locale. Strings that already live in another dictionary (chrome,
 * app, canvas, inspector, panels, ops) are not repeated here.
 *
 * Content data (task step texts, glossary entries, learning path tracks,
 * vendor products, timeline sentences, node labels) is translated at its
 * own layer and only flows through here as {params}.
 */

export const zhLearn: Record<string, string> = {
  /* FindProblem */
  '{name} is holding things back': '{name} 拖慢了整个系统',
  'Working as designed': '按设计运行',
  'Running fine': '运行正常',
  'No traffic yet': '还没有流量',
  'Find what is holding the system back': '找出是什么拖慢了系统',
  'Find the problem': '找出问题',
  'Select {name}': '选择 {name}',

  /* TaskCard */
  'Set it to {n}': '设为 {n}',
  'not checking': '不再检查',
  '{at} of {total}': '{at} / {total}',
  'Show your task, {state}': '显示你的任务，{state}',
  'Your task,': '你的任务，',
  'Open the learning path': '打开学习路径',
  'You changed the diagram, so this task has stopped checking. Load the example again to start it over.':
    '你改动了图，这个任务就不再检查了。重新加载这个示例，从头开始。',
  'Reload {name}': '重新加载 {name}',
  'Done.': '已完成。',
  Skipped: '已跳过',
  'Holding: ': '保持中：',
  ' seconds': ' 秒',

  /* Tour */
  '{name} filled up': '{name} 满了',
  It: '它',
  'This slider sets how many requests your users send each second. Drag it up to about {n} and watch what happens.':
    '这个滑块设定你的用户每秒发出多少个请求。把它拖到 {n} 左右，看看会发生什么。',
  'Requests now wait in line for a free slot. Once the line is full, the rest are turned away.':
    '请求现在要排队等一个空闲槽位。队伍一满，多出来的请求就会被拒之门外。',
  'Every request now waits its turn in line for a free slot.':
    '现在每个请求都在排队，等轮到自己用上空闲槽位。',
  'Show me the fix': '看看怎么修',
  'Give it more room': '给它更多空间',
  'Select {name} to see its settings.': '选择 {name}，看看它的设置。',
  'Each slot is one request {name} can work on at once. Raise {field} from':
    '一个槽位就是 {name} 同一时刻能处理的一个请求。把{field}从',
  ' to ': ' 提到 ',
  '{name} has ': '{name} 现在有 ',
  ' slots now. Give the line a few seconds to clear.': ' 个槽位。让队伍花几秒清空。',
  ' slots now, but it is still full at this load. Try more.':
    ' 个槽位了，但这个负载下还是满的。再多试几次。',
  'That did it. Watch p99 come back down as the line clears.':
    '这就行了。看着 p99 随着队伍清空降回来。',
  Fixed: '修好了',
  'That is the whole loop: add load, find what breaks, fix it. The learning path has what to try next.':
    '整个循环就是这样：加大负载，找出哪里出问题，再修好它。学习路径里有接下来可以试的内容。',
  Done: '完成',
  'Step {n} of {total}': '第 {n} 步，共 {total} 步',
  'Tour step {n} of {total}: {title}': '导览第 {n} 步，共 {total} 步：{title}',
  'Skip the tour (Esc)': '跳过导览（Esc）',
  'Skip tour': '跳过导览',
  '{name} right now': '{name} 的当前状态',

  /* LearningPath */
  'Real outage': '真实事故',
  'Do step {n} again, {name}': '再做一遍步骤 {n}：{name}',
  'Open step {n}, {name}, passed': '打开步骤 {n}：{name}，已通过',
  '{verb} step {n}, {name}': '{verb}步骤 {n}：{name}',
  Start: '开始',
  Continue: '继续',
  Again: '再做一遍',
  Open: '打开',
  'It counts as done once you pass it.': '通过它就算完成。',
  'Watch it happen, then fix it. It counts as done once your fix passes.':
    '先看事故怎么发生，再把它修好。你的修复通过检查就算完成。',
  'A short task opens with it. It counts as done once you finish the task.':
    '打开它会带一个简短的任务。把任务做完，这一步就算完成。',
  'Every example, challenge and real outage, in an order that builds up.':
    '所有示例、挑战和真实事故，按由浅入深的顺序排好。',
  '{done} of {total} done': '已完成 {done} / {total}',
  'An example is done when you finish its task. A challenge or an outage is done when your design passes.':
    '示例是做完它带的任务就算完成；挑战和事故是你的设计通过检查才算完成。',
  'Up next': '接下来',
  'It is open behind this dialog.': '它已经在这个对话框后面打开了。',
  'You have done every step. Try a challenge again without hints, or build a design of your own and break it.':
    '每一步你都做完了。可以不看提示再做一遍挑战，或者自己搭一个设计，把它弄坏。',
  Current: '当前',

  /* PassStrip */
  'You passed {name}.': '你通过了 {name}。',
  'See what you learned': '看看你学到了什么',

  /* WhatHappened */
  'What just happened': '刚才发生了什么',
  'What just happened: {text}': '刚才发生了什么：{text}',
  '1 earlier line not shown': '还有 1 行没有显示',
  '{n} earlier lines not shown': '还有 {n} 行没有显示',

  /* Glossary panel chrome */
  'Every term this app puts on screen, and why it matters.':
    '这个应用画在界面上的每个术语，还有它为什么重要。',
  'Search terms': '搜索术语',
  'Search glossary terms': '搜索术语表里的术语',
  '{shown} of {total} term': '{shown} / {total} 个术语',
  '{shown} of {total} terms': '{shown} / {total} 个术语',
  '{total} terms': '{total} 个术语',
  'No term matches “{query}”.': '没有术语与“{query}”匹配。',
  'Try a shorter word, or clear the search to browse them all.':
    '试试更短的词，或者清空搜索，浏览全部术语。',
  'What it is': '它是什么',
  'Real example': '真实例子',
  'When to use it': '什么时候会用到',
  'See also': '另见',
  Capacity: '容量',
  Units: '单位',

  /* Tooltip chrome */
  'Press Enter for the full explanation.': '按 Enter 查看完整解释。',

  /* Shortcuts dialog */
  'Shortcuts list': '快捷键列表',
  or: '或',
  Simulation: '模拟',
  'Clipboard and history': '剪贴板和历史',
  'Select and move': '选择和移动',
  'Notes and sections': '便签和分区',
  'Panels and help': '面板和帮助',
  'Search and present': '搜索和演示',
  'Play or pause': '播放或暂停',
  'Step one tick (pauses first)': '往前走一小步（先暂停）',
  'Play slower or faster': '播放得更慢或更快',
  'Connect two components': '连接两个组件',
  'Start a connection; click the target to finish': '开始连线；点击目标组件完成',
  'Connect the selected component; arrows pick, Enter connects':
    '给选中的组件连线；方向键挑选，Enter 确认',
  'Rename a component in place': '就地重命名组件',
  'Duplicate the selection': '给选中项创建副本',
  'Drag out a copy': '拖出一个副本',
  'Delete the selection': '删除选中项',
  'More actions for a component, a connection or the canvas':
    '组件、连接或画布的更多操作',
  'Copy the selection': '复制选中项',
  'Cut the selection': '剪切选中项',
  'Paste at the pointer': '粘贴到指针所在处',
  'Add to or remove from the selection': '加入或移出选中集',
  'Box-select on empty space': '在空白处拖动框选',
  'Select everything': '全选',
  'Move the selection one grid step': '把选中项移动一格',
  'Move by 1px, off the grid': '按 1px 微调，不贴网格',
  'Snap to the grid, on or off': '开关网格吸附',
  'Bypass the snap for one drag': '仅这一次拖动绕开吸附',
  'Cancel the gesture and deselect': '取消操作并取消选择',
  'Note tool: click the canvas to place text': '便签工具：点击画布放置文字',
  'Section tool: drag to frame a group': '分区工具：拖出一个框圈住一组组件',
  'Edit its text in place': '就地编辑它的文字',
  'Rename its label': '重命名它的标签',
  'Zoom in or out': '放大或缩小',
  'Zoom to 100%': '缩放到 100%',
  'Zoom to fit everything': '缩放到全部可见',
  'Zoom to the selection': '缩放到选中项',
  'Zoom at the cursor': '以光标为中心缩放',
  Pan: '平移',
  'Components rail': '组件栏',
  'Charts strip': '图表条',
  'Inspector, while something is selected': '检查器，要选中一个东西',
  'Glossary, or what the focused component is': '术语表，或当前聚焦的组件是什么',
  'Next or previous area: bar, diagram, panels': '下一个或上一个区域：顶栏、图、面板',
  'Move through the components rail': '在组件栏里移动',
  'This dialog': '这个对话框',
  'Search every action by name': '按名字搜索所有操作',
  'Start or stop presenting': '开始或停止演示',
  'While presenting: crash, slow or fix the part in hand':
    '演示时：弄崩、放慢或修复当前这个组件',

  /* VendorPanel chrome */
  '{name} details': '{name} 详情',
  'On {name}': '厂商：{name}',
  Size: '规格',
  'Choose a size': '选一个规格',
  'These sizes are for their published specs and prices. This kind is not limited by an instance size, so picking one changes nothing in the simulation.':
    '这些规格只作官方公布的规格和价格参考。这类组件不受实例规格限制，所以选哪一个都不会影响模拟。',
  'Specs and prices published by {name}': '规格与价格由 {name} 公布',
  'Specs and prices published by {name} for {region}':
    '规格与价格由 {name} 公布（{region}）',
  Source: '来源',
  ', read {date}': '，{date} 查得',

  /* HintLine */
  'More about {what}': '更多关于 {what} 的说明',

  /* PresentBar */
  Running: '运行中',
  'Slowed {factor}': '慢了 {factor}',
  'Cut off': '已断开',
  Restarting: '正在重启',
  Paused: '已暂停',
  'Faults for {name}': '{name} 的故障',
  'Tap a part to crash, slow or fix it.': '点一个组件，把它弄崩、放慢或修复。',
  'Click a part or Tab to one. X crashes it, W slows it, R fixes it.':
    '点击一个组件，或用 Tab 走到它。X 弄崩，W 放慢，R 修复。',
};
