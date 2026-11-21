/**
 * Chinese interface copy for the fault and storage panels: fault controls,
 * undo labels, share dialog, saved designs. Same contract as chrome.ts.
 *
 * Keys reused from other dictionaries (not redefined here): 'Crash', 'Fix',
 * 'Duplicate' and '{from} to {to}' in app.ts; 'Cut', 'Stall', 'Restart',
 * 'Errors', 'Requests delivered twice' and ', ' in panels.ts; 'Save to a
 * file' and 'Open a file' in chrome.ts; 'crash', 'restart', 'p99' in
 * canvas.ts; 'Goodput' and 'no replies' in inspector.ts. */

export const zhOps: Record<string, string> = {
  // Node fault controls (FaultControls.tsx). The fault buttons themselves
  // ('Crash', 'Restart', 'Stall', 'Fix', 'Duplicate') live elsewhere.
  Crashed: '已弄崩',
  'Stops it completely until you press Fix. Work it was holding is lost.':
    '它会彻底停机，直到你按下修复。它当时握着的工作会丢失。',
  'Down for': '停机多久',
  'Stops it, then it starts again by itself. Work in progress is lost.':
    '它先停下来，随后自己重新启动。进行中的工作会丢失。',
  'Crash one': '弄崩一台',
  'Crash one instance': '弄崩一台实例',
  'One instance down': '一台实例已宕机',
  'Stops one of its {n} machines. The work on that machine is lost, and the other {rest} keep serving with fewer slots between them.':
    '它有 {n} 台机器，这会停掉其中一台。那台机器上的工作会丢失，其余 {rest} 台继续服务，但彼此之间的余量变少了。',
  'How much slower': '放慢多少',
  Slow: '变慢',
  Slowed: '已变慢',
  'Every request takes that many times longer to handle.':
    '每个请求的处理时间都会变成原来的这么多倍。',
  'It does no work of its own that takes time, so there is nothing here to slow down. Try it on a component that handles requests.':
    '它自己不做任何耗时的工作，所以这里没有可以放慢的东西。换一个处理请求的组件试试。',
  'Stall for': '停顿多久',
  'It freezes for that long, then carries on by itself. A long garbage collection pause stalls a program the same way. It returns no errors itself, but callers that give up waiting fail or send the same request again.':
    '它会冻结这么久，然后自己继续运行。一次很长的垃圾收集停顿就会这样卡住程序。它自己不报错，但等不及的调用方会失败，或者把同一个请求再发一遍。',
  'Requests that fail': '出错的请求',
  Glitch: '抖动',
  Glitching: '抖动中',
  'It stays up, but that share of its answers are errors.':
    '它不停机，但它的应答里有这么多比例会是错误。',
  'Fault to try': '要试的故障',
  ', in force': '，生效中',
  Connections: '连接',
  duplicating: '重复投递中',
  'answers cut': '应答被切断',
  ', {notes}': '，{notes}',
  ', cut': '，已切断',
  Restore: '恢复',
  None: '无',
  'Forget saved faults': '忘掉已保存的故障',
  '1 fault is saved with this run. Reset plays it again at the same moments, and a replay link sends it along.':
    '这次运行保存了 1 个故障。重置会在相同的时刻把它再放一遍，回放链接也会把它带上。',
  '{n} faults are saved with this run. Reset plays them again at the same moments, and a replay link sends them along.':
    '这次运行保存了 {n} 个故障。重置会在相同的时刻把它们再放一遍，回放链接也会把它们带上。',

  // Cable rows and their menus, per connection.
  'Cut connection {name}': '切断{name}的连接',
  'Restore {name}': '恢复{name}的连接',
  'More for the connection {name}': '{name}这条连接的更多操作',
  'Deliver once': '只投递一次',
  'Deliver once {name}': '让{name}的请求只投递一次',
  'Duplicate {rate} of requests {name}': '重复投递{name} {rate}的请求',
  'Let answers back': '让应答传回来',
  'Let answers back {name}': '让{name}的应答传回来',
  'Cut answers': '切断应答',
  'Cut answers only': '只切断应答',
  'Cut answers only {name}': '只切断{name}的应答',
  'Duplicate delivers {rate} of its requests twice. Cut answers lets requests through but loses what comes back. Select the connection itself for more.':
    '重复投递会把这条连接 {rate} 的请求投递两次。切断应答会让请求通过，但把传回来的东西丢掉。要更多操作，请选中这条连接本身。',
  'The far end gets that share of requests a second time, the way a network that resends a packet can, and does the work again. Idempotency keys there spot the copy.':
    '对端会把这么多比例的请求再收到一次，就像网络会重发数据包那样，并把工作再做一遍。对端的幂等键能认出这份副本。',
  'Requests still get through and do their work, but the answers never come back. {more}':
    '请求仍然能通过并把工作做完，但应答再也不会回来。{more}',
  'The caller has no timeout, so every call that lost its answer stays stuck, even after you let answers back.':
    '调用方没有设置超时，所以每一个丢了应答的调用都会一直卡着，即使你放行了应答也一样。',
  'The caller waits until its timeout gives up, and with retries it does the work a second time.':
    '调用方会等到自己的超时放弃，而在有重试的情况下，它会把工作再做一遍。',

  // A single selected connection.
  'Requests get through.': '请求能通过。',
  'Connected.': '已连接。',
  'Cut. Nothing crosses this connection until you restore it.':
    '已切断。在你恢复它之前，这条连接上什么都过不去。',
  'Cut because {name} is cut off from its connections. Fix {name} to reconnect it.':
    '{name}与它的连接被切断了，所以这条连接断了。修复{name}即可重新连上。',
  'Cut because a component at one end is cut off from its connections. Fix that component to reconnect it.':
    '一端的组件与它的连接被切断了，所以这条连接断了。修复那个组件即可重新连上。',

  // Packet loss for a single connection.
  'Losing {rate} of the requests sent across it. A caller with retries sends a lost request again.':
    '经过它的请求有 {rate} 正在丢失。有重试的调用方会把丢掉的请求再发一遍。',
  'Delivers every request sent across it.': '经过它发送的每一个请求都会送达。',
  'Requests lost on the way': '途中丢失的请求',
  'Set loss': '设置丢包',
  'Saved with the design, so it stays after Reset. The component at the other end never sees a lost request.':
    '它会随设计一起保存，重置之后仍然生效。另一端的组件永远不会看到丢失的请求。',

  // Fault status sentences (faultWiring.ts).
  'Working normally.': '一切正常。',
  'Crashed at {since}. Every request sent to it fails until you fix it.':
    '自 {since} 起宕机。发给它的每个请求都会失败，直到你修复它。',
  'Running {factor} slower since {since}. Requests wait longer for it, and the line behind it grows.':
    '自 {since} 起慢了 {factor}。请求要等它更久，它后面的队伍越排越长。',
  'Failing {rate} of requests since {since}. It stays up, so callers keep sending it work.':
    '自 {since} 起有 {rate} 的请求失败。它没有停机，所以调用方还在继续给它派活。',
  'Cut off from the network since {since}. Anything sent over its cut connections fails until you fix it, and the connections below show which ones.':
    '自 {since} 起与网络断开。在你修复它之前，从它被切断的连接上发过去的任何东西都会失败，下面的连接列表标出了是哪几条。',
  'One instance crashed at {since}. The work it held was lost, and the others carry its share with fewer slots until you fix it. If it was the only one, nothing is serving.':
    '自 {since} 起一台实例宕机。它握着的工作丢了，其余实例接下它的那份，但彼此之间的余量变少了。如果它本是唯一一台，现在就没有东西在服务了。',
  'Restarting since {since}. Every request sent to it fails until it is back at {back}.':
    '自 {since} 起正在重启。发给它的每个请求都会失败，直到它在 {back} 回来。',
  "Stalled since {since}, until {until}. It keeps its work but does none of it, and new requests wait at the door. Callers' timeouts keep running, so they may give up and send the same request again.":
    '自 {since} 起停顿，到 {until} 为止。它保着自己的工作但一点也不做，新请求在门口排队。调用方的超时仍在走，所以它们可能等不及，把同一个请求再发一遍。',
  'Losing every answer back across it since {since}, {n} so far. Requests still get through and do their work.':
    '自 {since} 起，从这条连接传回的应答全部丢失，到目前为止丢了 {n}。请求仍然能通过并把工作做完。',
  '{head} The caller has no timeout, so it waits for good, and each request it is waiting on keeps a slot.':
    '{head}调用方没有设置超时，所以它会一直等下去，它正在等的每个请求都占着一个槽位。',
  '{head} The caller waits until its timeout gives up, and with retries it sends the request again.':
    '{head}调用方会等到自己的超时放弃，而在有重试的情况下，它会把请求再发一遍。',
  '1 answer': '1 个应答',
  '{n} answers': '{n} 个应答',
  'Answers get through again, but 1 call is still waiting for answers it lost. The caller has no timeout, so they wait for good and each keeps a slot. Crash and fix the caller, or Reset, to free them.':
    '应答又能通过了，但还有 1 个调用在等它弄丢的应答。调用方没有设置超时，所以它们会一直等下去，各自占着一个槽位。把调用方弄崩再修复，或者重置，才能把它们释放出来。',
  'Answers get through again, but {n} calls are still waiting for answers it lost. The caller has no timeout, so they wait for good and each keeps a slot. Crash and fix the caller, or Reset, to free them.':
    '应答又能通过了，但还有 {n} 个调用在等它们弄丢的应答。调用方没有设置超时，所以它们会一直等下去，各自占着一个槽位。把调用方弄崩再修复，或者重置，才能把它们释放出来。',
  'Delivering {rate} of requests twice since {since}, {n} so far. The second copy does the work again, and nobody hears its answer.':
    '自 {since} 起有 {rate} 的请求被投递两次，到目前为止 {n}。第二份副本会把工作再做一遍，而没有人听到它的应答。',
  '1 request': '1 个请求',
  '{n} requests': '{n} 个请求',
  'So are the writes it said were saved but had not written to disk yet.':
    '它说已经保存、其实还没写进磁盘的那些写入也一样会丢。',
  'So are the writes it was holding to save later.':
    '它攒着准备稍后保存的那些写入也一样会丢。',
  'So are the jobs waiting in it.': '排在它里面等着的任务也一样会丢。',
  'To {name}': '到{name}',
  'From {name}': '来自{name}',

  // Undo and redo toast labels (faultUndo.ts), read after 已撤销 / 已重做.
  // 'crash' and 'restart' are canvas.ts's fault-kind words (宕机, 重启).
  stall: '停顿',
  'slow down': '变慢',
  glitch: '抖动',
  fix: '修复',
  'cable cut': '切断连接',
  'cable restore': '恢复连接',
  'deliver twice': '重复投递',
  'deliver once': '只投递一次',
  'answer cut': '切断应答',
  'answer restore': '恢复应答',
  'forget saved faults': '忘掉已保存的故障',

  // Share dialog (Share.tsx). 'Share', 'Copy link' and 'Save to a file'
  // are already translated in app.ts, panels.ts and chrome.ts.
  'This design': '这个设计',
  'They get your boxes and settings, and it runs fresh from the start.':
    '对方拿到你的组件和设置，从起点重新跑一遍。',
  'Link to this design': '指向这个设计的链接',
  'This exact run': '这次运行本身',
  'They watch this run from the start, with each fault at the moment it happened.':
    '对方从头观看这次运行，每个故障都在它发生的那一刻落下。',
  'Link to this exact run': '指向这次运行的链接',
  'Link ready. Copy it from the field.': '链接已生成，请从输入框里复制。',
  'Link copied': '链接已复制',
  'Making link…': '正在生成链接……',
  'Try again': '再试一次',
  Copied: '已复制',
  'If you changed the design partway through, the replay uses it as it is now.':
    '如果你在运行途中改过设计，回放会按它现在的样子来播。',
  'Encrypted in your browser before it is stored. The store cannot read it.':
    '先在你的浏览器里加密，再存进链接库。链接库读不出它的内容。',
  'The design travels inside the link itself.': '设计就装在链接本身里。',

  // Stored share links (share/store.ts). These surface in the dialog and
  // as boot toasts. The dev-only "No link store is configured" error stays
  // English: it names an environment variable and a developer command.
  'Could not reach the link store. Check your connection, or save the design to a file instead.':
    '连不上链接库。检查一下网络，或者把设计保存成文件。',
  'Too many links were made in a short time. Try again in a minute, or save the design to a file.':
    '短时间内生成的链接太多了。过一分钟再试，或者把设计保存成文件。',
  'That design is too big for the link store. Save it to a file instead, which has no limit.':
    '这个设计太大，链接库放不下。改用文件保存吧，文件没有大小限制。',
  'The link store would not take this design. Saving it to a file works either way.':
    '链接库没有收下这个设计。不管怎样，保存成文件都可以。',
  'The link could not be made. Try again, or save the design to a file.':
    '链接没能生成。再试一次，或者把设计保存成文件。',
  'That shared link could not be read, so your own design was opened instead.':
    '这条分享链接读不出来，打开的还是你自己的设计。',
  'Could not reach the link store, so your own design was opened instead.':
    '连不上链接库，打开的还是你自己的设计。',

  // Saved designs dialog (Designs.tsx). 'Your designs', 'Delete' and
  // '{n} components' are app.ts's.
  'Name this design': '给这个设计起个名字',
  'Design name': '设计名称',
  Save: '保存',
  'Add something to the canvas first.': '先在画布上放点东西。',
  'Give the design a name first.': '先给设计起个名字。',
  'That name is already taken.': '这个名字已经被占了。',
  'Nothing saved yet. Name what is on the canvas and press Save, and it will wait here for you.':
    '还没有保存过任何东西。给画布上的内容起个名字，按下保存，它就会在这里等你。',
  Rename: '重命名',
  'Rename {name}': '重命名 {name}',
  '1 component': '1 个组件',
  'Saved in this browser only, on this computer. Nothing is uploaded. Clearing your browser data will remove them. {used} of {max} used. To keep a design somewhere safer, or open it elsewhere, save it to a file from Settings.':
    '只保存在这台电脑的这个浏览器里，不会上传任何东西。清除浏览器数据会把它们一起清掉。已用 {used}/{max} 个位置。想把设计放到更稳妥的地方，或者带到别处打开，可以在设置里把它保存成文件。',

  // Durability: writes reaching disk (Durability.tsx), and the pinned-run
  // label (pinnedRun.ts). 'p99', 'Goodput', 'Errors' and 'no replies' for
  // the compare rows are already translated in canvas.ts, inspector.ts,
  // panels.ts and inspector.ts.
  'Pinned at {s}s, {rate}': '固定于 {s}s，{rate}',
  'Before it answers': '在应答之前',
  'Within {t}': '在 {t} 内',
  'Writes reach disk': '写入落盘',
  'It answers before the write is on disk, and writes it there {when}. A crash or restart loses every write still waiting.':
    '它在写入落盘之前就先应答，然后{when}把写入写到磁盘。崩溃或重启会把还在等待的写入全部丢掉。',
  'It writes each change to disk before it answers, so a crash loses nothing it said was saved.':
    '它先把每一次改动写进磁盘，然后才应答，所以崩溃不会丢掉任何它说已保存的东西。',

  // Whole-browser backup (backup.ts), shown as toasts.
  'That file is empty.': '这个文件是空的。',
  'That file is not valid JSON. It may have been edited or partly saved.':
    '这个文件不是有效的 JSON，可能被改过，或者只保存了一半。',
  'That file does not hold a Breakscale backup.': '这个文件不是 Breakscale 的备份。',
  'That backup was made by a newer version of Breakscale.':
    '这个备份来自更新版本的 Breakscale。',
  'That backup is missing its contents.': '这个备份缺少内容。',
  'There is no room left in this browser to restore that backup.':
    '这个浏览器的存储空间已经不够，恢复不了这个备份。',
  'That backup held nothing this version can read.':
    '这个备份里没有这个版本能读的内容。',
};
