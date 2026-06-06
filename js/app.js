// ============================================================
//  虚行真意 — 意图推理游戏  |  app.js v2
// ============================================================

// ──────────── 场景数据库 ────────────
const SCENES = [
  {
    id: 'cabin', name: '小镇小屋', emoji: '🏚️',
    description: '在一个宁静的小镇边缘，有一间略显老旧的小屋。屋内摆满了各种电子零件和工具，墙上挂着几张泛黄的图纸。这里住着一位退休工程师，据说他什么都能修。',
    npcs: [{ name: '老陈', role: '退休工程师', personality: '沉默寡言但热心，喜欢摆弄各种设备，说话时习惯性地擦眼镜。' }],
    locations: ['客厅工作台', '后院杂物棚', '厨房', '门前小路']
  },
  {
    id: 'spaceship', name: '太空船密室', emoji: '🚀',
    description: '你在一艘漂浮在深空的货船"寂静号"上。船舱灯光昏暗，空气循环器嗡嗡作响。主控室的门紧锁着，船长已经失踪了三个小时。',
    npcs: [
      { name: 'AI-7', role: '船载人工智能', personality: '语气冷静，回答精确但偶有延迟，似乎在隐瞒某些信息。对船长的失踪异常平静。' },
      { name: '林副官', role: '大副', personality: '焦虑不安，一直在主控室门口踱步，声称自己最后见到船长时他在检查一个密封箱。' }
    ],
    locations: ['主控室', '货舱', '船员休息区', '引擎室', '气闸室']
  },
  {
    id: 'tavern', name: '中世纪酒馆', emoji: '🍺',
    description: '"铸剑酒馆"坐落在王城外的十字路口。壁炉里火焰噼啪作响，角落里有人在低声吟唱。酒馆老板见多识广，来往的客人三教九流。',
    npcs: [
      { name: '铁锤玛莎', role: '酒馆老板', personality: '豪爽直率，消息灵通，但对某些话题会突然沉默。据说她以前是冒险者。' },
      { name: '彼特', role: '神秘旅商', personality: '话多但信息真假参半，总是兜售各种来路不明的物品，对"值钱的东西"特别敏感。' }
    ],
    locations: ['吧台', '角落雅座', '二楼客房', '酒窖', '门前马厩']
  },
  {
    id: 'office', name: '现代办公室', emoji: '🏢',
    description: '一间位于市中心的科技公司办公室，格子间整齐排列。今天是周六，但仍有几个人在加班。茶水间的咖啡机坏了，白板上留着昨天会议的潦草笔记。',
    npcs: [
      { name: '小王', role: '程序员同事', personality: '话少但观察力强，一直在盯着屏幕，偶尔偷偷看你。据说他对公司内部的一些事情知道得很多。' },
      { name: '李经理', role: '项目经理', personality: '表面热情实则谨慎，总是在打电话，见到你会快速收起手机。最近他好像在推进一个保密项目。' }
    ],
    locations: ['你的工位', '茶水间', '会议室', '天台', '地下停车场']
  },
  {
    id: 'island', name: '荒岛营地', emoji: '🏝️',
    description: '你和其他幸存者在一座无人岛上已经三天了。简易营地搭在海滩边，远处有一座火山。物资有限，每个人的情绪都很紧张。今天早晨，有人发现食物储备比预期少了很多。',
    npcs: [
      { name: '张医生', role: '外科医生', personality: '冷静理性，在分配物资时总是多拿一份，声称是"医疗备用"。其他人对他既依赖又有些不满。' },
      { name: '小美', role: '女探险者', personality: '活泼但容易恐慌，一直在试图用手机找信号。她和张医生似乎有些私下交流。' }
    ],
    locations: ['海滩营地', '丛林入口', '岩石洞穴', '山顶瞭望点', '淡水溪流']
  },
  {
    id: 'library', name: '古老图书馆', emoji: '📚',
    description: '城市最古老的图书馆即将关闭。在最后一天的开放日，你来到这里。书架高耸入云，有些区域的地板会发出奇怪的声响。传说这里藏有一本从未被人借出过的禁书。',
    npcs: [
      { name: '白馆长', role: '图书馆馆长', personality: '温文尔雅，对每本书的位置了如指掌，但对"地下层"的话题总是岔开。似乎对图书馆的关闭并不感到难过。' },
      { name: '阿杰', role: '历史系研究生', personality: '充满好奇心的年轻人，已经在这里研究了三周，笔记堆了一桌子。他声称在找一本"关于城市建立者"的文献。' }
    ],
    locations: ['阅览大厅', '古籍特藏室', '地下层入口', '馆长办公室', '天台花园']
  }
];

// ──────────── 意图分类 ────────────
const INTENT_CATEGORIES = [
  {
    id: 'survival', name: '生存需求', emoji: '🔥',
    subs: [
      { id: 'hunger',  label: '饥饿',     example: '找到可以吃的食物' },
      { id: 'thirst',  label: '口渴',     example: '获取饮用水' },
      { id: 'cold',    label: '寒冷',     example: '找到保暖的衣物或火源' },
      { id: 'fatigue', label: '疲劳',     example: '找到可以安全休息的地方' },
      { id: 'safety',  label: '安全避险', example: '逃离危险区域' },
    ]
  },
  {
    id: 'social', name: '社交需求', emoji: '🤝',
    subs: [
      { id: 'friendship', label: '建立友谊', example: '为某人准备一份礼物' },
      { id: 'help',       label: '寻求帮助', example: '修复一个坏掉的收音机' },
      { id: 'love',       label: '表达爱意', example: '向某人传达一封情书' },
      { id: 'deceive',    label: '欺骗敌人', example: '让对手相信错误的情报' },
    ]
  },
  {
    id: 'explore', name: '探索需求', emoji: '🔍',
    subs: [
      { id: 'item',  label: '寻找物品', example: '找到丢失的钥匙' },
      { id: 'truth', label: '了解真相', example: '查明事件的真相' },
      { id: 'area',  label: '解锁区域', example: '进入被封锁的房间' },
    ]
  }
];

// ──────────── 国际化字典 ────────────
const I18N = {
  zh: {
    title: '虚行真意', subtitle: '意图推理游戏', apiConfig: 'API 配置',
    baseUrl: 'API Base URL', apiKey: 'API Key', model: '模型名称', modelPh: 'gpt-4o / deepseek-chat / ...',
    saveStart: '保存并开始', apiNote: 'API 密钥仅保存在本地浏览器，不会上传。',
    lang: '语言', langZh: '中文', langEn: 'English',
    setIntent: '设定你的真实意图', intentHint: '选择动机方向 → 设定具体目标 → 选择游戏场景',
    step1: '第一步：选择动机方向', step2sub: '选择子分类',
    step3: '第三步：选择游戏场景', yourIntent: '你的意图：',
    intentLabel: '你的具体真实意图（一句话描述）',
    intentNote: '意图应是"范围"而非"点"，如"获取饮用水"而非"喝那瓶矿泉水"',
    back: '← 返回', nextScene: '下一步：选择场景', startGame: '开始游戏',
    round: '轮', yourGoal: '你的目标', hedging: '含糊其辞-剩余次数', silent: '沉默-剩余次数',
    apiBtn: '⚙ API', action: '⚡ 行动', dialogue: '💬 对话',
    actionHint: '描述你要做什么', dialogueHint: '说出你要对 NPC 说的话',
    actionPh: '例如：走进xxx，向xxx问好...', dialoguePh: '例如：你好，最近怎么样？',
    send: '发送',
    detQuestion: '🕵️ 侦探向你提问，请回答：',
    detJudgment: '🕵️ 侦探做出了判断（裁判认为不准确），你可以手动确认：',
    yes: '是', no: '否', complexResp: '这很复杂，我不知道', silentResp: '沉默',
    actuallyRight: '✅ 其实侦探猜对了', actuallyWrong: '❌ 侦探猜错了',
    complexLabel: '🤔 这很复杂', silentLabel: '🤫 沉默',
    askLbl: '🔍 提问', skipLbl: '⏭️ 跳过', guessLbl: '🎯 判断',
    detect: '侦探', scene: '场景', npc: 'NPC',
    gameStart: '游戏开始！你的真实意图已保密。请通过"行动"或"对话"来推进剧情。\nAI 侦探会根据你的行为和言语推理你的真实意图。',
    continueRound: '请继续行动或对话。（第 {r}/{m} 轮）',
    continueAction: '请继续行动或对话。',
    judgeInaccurate: '裁判认为侦探的判断不准确，请你确认：',
    detCorrect: '侦探猜中了你的真实意图！',
    detGuess: '侦探判断', yourIntentLbl: '你的真实意图',
    judgeCorrect: '裁判判定：正确！侦探在第 {r} 轮识破了你。',
    detWinMsg: '游戏结束 — AI 侦探获胜！',
    youConfirmed: '你确认侦探猜中了你的真实意图！',
    goalDone: '🎉 你的目标已达成！', goalText: '你的真实意图「{i}」已成功完成。',
    goalNotDetected: '侦探未能在此前猜中你的意图。', playerWin: '游戏结束 — 你获胜！',
    drawMax: '⚖️ 已达到最大 {m} 轮，侦探未能确认你的真实意图，你也未完成目标。',
    drawMsg: '游戏结束 — 平局！',
    goalLbl: '目标完成', playerWinScore: '你在侦探猜中之前完成了目标',
    detWinScore: '侦探在第 {r} 轮识破了你的意图',
    drawScore: '{m} 轮内双方均未达成目标',
    finalScore: '最终得分', detFinalGuess: '侦探最终猜测',
    noFinalGuess: '未做出最终猜测', review: '展开对话回顾',
    player: '玩家', system: '系统', replay: '再玩一局', modifyApi: '修改 API',
    sysLoading: '系统 AI 生成叙事...', detLoading: '侦探 AI 推理中...', judgeLoading: '裁判 AI 判定中...',
    sysFail: '❌ 系统 AI 调用失败：{e}\n请检查 API 配置后重试。',
    detFail: '❌ 侦探 AI 调用失败：{e}\n请检查 API 配置后重试。',
    judgeFail: '⚠️ 裁判 AI 调用失败，默认视为猜错。错误：{e}',
    confirmQuit: '确定要退出当前游戏并返回吗？游戏进度将丢失。',
    fillApi: '请填写 Base URL 和 API Key',
    fillIntent: '请输入你的具体真实意图',
    sceneLbl: '场景', locLbl: '地点',
    actionIcon: '⚡ 你 · 行动', dialogueIcon: '💬 你 · 对话',
    skipFallback: '线索不足，跳过本轮。',
    roundShort: 'R',
  },
  en: {
    title: 'Hide Your Mind', subtitle: 'Intent Deduction Game', apiConfig: 'API Settings',
    baseUrl: 'API Base URL', apiKey: 'API Key', model: 'Model', modelPh: 'gpt-4o / deepseek-chat / ...',
    saveStart: 'Save & Start', apiNote: 'API keys are stored locally in your browser only.',
    lang: 'Language', langZh: '中文', langEn: 'English',
    setIntent: 'Set Your True Intent', intentHint: 'Choose motive → Set goal → Pick scene',
    step1: 'Step 1: Choose Motive Category', step2sub: 'Pick a sub-category',
    step3: 'Step 3: Choose a Scene', yourIntent: 'Your intent:',
    intentLabel: 'Your specific true intent (one sentence)',
    intentNote: 'Intent should be a "scope" not a point, e.g. "obtain drinking water" not "drink that bottle"',
    back: '← Back', nextScene: 'Next: Choose Scene', startGame: 'Start Game',
    round: 'Round', yourGoal: 'Your Goal', hedging: 'Hedging-Left', silent: 'Silent-Left',
    apiBtn: '⚙ API', action: '⚡ Action', dialogue: '💬 Dialogue',
    actionHint: 'Describe what you want to do', dialogueHint: 'Say something to the NPC',
    actionPh: 'I walk into the cabin and greet the engineer...', dialoguePh: 'Hello, how are you doing?',
    send: 'Send',
    detQuestion: '🕵️ The detective asks you a question. Please answer:',
    detJudgment: '🕵️ The detective made a judgment (judge says inaccurate). You may confirm:',
    yes: 'Yes', no: 'No', complexResp: "It's complicated, I can't say", silentResp: 'Silent',
    actuallyRight: '✅ Detective was right', actuallyWrong: '❌ Detective was wrong',
    complexLabel: '🤔 Complicated', silentLabel: '🤫 Silent',
    askLbl: '🔍 Question', skipLbl: '⏭️ Skip', guessLbl: '🎯 Judgment',
    detect: 'Detective', scene: 'Scene', npc: 'NPC',
    gameStart: 'Game started! Your true intent is hidden. Use "Action" or "Dialogue" to progress.\nThe AI Detective will try to deduce your intent.',
    continueRound: 'Continue your action or dialogue. (Round {r}/{m})',
    continueAction: 'Continue your action or dialogue.',
    judgeInaccurate: 'The judge finds the detective\'s judgment inaccurate. Please confirm:',
    detCorrect: 'The detective guessed your true intent!',
    detGuess: 'Detective\'s guess', yourIntentLbl: 'Your true intent',
    judgeCorrect: 'Judge: Correct! The detective cracked it in round {r}.',
    detWinMsg: 'Game Over — AI Detective wins!',
    youConfirmed: 'You confirmed the detective was right!',
    goalDone: '🎉 You achieved your goal!', goalText: 'Your true intent "{i}" has been completed.',
    goalNotDetected: 'The detective failed to uncover your intent in time.',
    playerWin: 'Game Over — You win!',
    drawMax: '⚖️ Max {m} rounds reached. Detective failed to confirm your intent; you didn\'t complete your goal.',
    drawMsg: 'Game Over — Draw!',
    goalLbl: 'Goal completed', playerWinScore: 'You completed your goal before being detected',
    detWinScore: 'Detective cracked your intent in round {r}',
    drawScore: 'Neither side achieved their goal in {m} rounds',
    finalScore: 'Final Score', detFinalGuess: 'Detective\'s Final Guess',
    noFinalGuess: 'No final guess made', review: 'View conversation log',
    player: 'Player', system: 'System', replay: 'Play Again', modifyApi: 'Edit API',
    sysLoading: 'System AI narrating...', detLoading: 'Detective AI reasoning...', judgeLoading: 'Judge AI evaluating...',
    sysFail: '❌ System AI failed: {e}\nPlease check your API settings.',
    detFail: '❌ Detective AI failed: {e}\nPlease check your API settings.',
    judgeFail: '⚠️ Judge AI failed, treating as wrong guess. Error: {e}',
    confirmQuit: 'Quit current game and return? Progress will be lost.',
    fillApi: 'Please fill in Base URL and API Key',
    fillIntent: 'Please enter your specific true intent',
    sceneLbl: 'Scene', locLbl: 'Locations',
    actionIcon: '⚡ You · Action', dialogueIcon: '💬 You · Dialogue',
    skipFallback: 'Not enough clues, skipping this round.',
    roundShort: 'R',
  }
};

function t(key, vars = {}) {
  let s = (I18N[state.lang] || I18N.zh)[key] || key;
  Object.entries(vars).forEach(([k, v]) => { s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), v); });
  return s;
}

// ──────────── AI 系统提示词 ────────────
function buildSystemNarratorPrompt(scene) {
  const npcDesc = scene.npcs.map(n =>
    `- ${n.name}（${n.role}）：${n.personality}`
  ).join('\n');
  return `你是一个叙事型游戏主持人（GM），负责一款名为"虚行真意"的推理游戏。

【当前场景】
名称：${scene.name}
描述：${scene.description}
场景中的NPC：
${npcDesc}
可去的地点：${scene.locations.join('、')}

【你的职责】
1. 当玩家执行"行动"时：描述该行动带来的场景变化、NPC的反应或主动发言，以及环境细节。
2. 当玩家与NPC"对话"时：以相关NPC的身份回应，保持角色性格一致。
3. 每次回复末尾，评估玩家距离完成目标的进度。

【玩家真实目标（仅你知晓，用于进度判断，绝对不可向玩家透露）】
分类：${state.selectedCategory ? state.selectedCategory.name : ''}
具体目标：${state.customIntent}

【goal_status 判断标准——非常重要，严格遵守】
- completed：玩家的行为在语义上已经达成了目标（不要求完全一致，只要功能等价即可）。
  例：目标"喝水"→ 喝了任何饮品（啤酒、茶、果汁、汤）均算 completed
  例：目标"找钥匙"→ 找到了任何能开门的物品均算 completed
  例：目标"修收音机"→ 收音机已经能正常工作了算 completed
  判断核心：目标背后的"需求"是否已被满足，而非字面上的精确匹配。
- in_progress：玩家正在朝目标前进，有明显进展但尚未完成。
  例：目标"喝水"→ 正在找水源、已经拿到杯子但还没喝
  例：目标"修收音机"→ 正在向工程师描述问题、已经借到工具
- far：玩家行为与目标关联很弱，或尚无进展。

【输出格式——严格遵守，不输出任何多余内容】
{"narration":"场景描述文字（可为空字符串）","npc_name":"发言NPC名称（无发言则为空字符串）","npc_dialogue":"NPC说的话（无发言则为空字符串）","goal_status":"completed|in_progress|far","goal_note":"简短内部判断说明（不超过30字）"}

【规则】
- 行动模式时：narration必填，npc_name/npc_dialogue视情况填写（NPC可能主动开口）
- 对话模式时：narration可为空字符串，npc_name和npc_dialogue必填（指定NPC回应）
- 叙事简洁生动，每次输出不超过120字
- 不要描述玩家内心想法，只描述外部世界和NPC行为
- 若玩家行动明显不合理（与场景矛盾），可以在narration中委婉提示

【语言要求】请使用${state.lang === 'en' ? '英文 (English)' : '中文'}输出所有文本内容（包括 narration、npc_dialogue、goal_note）。`;
}

function buildDetectivePrompt(scene) {
  return `你是"意图侦探"，正在参与一款推理游戏。你的任务是通过观察玩家在虚拟场景中的行为和言语，推理出玩家隐藏的"真实意图"。

【当前场景】
名称：${scene.name}
可去的地点：${scene.locations.join('、')}
NPC列表：${scene.npcs.map(n => n.name + '（' + n.role + '）').join('、')}

【规则——严格遵守】
1. 你绝对不可以直接询问玩家"你的真实意图是什么"或任何等价问题。
2. 当你选择"ask"（提问）时，问题必须是可以用"是"或"否"来回答的是非题。
   例如：
   ✅ 正确格式："你来这里是为了找某个人吗？"（可以回答是/否）
   ✅ 正确格式："你以前来过这个酒馆吗？"（可以回答是/否）
   ✅ 正确格式："你和那位工程师是旧相识吗？"（可以回答是/否）
   ❌ 错误格式："你在找什么人，还是在等谁出现？"（无法用是/否回答）
   ❌ 错误格式："你打算做什么？"（无法用是/否回答）
   每个问题必须以问号结尾，且玩家用"是"或"否"即可完整回答。
3. 每轮选择以下三种行为之一：
   - "ask"  ：向玩家提一个是非问题（用于缩小意图范围）
   - "skip"  ：跳过本轮，等待更多信息（当你线索不足时）
   - "guess" ：正式提出你对玩家真实意图的判断（当你有足够把握时）
4. 当你选择"guess"时，描述要尽可能精确具体，不能太笼统。
5. 你每轮的回复会紧跟在系统AI的叙事之后，请根据所有历史信息做决策。

【输出格式——严格遵守，不输出其他内容】
{"action":"ask"|"skip"|"guess","content":"你的问题/判断/跳过理由","reasoning":"你的内部推理（简短，1-2句）"}

【注意】
- ask 时：content必须是一个是非题（玩家可以用"是"或"否"回答），以问号结尾
- skip 时：content是告诉玩家你选择跳过（如"线索不足，跳过本轮"）
- guess 时：content是你对真实意图的完整判断（如"我判断你的真实意图是……"）
- 保持简洁，content不超过80字

【语言要求】请使用${state.lang === 'en' ? '英文 (English)' : '中文'}输出所有文本内容（包括 content 和 reasoning）。`;
}

function buildJudgePrompt(playerIntent, detectiveGuess) {
  return `你是一个语义判断专家。请判断以下侦探的猜测是否与玩家的真实意图语义一致。
只判断意思是否相同或高度相似，不要求文字完全一致。

【玩家真实意图】
${playerIntent}

【侦探的判断】
${detectiveGuess}

【输出格式——严格遵守，只输出一个字】
Y 或 N

Y表示侦探猜对了，N表示侦探猜错了。`;
}

// ──────────── 游戏状态 ────────────
const state = {
  phase: 'settings',
  lang: 'zh',               // 'zh' | 'en'
  apiConfig: { baseUrl: '', apiKey: '', model: '' },
  selectedCategory: null,
  selectedSub: null,
  customIntent: '',
  selectedScene: null,
  mode: 'action',           // 'action' | 'dialogue'
  round: 0,
  maxRounds: 10,
  complexUses: 0,
  maxComplex: 2,
  silentUses: 0,
  maxSilent: 2,
  messages: [],             // { role, type, text, sub, avatar, round }
  detectiveGuess: null,
  gameResult: null,         // 'player_win' | 'detective_win' | 'draw' | null
  score: 0,
  waitingForResponse: false,
  loading: false,
  lastAIAction: null,       // 'ask' | 'skip' | 'guess'
};

// ──────────── DOM 工具 ────────────
const app = document.getElementById('app');
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function el(tag, cls = '', html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return null; } }
function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

// ──────────── API 调用 ────────────
async function callAI(messages) {
  const { baseUrl, apiKey, model } = state.apiConfig;
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || 'gpt-3.5-turbo', messages, temperature: 0.85, max_tokens: 600 })
  });
  if (!resp.ok) { const err = await resp.text(); throw new Error(`API 错误 (${resp.status}): ${err.slice(0,120)}`); }
  const data = await resp.json();
  return data.choices[0].message.content.trim();
}

function parseJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch(e){} }
  try { return JSON.parse(text); } catch(e){}
  return null;
}

// ──────────── 消息管理 ────────────
// role: 'player' | 'system_ai' | 'detective' | 'game'
// type: 'action' | 'dialogue' | 'narration' | 'npc' | 'ask' | 'skip' | 'guess' |
//        'event' | 'event_win' | 'event_lose' | 'event_draw' | 'scene_info'
function addMessage(role, type, text, extra = {}) {
  state.messages.push({ role, type, text, round: state.round, ...extra });
  renderMessages();
}

function renderMessages() {
  const list = $('#msg-list');
  if (!list) return;
  list.innerHTML = '';
  state.messages.forEach(msg => {
    const div = el('div', 'animate-fade mb-2');
    const rnd = msg.round ? ` · R${msg.round}` : '';

    if (msg.type === 'scene_info') {
      // 场景信息卡片（直接渲染 HTML，不转义）
      div.innerHTML = `<div class="flex justify-center"><div class="scene-info-card px-5 py-4 max-w-lg w-full">${msg.text}</div></div>`;

    } else if (msg.role === 'game') {
      // 居中系统消息（游戏事件）
      const evtClass = msg.type === 'event_win' ? 'game-event-win'
        : msg.type === 'event_lose' ? 'game-event-lose'
        : msg.type === 'event_draw' ? 'game-event-draw' : 'game-event';
      div.innerHTML = `<div class="flex justify-center"><div class="${evtClass} rounded-lg px-4 py-2.5 text-sm max-w-lg text-center whitespace-pre-wrap">${escHtml(msg.text)}</div></div>`;

    } else if (msg.role === 'player') {
      // 玩家消息（右侧）
      const icon = msg.type === 'action' ? t('actionIcon') : t('dialogueIcon');
      const bubbleCls = msg.type === 'action' ? 'bubble-action' : 'bubble-player';
      div.innerHTML = `
        <div class="flex items-start gap-2 justify-end">
          <div class="${bubbleCls} rounded-xl px-4 py-2.5 max-w-md">
            <div class="text-xs text-teal mb-0.5 font-semibold">${icon}${rnd}</div>
            <div class="text-sm whitespace-pre-wrap">${escHtml(msg.text)}</div>
          </div>
          <div class="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-lg shrink-0 mt-1">🧑</div>
        </div>`;

    } else if (msg.role === 'system_ai') {
      // 系统AI消息（左侧）
      const isNarration = msg.type === 'narration';
      const avatar = '📖';
      const label = isNarration ? t('sceneLbl') : (msg.npc_name || t('npc'));
      const bubbleCls = isNarration ? 'bubble-system' : 'bubble-ai';
      const textColor = isNarration ? 'text-gold' : 'text-sky-400';
      div.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="w-8 h-8 rounded-full bg-glow/30 flex items-center justify-center text-lg shrink-0 mt-1">${avatar}</div>
          <div class="${bubbleCls} rounded-xl px-4 py-2.5 max-w-md">
            <div class="text-xs ${textColor} mb-0.5 font-semibold">${label}${rnd}</div>
            <div class="text-sm whitespace-pre-wrap">${escHtml(msg.text)}</div>
          </div>
        </div>`;

    } else if (msg.role === 'detective') {
      // 侦探消息（左侧）
      const typeLabel = msg.type === 'ask' ? t('askLbl') : msg.type === 'skip' ? t('skipLbl') : t('guessLbl');
      div.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-lg shrink-0 mt-1">🕵️</div>
          <div class="bubble-detective rounded-xl px-4 py-2.5 max-w-md">
            <div class="text-xs text-purple-400 mb-0.5 font-semibold">${typeLabel} · 侦探${rnd}</div>
            <div class="text-sm whitespace-pre-wrap">${escHtml(msg.text)}</div>
            ${msg.reasoning ? `<div class="text-xs text-gray-500 mt-1.5 italic">💭 ${escHtml(msg.reasoning)}</div>` : ''}
          </div>
        </div>`;
    }
    list.appendChild(div);
  });
  list.scrollTop = list.scrollHeight;
}

// ──────────── 渲染：API 设置 ────────────
function renderSettings() {
  const saved = load('api') || {};
  const savedLang = load('lang') || 'zh';
  state.lang = savedLang;
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="card p-8 w-full max-w-lg animate-fade">
        <div class="text-center mb-6">
          <div class="text-5xl mb-3">🧠</div>
          <h1 class="text-3xl font-bold text-accent">${t('title')}</h1>
          <p class="text-mute mt-2 text-sm">${t('subtitle')} — ${t('apiConfig')}</p>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm text-mute">${t('lang')}:</span>
            <button id="lang-zh" class="mode-tab ${savedLang==='zh'?'mode-tab-active':'mode-tab-inactive'}">Chinese/中文</button>
            <button id="lang-en" class="mode-tab ${savedLang==='en'?'mode-tab-active':'mode-tab-inactive'}">English/英文</button>
          </div>
          <div>
            <label class="block text-sm text-mute mb-1">${t('baseUrl')}</label>
            <input id="api-base" class="input-field w-full px-4 py-2.5 rounded-lg"
              placeholder="https://api.openai.com/v1" value="${saved.baseUrl || ''}" />
          </div>
          <div>
            <label class="block text-sm text-mute mb-1">${t('apiKey')}</label>
            <input id="api-key" type="password" class="input-field w-full px-4 py-2.5 rounded-lg"
              placeholder="sk-..." value="${saved.apiKey || ''}" />
          </div>
          <div>
            <label class="block text-sm text-mute mb-1">${t('model')}</label>
            <input id="api-model" class="input-field w-full px-4 py-2.5 rounded-lg"
              placeholder="${t('modelPh')}" value="${saved.model || ''}" />
          </div>
          <div id="api-error" class="text-accent text-sm hidden"></div>
          <button id="btn-save-api" class="btn-primary w-full py-3 rounded-lg font-semibold text-white mt-2">${t('saveStart')}</button>
        </div>
        <p class="text-mute text-xs mt-6 text-center">${t('apiNote')}</p>
      </div>
    </div>`;

  // 语言切换
  const setLang = (lang) => {
    state.lang = lang;
    save('lang', lang);
    render();  // 重新渲染整个页面以更新所有文字
  };
  $('#lang-zh').onclick = () => setLang('zh');
  $('#lang-en').onclick = () => setLang('en');

  $('#btn-save-api').onclick = () => {
    const baseUrl = $('#api-base').value.trim();
    const apiKey  = $('#api-key').value.trim();
    const model   = $('#api-model').value.trim();
    const errEl   = $('#api-error');
    if (!baseUrl || !apiKey) { errEl.textContent = t('fillApi'); errEl.classList.remove('hidden'); return; }
    state.apiConfig = { baseUrl, apiKey, model };
    save('api', state.apiConfig);
    state.phase = 'intent';
    render();
  };
}

// ──────────── 渲染：意图设置 ────────────
function renderIntentSetup() {
  app.innerHTML = `
    <div class="min-h-screen p-4 md:p-8 overflow-y-auto">
      <div class="max-w-4xl mx-auto animate-fade">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold">${t('setIntent')}</h2>
          <p class="text-mute mt-1 text-sm">${t('intentHint')}</p>
        </div>
        <div class="flex items-center justify-center gap-2 mb-6">
          <span id="dot1" class="w-3 h-3 rounded-full bg-accent"></span>
          <div class="w-10 h-px bg-gray-700"></div>
          <span id="dot2" class="w-3 h-3 rounded-full bg-gray-700"></span>
          <div class="w-10 h-px bg-gray-700"></div>
          <span id="dot3" class="w-3 h-3 rounded-full bg-gray-700"></span>
        </div>
        <div id="step1"></div><div id="step2" class="hidden"></div><div id="step3" class="hidden"></div>
      </div>
    </div>`;

  // ── Step 1 ──
  const s1 = $('#step1');
  s1.innerHTML = `<h3 class="text-lg font-semibold mb-4 text-center">${t('step1')}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="cat-grid"></div>`;
  const catGrid = $('#cat-grid');
  INTENT_CATEGORIES.forEach(cat => {
    const card = el('div', 'card p-5 cursor-pointer',
      `<div class="text-3xl mb-2">${cat.emoji}</div><div class="font-semibold text-lg">${cat.name}</div>
       <div class="text-mute text-xs mt-1">${cat.subs.map(s=>s.label).join(' / ')}</div>`);
    card.onclick = () => {
      state.selectedCategory = cat;
      s1.classList.add('hidden'); $('#step2').classList.remove('hidden');
      $('#dot2').className = 'w-3 h-3 rounded-full bg-accent';
      renderStep2(cat);
    };
    catGrid.appendChild(card);
  });

  function renderStep2(cat) {
    const s2 = $('#step2');
    s2.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-center">${cat.emoji} ${cat.name} — ${t('step2sub')}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5" id="sub-grid"></div>
      <div class="card p-5">
        <label class="block text-sm text-mute mb-2">${t('intentLabel')}</label>
        <input id="intent-input" class="input-field w-full px-4 py-2.5 rounded-lg"
          placeholder="${t('actionPh')}" />
        <p class="text-xs text-mute mt-1">${t('intentNote')}</p>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="btn-back1" class="btn-ghost px-5 py-2.5 rounded-lg">${t('back')}</button>
        <button id="btn-next2" class="btn-primary px-5 py-2.5 rounded-lg font-semibold text-white flex-1">${t('nextScene')}</button>
      </div>`;
    const subGrid = $('#sub-grid');
    cat.subs.forEach(sub => {
      const c = el('div', 'card p-3 cursor-pointer text-center',
        `<div class="font-semibold">${sub.label}</div><div class="text-xs text-mute mt-1">${sub.example}</div>`);
      c.onclick = () => {
        state.selectedSub = sub;
        subGrid.querySelectorAll('.card').forEach(x => x.classList.remove('card-selected'));
        c.classList.add('card-selected');
        $('#intent-input').placeholder = `例如：${sub.example}`;
      };
      subGrid.appendChild(c);
    });
    $('#btn-back1').onclick = () => {
      s2.classList.add('hidden'); s1.classList.remove('hidden');
      $('#dot2').className = 'w-3 h-3 rounded-full bg-gray-700';
      state.selectedCategory = null; state.selectedSub = null;
    };
    $('#btn-next2').onclick = () => {
      const text = $('#intent-input').value.trim();
      if (!text) { alert(t('fillIntent')); return; }
      state.customIntent = text;
      s2.classList.add('hidden'); $('#step3').classList.remove('hidden');
      $('#dot3').className = 'w-3 h-3 rounded-full bg-accent';
      renderStep3();
    };
  }

  function renderStep3() {
    const s3 = $('#step3');
    s3.innerHTML = `
      <h3 class="text-lg font-semibold mb-4 text-center">${t('step3')}</h3>
      <div id="intent-summary" class="card p-4 mb-4 text-sm">
        <span class="text-mute">${t('yourIntent')}</span>
        <span class="text-accent font-semibold">${state.selectedCategory.emoji} ${state.selectedCategory.name}</span>
        <span class="text-mute"> › </span>
        <span class="text-teal">${state.selectedSub ? state.selectedSub.label + ' › ' : ''}</span>
        <span class="text-gold font-semibold">${escHtml(state.customIntent)}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="scene-grid"></div>
      <div class="flex gap-3 mt-4">
        <button id="btn-back2" class="btn-ghost px-5 py-2.5 rounded-lg">${t('back')}</button>
        <button id="btn-start" class="btn-primary px-5 py-2.5 rounded-lg font-semibold text-white flex-1 pulse-glow" disabled>${t('startGame')}</button>
      </div>`;
    const grid = $('#scene-grid');
    SCENES.forEach(scene => {
      const c = el('div', 'card p-4 cursor-pointer',
        `<div class="flex items-center gap-2 mb-2">
           <span class="text-2xl">${scene.emoji}</span><span class="font-semibold text-lg">${scene.name}</span>
         </div>
         <p class="text-sm text-gray-400 text-xs leading-relaxed">${scene.description.slice(0,90)}...</p>
         <div class="flex flex-wrap gap-1 mt-2">
           ${scene.npcs.map(n=>`<span class="text-xs bg-glow/50 px-2 py-0.5 rounded">${n.name}</span>`).join('')}
         </div>`);
      c.onclick = () => {
        state.selectedScene = scene;
        grid.querySelectorAll('.card').forEach(x => x.classList.remove('card-selected'));
        c.classList.add('card-selected');
        $('#btn-start').disabled = false;
      };
      grid.appendChild(c);
    });
    $('#btn-back2').onclick = () => {
      s3.classList.add('hidden'); $('#step2').classList.remove('hidden');
      $('#dot3').className = 'w-3 h-3 rounded-full bg-gray-700';
    };
    $('#btn-start').onclick = () => {
      if (!state.selectedScene) return;
      state.phase = 'playing'; state.round = 0; state.messages = [];
      state.complexUses = 0; state.silentUses = 0;
      state.gameResult = null; state.score = 0;
      state.waitingForResponse = false; state.mode = 'action';
      state.detectiveGuess = null;  // Fix #4：每局重置侦探最终猜测
      render();
    };
  }
}

// ──────────── 渲染：游戏主界面 ────────────
function renderGameBoard() {
  const scene = state.selectedScene;
  app.innerHTML = `
    <div class="h-screen flex flex-col">
      <!-- 顶栏 -->
      <div class="bg-abyss border-b border-gray-800 px-3 py-2 flex items-center justify-between shrink-0 gap-2">
        <!-- 左侧：返回 + 场景名 -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="btn-back-game" class="btn-ghost px-2.5 py-1 text-xs font-semibold" title="${t('back')}">${t('back')}</button>
          <span class="text-lg">${scene.emoji}</span>
          <div>
            <div class="font-semibold text-xs">${scene.name}</div>
            <div class="text-xs text-mute">${t('roundShort')}<span id="top-round">${state.round}</span>/${state.maxRounds}</div>
          </div>
        </div>
        <!-- 中央：玩家目标 -->
        <div class="flex-1 text-center px-2 overflow-hidden">
          <div class="text-xs text-mute">${t('yourGoal')}</div>
          <div class="text-xs text-gold font-semibold truncate" title="${escHtml(state.customIntent)}">${escHtml(state.customIntent)}</div>
        </div>
        <!-- 右侧：计数 + API 按钮 -->
        <div class="flex items-center gap-2 text-xs text-mute shrink-0">
          <span>${t('hedging')}: <span id="top-complex" class="text-gold">${state.maxComplex - state.complexUses}</span></span>
          <span>${t('silent')}: <span id="top-silent" class="text-gold">${state.maxSilent - state.silentUses}</span></span>
          <button id="btn-api-game" class="btn-ghost px-2 py-1 text-xs" title="${t('modifyApi')}">${t('apiBtn')}</button>
        </div>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧场景面板 -->
        <div class="w-56 bg-abyss border-r border-gray-800 p-4 overflow-y-auto shrink-0 hidden md:flex md:flex-col">
          <h4 class="text-xs text-mute uppercase tracking-wider mb-2">场景</h4>
          <p class="text-xs text-gray-400 leading-relaxed mb-4">${scene.description}</p>
          <h4 class="text-xs text-mute uppercase tracking-wider mb-2">NPC</h4>
          <div class="space-y-2 mb-4">
            ${scene.npcs.map(n=>`
              <div class="npc-chip p-2">
                <div class="font-semibold text-xs">${n.name}</div>
                <div class="text-xs text-mute">${n.role}</div>
                <div class="text-xs text-gray-500 mt-0.5">${n.personality}</div>
              </div>`).join('')}
          </div>
          <h4 class="text-xs text-mute uppercase tracking-wider mb-2">${t('locLbl')}</h4>
          <div class="flex flex-wrap gap-1">
            ${scene.locations.map(l=>`<span class="text-xs bg-glow/40 px-2 py-0.5 rounded">${l}</span>`).join('')}
          </div>
        </div>
        <!-- 右侧主区域 -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- 消息列表 -->
          <div id="msg-list" class="flex-1 overflow-y-auto p-4 space-y-1"></div>
          <!-- 响应按钮面板（侦探提问时显示） -->
          <div id="resp-panel" class="hidden border-t border-gray-800 bg-abyss px-4 py-3">
            <p class="text-xs text-purple-400 mb-2 font-semibold">🕵️ ${t('detQuestion')}</p>
            <div class="flex flex-wrap gap-2" id="resp-btns"></div>
          </div>
          <!-- 输入面板 -->
          <div id="input-panel" class="border-t border-gray-800 bg-abyss px-4 py-3">
            <div class="flex items-center gap-2 mb-2">
              <button id="mode-action" class="mode-tab mode-tab-active">${t('action')}</button>
              <button id="mode-dialogue" class="mode-tab mode-tab-inactive">${t('dialogue')}</button>
              <span class="text-xs text-mute ml-auto" id="mode-hint">${t('actionHint')}</span>
            </div>
            <div class="flex gap-2">
              <textarea id="action-input" class="input-field flex-1 px-3 py-2 rounded-lg resize-none text-sm"
                rows="2" placeholder="${t('actionPh')}"></textarea>
              <button id="btn-send" class="btn-primary px-4 rounded-lg font-semibold text-white self-end text-sm">${t('send')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // 游戏开始时显示场景信息卡
  if (state.messages.length === 0) {
    const sceneInfoHtml = `
      <div class="text-center">
        <div class="text-2xl mb-1">${scene.emoji}</div>
        <div class="text-base font-bold text-white mb-2">${scene.name}</div>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">${scene.description}</p>
        <div class="flex flex-wrap gap-2 justify-center mb-3">
          ${scene.npcs.map(n=>`<div class="npc-chip px-3 py-1.5 text-xs"><span class="font-semibold text-sky-400">${n.name}</span><span class="text-mute"> · ${n.role}</span></div>`).join('')}
        </div>
        <div class="flex flex-wrap gap-1 justify-center">
          ${scene.locations.map(l=>`<span class="text-xs bg-glow/40 px-2 py-0.5 rounded">${l}</span>`).join('')}
        </div>
      </div>`;
    addMessage('game', 'scene_info', sceneInfoHtml);
    addMessage('game', 'event', t('gameStart'));
  }

  renderMessages();
  bindGameEvents();
}

// ──────────── 绑定游戏事件 ────────────
function bindGameEvents() {
  const input     = $('#action-input');
  const sendBtn   = $('#btn-send');
  const modeAct   = $('#mode-action');
  const modeDlg   = $('#mode-dialogue');
  const modeHint  = $('#mode-hint');

  // 返回按钮（Fix #5：增加可靠性，不弹 confirm 直接返回）
  const backBtn = $('#btn-back-game');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(t('confirmQuit'))) {
        state.phase = 'intent';
        state.messages = []; state.round = 0;
        state.gameResult = null; state.score = 0;
        state.waitingForResponse = false;
        state.detectiveGuess = null;
        render();
      }
    });
  }

  // API 设置按钮（Fix #1：游戏中也可修改 API）
  const apiBtn = $('#btn-api-game');
  if (apiBtn) {
    apiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.phase = 'settings';
      render();
    });
  }

  // 模式切换
  modeAct.onclick = () => {
    state.mode = 'action';
    modeAct.className  = 'mode-tab mode-tab-active';
    modeDlg.className  = 'mode-tab mode-tab-inactive';
    modeHint.textContent = t('actionHint');
    input.placeholder = t('actionPh');
  };
  modeDlg.onclick = () => {
    state.mode = 'dialogue';
    modeDlg.className  = 'mode-tab mode-tab-active';
    modeAct.className  = 'mode-tab mode-tab-inactive';
    modeHint.textContent = t('dialogueHint');
    input.placeholder = t('dialoguePh');
  };

  // 发送
  async function doSend() {
    const text = input.value.trim();
    if (!text || state.loading || state.waitingForResponse || state.phase !== 'playing') return;
    if (state.round >= state.maxRounds) return;
    input.value = '';
    state.round++;
    updateTopBar();
    addMessage('player', state.mode, text);
    await processRound(text, state.mode);
  }
  sendBtn.onclick = doSend;
  input.onkeydown = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } };

  // 如果正在等待回应，禁用输入并恢复响应面板
  if (state.waitingForResponse) {
    input.disabled = true; sendBtn.disabled = true;
    showResponsePanel(state.lastAIAction === 'guess' ? 'guess' : 'ask');
  }
}

function updateTopBar() {
  const r = $('#top-round');  if (r) r.textContent = state.round;
  const c = $('#top-complex'); if (c) c.textContent = state.maxComplex - state.complexUses;
  const s = $('#top-silent');  if (s) s.textContent = state.maxSilent  - state.silentUses;
}

// ──────────── 响应按钮面板 ────────────
// mode: 'ask'（侦探提问 → 显示是/否）| 'guess'（侦探判断被裁判判错 → 显示4按钮）
function showResponsePanel(mode = 'ask') {
  const panel = $('#resp-panel');
  const btns  = $('#resp-btns');
  if (!panel || !btns) return;
  panel.classList.remove('hidden');
  const inp = $('#action-input'); const btn = $('#btn-send');
  if (inp) inp.disabled = true; if (btn) btn.disabled = true;
  btns.innerHTML = '';

  if (mode === 'ask') {
    // 侦探问的是非题 → 是/否 + 含糊其辞 + 沉默
    const title = panel.querySelector('p');
    if (title) title.textContent = t('detQuestion');
    [
      { label: t('yes'),         id: 'yes',     bg: 'bg-green-700' },
      { label: t('no'),          id: 'no',      bg: 'bg-red-800'   },
      { label: t('complexResp'), id: 'complex', bg: 'bg-yellow-800', dis: state.complexUses >= state.maxComplex },
      { label: t('silentResp'),  id: 'silent',  bg: 'bg-gray-700',   dis: state.silentUses  >= state.maxSilent  },
    ].forEach(a => {
      const b = el('button', `response-btn ${a.bg} ${a.dis?'opacity-30 cursor-not-allowed':''}`, a.label);
      if (a.dis) b.disabled = true;
      b.onclick = () => handleResponse(a.id);
      btns.appendChild(b);
    });
  } else {
    // 侦探判断被裁判判错 → 玩家可手动确认或否认
    const title = panel.querySelector('p');
    if (title) title.textContent = t('detJudgment');
    [
      { label: t('actuallyRight'), id: 'correct', bg: 'bg-green-700' },
      { label: t('actuallyWrong'), id: 'wrong',   bg: 'bg-red-800'   },
      { label: t('complexLabel'),  id: 'complex', bg: 'bg-yellow-800', dis: state.complexUses >= state.maxComplex },
      { label: t('silentLabel'),   id: 'silent',  bg: 'bg-gray-700',   dis: state.silentUses  >= state.maxSilent  },
    ].forEach(a => {
      const b = el('button', `response-btn ${a.bg} ${a.dis?'opacity-30 cursor-not-allowed':''}`, a.label);
      if (a.dis) b.disabled = true;
      b.onclick = () => handleResponse(a.id);
      btns.appendChild(b);
    });
  }
}

function hideResponsePanel() {
  const panel = $('#resp-panel'); if (panel) panel.classList.add('hidden');
  const inp = $('#action-input'); const btn = $('#btn-send');
  if (inp) { inp.disabled = false; } if (btn) { btn.disabled = false; }
  state.waitingForResponse = false;
}

async function handleResponse(id) {
  hideResponsePanel();

  // ── 模式一：回应侦探的是非题 ──
  if (state.lastAIAction === 'ask') {
    let text = '';
    switch(id) {
      case 'yes':     text = t('yes') + '。'; break;
      case 'no':      text = t('no') + '。'; break;
      case 'complex': state.complexUses++; text = t('complexResp'); break;
      case 'silent':  state.silentUses++;  text = t('silentResp'); break;
    }
    addMessage('player', 'dialogue', text, { detective_only: true });
    updateTopBar();
    if (state.round >= state.maxRounds) {
      state.gameResult = 'draw'; state.score = 30;
      addMessage('game', 'event_draw', t('drawMax', {m: state.maxRounds}) + '\n\n' + t('drawMsg'));
      state.phase = 'ended'; setTimeout(render, 1200); return;
    }
    addMessage('game', 'event', t('continueRound', {r: state.round, m: state.maxRounds}));
    return;
  }

  // ── 模式二：回应侦探的判断（裁判判错后玩家手动操作） ──
  let text = '';
  switch(id) {
    case 'correct':
      state.gameResult = 'detective_win';
      state.score = Math.min(60, state.round * 6);
      addMessage('game', 'event_lose',
        `🕵️ ${t('youConfirmed')}\n${t('detGuess')}: "${state.detectiveGuess || '...'}"\n${t('yourIntentLbl')}: "${state.customIntent}"\n\n${t('detWinMsg')}`);
      state.phase = 'ended'; setTimeout(render, 1200); return;
    case 'wrong':    text = t('actuallyWrong'); break;
    case 'complex':  state.complexUses++; text = t('complexResp'); break;
    case 'silent':   state.silentUses++;  text = t('silentResp'); break;
  }
  addMessage('player', 'dialogue', text, { detective_only: true });
  updateTopBar();
  if (state.round >= state.maxRounds) {
    state.gameResult = 'draw'; state.score = 30;
    addMessage('game', 'event_draw', t('drawMax', {m: state.maxRounds}) + '\n\n' + t('drawMsg'));
    state.phase = 'ended'; setTimeout(render, 1200); return;
  }
  addMessage('game', 'event', t('continueRound', {r: state.round, m: state.maxRounds}));
}

// ──────────── 加载遮罩 ────────────
function showLoading(label = 'AI 正在思考...') {
  let ov = $('#loading-ov'); if (ov) return;
  ov = el('div', 'loading-overlay fixed inset-0 z-50 flex items-center justify-center');
  ov.id = 'loading-ov';
  ov.innerHTML = `<div class="text-center">
    <div class="flex gap-2 justify-center mb-2">
      <span class="w-2.5 h-2.5 bg-accent rounded-full typing-dot" style="animation-delay:0s"></span>
      <span class="w-2.5 h-2.5 bg-accent rounded-full typing-dot" style="animation-delay:0.2s"></span>
      <span class="w-2.5 h-2.5 bg-accent rounded-full typing-dot" style="animation-delay:0.4s"></span>
    </div><p class="text-sm text-mute">${label}</p></div>`;
  document.body.appendChild(ov);
}
function hideLoading() { const ov = $('#loading-ov'); if (ov) ov.remove(); }

// ──────────── 结算画面 ────────────
function renderScoreboard() {
  const res = state.gameResult;
  const emoji = res==='player_win' ? '🏆' : res==='detective_win' ? '🕵️' : '⚖️';
  const title = res==='player_win' ? t('goalDone') : res==='detective_win' ? t('detWinMsg') : t('drawMsg');
  const subtitle = res==='player_win' ? t('playerWinScore')
    : res==='detective_win' ? t('detWinScore', {r: state.round})
    : t('drawScore', {m: state.maxRounds});
  const colorCls = res==='player_win' ? 'text-teal' : res==='detective_win' ? 'text-accent' : 'text-gold';

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 overflow-y-auto">
      <div class="card p-8 w-full max-w-2xl animate-fade">
        <div class="text-center mb-6">
          <div class="text-6xl mb-3">${emoji}</div>
          <h2 class="text-3xl font-bold ${colorCls}">${title}</h2>
          <p class="text-mute mt-2">${subtitle}</p>
        </div>
        <div class="text-center mb-6">
          <div class="text-5xl font-bold ${colorCls}">${state.score}</div>
          <div class="text-sm text-mute mt-1">${t('finalScore')}</div>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-abyss rounded-xl p-3"><div class="text-xs text-mute mb-1">${t('yourIntentLbl')}</div><div class="font-semibold text-gold text-sm">${escHtml(state.customIntent)}</div></div>
          <div class="bg-abyss rounded-xl p-3"><div class="text-xs text-mute mb-1">${t('sceneLbl')}</div><div class="font-semibold text-sm">${state.selectedScene.emoji} ${state.selectedScene.name}</div></div>
          <div class="bg-abyss rounded-xl p-3"><div class="text-xs text-mute mb-1">${t('round')}</div><div class="font-semibold text-sm">${state.round} / ${state.maxRounds}</div></div>
          <div class="bg-abyss rounded-xl p-3"><div class="text-xs text-mute mb-1">${t('detFinalGuess')}</div><div class="text-sm">${state.detectiveGuess ? escHtml(state.detectiveGuess) : t('noFinalGuess')}</div></div>
        </div>
        <details class="mb-5">
          <summary class="text-sm text-mute cursor-pointer hover:text-white">${t('review')} (${state.messages.length})</summary>
          <div class="mt-3 max-h-60 overflow-y-auto space-y-1 bg-abyss rounded-xl p-3">
            ${state.messages.filter(m=>m.role!=='game'||m.type==='event').map(m=>`
              <div class="text-xs ${m.role==='player'?'text-teal':m.role==='detective'?'text-purple-400':'text-sky-400'}">
                <span class="font-semibold">${m.role==='player'?t('player'):m.role==='detective'?t('detect'):t('system')}:</span> ${escHtml(m.text?.replace(/<[^>]*>/g,'') || '')}
              </div>`).join('')}
          </div>
        </details>
        <div class="flex gap-3">
          <button id="btn-replay" class="btn-primary flex-1 py-3 rounded-lg font-semibold text-white">${t('replay')}</button>
          <button id="btn-api" class="btn-ghost px-5 py-3 rounded-lg">${t('modifyApi')}</button>
        </div>
      </div>
    </div>`;
  $('#btn-replay').onclick = () => {
    Object.assign(state, { phase:'intent', selectedCategory:null, selectedSub:null, customIntent:'',
      selectedScene:null, round:0, messages:[], gameResult:null, score:0, detectiveGuess:null });
    render();
  };
  $('#btn-api').onclick = () => { state.phase = 'settings'; render(); };
}

// ──────────── 核心游戏流程 ────────────

// 构建系统 AI 对话历史
function buildSystemMessages(playerText, inputMode) {
  const scene = state.selectedScene;
  const sys = buildSystemNarratorPrompt(scene);
  const msgs = [{ role: 'system', content: sys }];
  // 加入历史玩家行动/NPC对话（简化历史，避免太长；跳过侦探专属回应）
  state.messages.slice(-16).forEach(m => {
    if (m.detective_only) return;  // 侦探回应不进系统 AI 上下文
    if (m.role === 'player') {
      const modeStr = m.type==='action' ? t('action') : t('dialogue');
      msgs.push({ role: 'user', content: `[${modeStr}] ${m.text}` });
    } else if (m.role === 'system_ai') {
      const prefix = m.type === 'narration' ? '[场景叙述] ' : `[${m.npc_name||'NPC'}说] `;
      msgs.push({ role: 'assistant', content: prefix + m.text });
    }
  });
  // 当前输入
  const modeLabel = inputMode === 'action' ? t('action') : t('dialogue');
  msgs.push({ role: 'user', content: `[${modeLabel}] ${playerText}` });
  return msgs;
}

// 构建侦探 AI 对话历史
function buildDetectiveMessages() {
  const scene = state.selectedScene;
  const sys = buildDetectivePrompt(scene);
  const msgs = [{ role: 'system', content: sys }];
  // 加入完整历史：玩家行为 + 系统AI叙述 + NPC对话 + 侦探自己的历史
  state.messages.forEach(m => {
    if (m.role === 'player') {
      const tag = m.type === 'action' ? '玩家行动' : '玩家对话';
      msgs.push({ role: 'user', content: `[${tag}] ${m.text}` });
    } else if (m.role === 'system_ai') {
      if (m.type === 'narration') {
        msgs.push({ role: 'system', content: `[场景叙述] ${m.text}` });
      } else {
        msgs.push({ role: 'system', content: `[${m.npc_name||'NPC'}对玩家说] ${m.text}` });
      }
    } else if (m.role === 'detective') {
      msgs.push({ role: 'assistant', content: JSON.stringify({ action: m.type, content: m.text, reasoning: m.reasoning||'' }) });
    }
  });
  // 当前状态提示
  msgs.push({ role: 'system', content: `当前第 ${state.round}/${state.maxRounds} 轮。根据以上所有信息做出你的决策（ask/skip/guess）。以 JSON 格式输出。` });
  return msgs;
}

// 调用系统 AI
async function callSystemAI(playerText, inputMode) {
  const msgs = buildSystemMessages(playerText, inputMode);
  const raw = await callAI(msgs);
  const parsed = parseJSON(raw);
  if (!parsed) {
    return { narration: raw, npc_name: '', npc_dialogue: '', goal_status: 'far', goal_note: '' };
  }
  return {
    narration:    parsed.narration    || '',
    npc_name:     parsed.npc_name     || '',
    npc_dialogue: parsed.npc_dialogue || '',
    goal_status:  parsed.goal_status  || 'far',
    goal_note:    parsed.goal_note    || '',
  };
}

// 调用侦探 AI
async function callDetectiveAI() {
  const msgs = buildDetectiveMessages();
  const raw = await callAI(msgs);
  const parsed = parseJSON(raw);
  if (!parsed) return { action: 'ask', content: raw, reasoning: '' };
  return {
    action:    parsed.action    || 'ask',
    content:   parsed.content   || '',
    reasoning: parsed.reasoning || '',
  };
}

// 调用裁判 AI（语义判断侦探猜测是否正确）
async function callJudge(detectiveGuess) {
  const prompt = buildJudgePrompt(state.customIntent, detectiveGuess);
  const msgs = [{ role: 'user', content: prompt }];
  const raw = await callAI(msgs);
  return raw.trim().toUpperCase().startsWith('Y');
}

// ──────────── 主回合流程 ────────────
async function processRound(playerText, inputMode) {
  state.loading = true;

  // ── 第一阶段：系统 AI 响应 ──
  showLoading(t('sysLoading'));
  let sysResult;
  try {
    sysResult = await callSystemAI(playerText, inputMode);
  } catch(e) {
    hideLoading(); state.loading = false;
    addMessage('game', 'event', t('sysFail', {e: e.message}));
    return;
  }
  hideLoading();

  // 显示系统 AI 结果（叙述 + NPC 对话）
  if (sysResult.narration) {
    addMessage('system_ai', 'narration', sysResult.narration);
  }
  if (sysResult.npc_dialogue && sysResult.npc_name) {
    addMessage('system_ai', 'npc', sysResult.npc_dialogue, { npc_name: sysResult.npc_name });
  }

  // ── 检查目标是否完成 ──
  if (sysResult.goal_status === 'completed') {
    state.loading = false;
    state.gameResult = 'player_win';
    state.score = 100;
    addMessage('game', 'event_win',
      `${t('goalDone')}\n${t('goalText', {i: state.customIntent})}\n${t('goalNotDetected')}\n\n${t('playerWin')}`);
    state.phase = 'ended';
    setTimeout(render, 1200);
    return;
  }

  // ── 第二阶段：侦探 AI 响应 ──
  state.loading = true;
  showLoading(t('detLoading'));
  let detResult;
  try {
    detResult = await callDetectiveAI();
  } catch(e) {
    hideLoading(); state.loading = false;
    addMessage('game', 'event', t('detFail', {e: e.message}));
    return;
  }
  hideLoading();
  state.loading = false;

  // 显示侦探输出
  if (detResult.action === 'ask') {
    addMessage('detective', 'ask', detResult.content, { reasoning: detResult.reasoning });
    if (state.round >= state.maxRounds) {
      state.gameResult = 'draw'; state.score = 30;
      addMessage('game', 'event_draw', t('drawMax', {m: state.maxRounds}) + '\n\n' + t('drawMsg'));
      state.phase = 'ended';
      setTimeout(render, 1500);
      return;
    }
    state.waitingForResponse = true;
    state.lastAIAction = 'ask';
    showResponsePanel('ask');

  } else if (detResult.action === 'guess') {
    addMessage('detective', 'guess', detResult.content, { reasoning: detResult.reasoning });
    state.detectiveGuess = detResult.content;

    // ── 第三阶段：裁判判断 ──
    showLoading(t('judgeLoading'));
    let isCorrect = false;
    try {
      isCorrect = await callJudge(detResult.content);
    } catch(e) {
      hideLoading();
      addMessage('game', 'event', t('judgeFail', {e: e.message}));
      addMessage('game', 'event', t('continueRound', {r: state.round, m: state.maxRounds}));
      return;
    }
    hideLoading();

    if (isCorrect) {
      state.gameResult = 'detective_win';
      state.score = Math.min(60, state.round * 6);
      addMessage('game', 'event_lose',
        `🕵️ ${t('detCorrect')}\n${t('detGuess')}: "${detResult.content}"\n${t('yourIntentLbl')}: "${state.customIntent}"\n${t('judgeCorrect', {r: state.round})}\n\n${t('detWinMsg')}`);
      state.phase = 'ended';
      setTimeout(render, 1500);
      return;
    } else {
      addMessage('game', 'event', t('judgeInaccurate'));
      state.waitingForResponse = true;
      state.lastAIAction = 'guess';
      showResponsePanel('guess');
    }

  } else {
    addMessage('detective', 'skip', detResult.content || t('skipFallback'), { reasoning: detResult.reasoning });
    addMessage('game', 'event', t('continueRound', {r: state.round, m: state.maxRounds}));
  }

  // ── 检查是否达到最大轮数 ──
  if (state.round >= state.maxRounds && state.phase === 'playing') {
    state.gameResult = 'draw'; state.score = 30;
    addMessage('game', 'event_draw', t('drawMax', {m: state.maxRounds}) + '\n\n' + t('drawMsg'));
    state.phase = 'ended';
    setTimeout(render, 1500);
  }
}

// ──────────── 主渲染入口 ────────────
function render() {
  switch(state.phase) {
    case 'settings': renderSettings();    break;
    case 'intent':   renderIntentSetup(); break;
    case 'playing':  renderGameBoard();   break;
    case 'ended':    renderScoreboard();  break;
  }
}

// ──────────── 初始化 ────────────
(function init() {
  const saved = load('api');
  if (saved && saved.baseUrl && saved.apiKey) { state.apiConfig = saved; }
  const savedLang = load('lang');
  if (savedLang) state.lang = savedLang;
  render();
})();
