// src/data/tools.ts

export interface Tool {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    href: string;
    category?: string; // 添加分类属性
}

// 现有工具 + 从 ai.md 添加的工具
const baseTools: Tool[] = [
    {
        id: 'json-formatter',
        name: 'JSON 格式化工具',
        description: '在线格式化、校验和美化 JSON 数据。',
        href: '/tools/json-formatter',
        category: '开发工具',
    },
    {
        id: 'color-picker',
        name: '颜色选择器',
        description: '从调色板或屏幕上选择颜色，并获取其代码 (HEX, RGB, HSL)。',
        href: '/tools/color-picker',
        category: '设计工具',
    }
];

// 从 ai.md 提取的新工具数据
const otherAi: Tool[] = [
    {
        id: 'regex-tester',
        name: '正则表达式测试器',
        description: '在线测试和调试正则表达式。',
        href: 'https://regex101.com/',
        category: '开发工具',
    },
    {
        id: 'hugging-face',
        name: 'Hugging Face',
        description: '机器学习社区在模型、数据集和应用程序上进行协作的平台。',
        href: 'https://huggingface.co/',
        category: 'AI 社区',
    },
    {
        id: 'modelscope',
        name: '魔搭社区',
        description: '阿里巴巴通义旗下 AI 社区。共享 · 共创 · 共进，构建持续创新的 AI 开源生态。',
        href: 'https://www.modelscope.cn/home',
        category: 'AI 社区',
    },
    {
        id: 'bohrium',
        name: 'Bohrium',
        description: '有免费额度适合学习。',
        href: 'https://bohrium.dp.tech',
        category: 'AI 社区',
    },
    {
        id: 'jan-ai',
        name: 'Jan AI',
        description: '本地大模型使用解决方案，界面美观，无中文语言支持。一个开源 ChatGPT 替代方案，100% 离线运行。',
        href: 'https://jan.ai/',
        category: 'AI 衍生工具',
    },
    {
        id: 'aieditor',
        name: 'AIEditor',
        description: '集成 AI 的前端富文本编辑器。',
        href: 'https://aieditor.dev/',
        category: 'AI 衍生工具',
    },
    {
        id: 'memo-ai',
        name: 'Memo AI',
        description: 'YouTube、播客、本地音频视频轻松转文字、字幕翻译、语音合成，还可以由多种 AI 模型提炼内容精华总结，生成思维导图。',
        href: 'https://memo.ac/zh/',
        category: 'AI 衍生工具',
    },
    {
        id: 'gemini',
        name: 'Gemini',
        description: '谷歌双子座。在长文本小说写作方向突出。',
        href: 'https://gemini.google.com/prompt',
        category: 'AI 模型',
    },
    {
        id: 'chat-gpt',
        name: 'Chat GPT',
        description: 'ChatGPT（全名：Chat Generative Pre-trained Transformer）。OpenAI 于2022年11月30日发布, 开启了 AI 元年的序幕。',
        href: 'https://chatgpt.com/',
        category: 'AI 模型',
    },
    {
        id: 'kimi',
        name: 'Kimi',
        description: '由月之暗面发布, 长文本突出。',
        href: 'https://kimi.moonshot.cn/',
        category: 'AI 模型',
    },
    {
        id: 'tongyi-qianwen',
        name: '通义千问',
        description: '国内开源大模型, 多模态多参数。',
        href: 'https://tongyi.aliyun.com/qianwen',
        category: 'AI 模型',
    },
    {
        id: 'claude',
        name: 'Claude',
        description: 'Anthropic自研模型，代码编写方向突出。',
        href: 'https://claude.ai',
        category: 'AI 模型'
    },
    {
        id: 'wenxin-yiyan',
        name: '文心一言',
        description: '百度自研模型。',
        href: 'https://yiyan.baidu.com/welcome',
        category: 'AI 模型'
    },
    {
        id: 'doubao',
        name: '豆包',
        description: '字节自研大模型，应用体验极佳。',
        href: 'https://www.doubao.com/chat/',
        category: 'AI 模型'
    },
    {
        id: 'xf-xinghuo',
        name: '星火',
        description: '科大讯飞自研模型。',
        href: 'https://xinghuo.xfyun.cn/desk',
        category: 'AI 模型'
    },
    {
        id: 'ttson-old',
        name: 'TTS-Old',
        description: '文本转语音工具 (旧版)。',
        href: 'https://old.ttson.cn/',
        category: 'AI 工具'
    },
    {
        id: 'ttson-new',
        name: 'TTS-New',
        description: '文本转语音工具 (新版)。',
        href: 'https://www.ttson.cn/',
        category: 'AI 工具'
    },
    {
        id: 'ttsmaker',
        name: 'TTSMAKER',
        description: '文本转语音工具。',
        href: 'https://ttsmaker.cn/',
        category: 'AI 工具'
    },
    {
        id: 'jimeng',
        name: '即梦',
        description: 'AI 绘图工具。',
        href: 'https://jimeng.jianying.com/ai-tool/home',
        category: 'AI 绘图'
    },
    {
        id: 'ailogomaker',
        name: 'AILogoMaker',
        description: '免费 AI LOGO 生成。',
        href: 'https://ailogomaker.io/zh-CN/app',
        category: 'AI 工具',
    },
    {
        id: 'lmarena',
        name: 'Lmarena',
        description: '免费的大模型竞技场，可以体验国内外主流大模型。',
        href: 'https://lmarena.ai/',
        category: 'AI 工具'
    },
    {
        id: 'ocoolai',
        name: 'ocoolAI',
        description: '大模型 API 聚合服务商',
        href: 'https://one.ooo.cool/',
        category: 'AI 社区'
    },
    {
        id: 'siliconflow',
        name: '硅基流动',
        description: '为开发者和企业提供高效、低成本且全面的生成式人工智能（GenAI）模型服务',
        href: 'https://siliconflow.cn/zh-cn/',
        category: 'AI 社区'
    },
    {
        id: 'o3',
        name: 'O3',
        description: '多服务商模型集成系统,大模型 API 聚合服务商',
        href: 'https://o3.fan/',
        category: 'AI 社区'
    },
]

// 从 tools.md 提取的新工具数据
const otherTools: Tool[] = [
    {
        id: 'heroicons',
        name: 'Heroicons',
        description: '精美的手工制作的 SVG 图标，由 Tailwind CSS 的制作者提供。',
        href: 'https://heroicons.com/',
        category: '开发工具',
    },
    {
        id: 'sealos',
        name: 'Sealos',
        description: '一站式云开发平台，提供即时协作开发、无缝部署和环境隔离能力，助您高效管理开发工作流程，轻松实现团队协作。',
        href: 'https://sealos.run/?s=%E9%A6%96%E9%A1%B5',
        category: '开发工具'
    },
    {
        id: 'pake',
        name: 'Pake',
        description: '使用 Rust 轻松将任何网页转变为桌面应用程序。',
        href: 'https://github.com/tw93/Pake',
        category: '开发工具',
    },
    {
        id: 'uiverse',
        name: 'Uiverse',
        description: '一个开源的 UI 组件库。',
        href: 'https://uiverse.io/',
        category: '开发工具',
    },
    {
        id: 'clawcloud',
        name: 'Claw Cloud',
        description: '面向开发人员的云基础设施和应用部署平台。',
        href: 'https://uiverse.io/',
        category: '开发工具',
    },
    {
        id: 'onlook',
        name: 'Onlook',
        description: '直观地编辑您的 React 网站或 Web 应用程序，并将更改实时写回代码。',
        href: 'https://onlook.com/',
        category: '开发工具',
    },
    {
        id: '21st',
        name: '21st',
        description: '一个用于获得设计灵感的 React 组件库',
        href: 'https://21st.dev/',
        category: '开发工具',
    },
    {
        id: 'animejs',
        name: 'Anime.js',
        description: 'JavaScript 动画库。',
        href: 'https://animejs.com/',
        category: '开发工具',
    },
    {
        id: 'chat-ui',
        name: 'Chat UI',
        description: '达摩院阿里小蜜孵化的AI对话组件库',
        href: 'https://chatui.io/',
        category: '开发工具'
    },
    {
      id: 'icraft',
      name: 'iCraft Editor',
      description: '轻松创建直观的3D架构图，让复杂的系统一目了然！',
      href: 'https://icraft.gantcloud.com/zh-CN',
      category: '开发工具'
    },
    {
      id: 'neon',
      name: 'Neon',
      description: '便捷的云上 Postgres 数据库，免费 500MB 大小',
      href: 'https://neon.tech/',
      category: '开发工具'
    },
    {
        id: 'fastfetch',
        name: 'Fastfetch',
        description: '终端系统信息获取工具，注重性能和可定制性。',
        href: 'https://github.com/fastfetch-cli/fastfetch',
        category: '系统工具',
    },
    {
        id: 'pypistats',
        name: 'PyPI Stats',
        description: '查看 PyPI 模块的下载统计信息。',
        href: 'https://pypistats.org/',
        category: '开发工具',
    },
    {
        id: 'itdog-http',
        name: 'IT Dog HTTP 测试',
        description: '测试目标网站的访问速度和可用性。',
        href: 'https://www.itdog.cn/http/',
        category: '网络工具',
    },
    {
        id: 'fd-find',
        name: 'fd (fd-find)',
        description: 'find 命令的简单、快速和用户友好的替代品。',
        href: 'https://github.com/sharkdp/fd',
        category: '命令行工具',
    },
    {
        id: 'pake',
        name: 'Pake',
        description: '利用 Rust 轻松构建轻量级多端桌面应用 (打包网页)。',
        href: 'https://github.com/tw93/Pake',
        category: '开发工具',
    },
    {
        id: 'fumadocs',
        name: 'Fumadocs',
        description: 'Fumadocs 是一个基于 nextjs 面向开发人员的现代文档框架',
        href: 'https://fumadocs.vercel.app/',
        category: '开发工具',
    },
    {
        id: 'slidev',
        name: 'Slidev',
        description: 'Slidev 位开发者打造的演示文稿工具',
        href: 'https://cn.sli.dev/',
        category: '开发工具',
    },
    {
        id: 'iconkitchen',
        name: 'IconKitchen',
        description: '生成简洁的应用图标。',
        href: 'https://icon.kitchen',
        category: '设计工具',
    },
    {
        id: 'logofast',
        name: 'LogoFast',
        description: '生成简洁的应用图标。',
        href: 'https://logofa.st/',
        category: '设计工具',
    },
    {
        id: 'free-app-icon',
        name: 'Free App Icon',
        description: '下载公开软件的应用图标。',
        href: 'https://appicons.co/',
        category: '设计工具',
    },
    {
        id: 'vectorcraftr',
        name: 'vectorCraftr',
        description: '开源插画网站。',
        href: 'https://vectorcraftr.com/',
        category: '设计资源',
    },
    {
        id: 'wallspic',
        name: 'Wallspic',
        description: '免费的壁纸软件',
        href: 'https://wallspic.com/cn',
        category: '设计资源',
    },
    {
        id: '100font',
        name: '100 Font',
        description: '聚合字体网站，包含免费及付费的文字',
        href: 'https://www.100font.com/',
        category: '设计资源',
    },
    {
        id: 'pixabay',
        name: 'Pixabay',
        description: '免费正版的音频、视频、图片网站',
        href: 'https://pixabay.com/zh/',
        category: '设计资源',
    },
    {
        id: 'undraw',
        name: 'unDraw',
        description: '各个领域的插画，可自定义颜色。',
        href: 'https://undraw.co/illustrations',
        category: '设计资源',
    },
    {
        id: 'akile-monitor',
        name: 'Akile Monitor',
        description: '开源、轻量、易用、简洁的服务器监控。',
        href: 'https://github.com/akile-network/akile_monitor',
        category: '监控',
    },
    {
        id: 'uptime-kuma',
        name: 'uptime Kuma',
        description: '开源免费的易于使用的自托管的服务监控工具。',
        href: 'https://github.com/louislam/uptime-kuma',
        category: '监控',
    },
    {
        id: 'beszel',
        name: 'Beszel',
        description: '轻量级服务器监控平台，包含 Docker 统计、历史数据和警报功能。',
        href: 'https://github.com/henrygd/beszel',
        category: '监控',
    },
    {
        id: 'starship',
        name: 'Starship',
        description: '轻量、迅速、客制化的高颜值终端！',
        href: 'https://starship.rs/zh-CN/',
        category: '命令行工具',
    },
    {
        id: 'vtracer',
        name: 'vtracer',
        description: '将 JPEG/PNG 等光栅图像转换为矢量图 SVG。',
        href: 'https://github.com/visioncortex/vtracer',
        category: '图像处理',
    },
    {
        id: 'witsy',
        name: 'Witsy',
        description: '一个包含多种功能的桌面端GPT助手 (聊天, 草稿板, 智能指令等)。',
        href: 'https://witsyai.com',
        category: 'AI 衍生工具',
    },
    {
        id: 'trzsz-tssh',
        name: 'trzsz / tssh',
        description: '优秀的文件传输工具 (trz/tsz) 和兼容 tmux 的 ssh 客户端替代品 (tssh)。',
        href: 'https://trzsz.github.io/cn/',
        category: '命令行工具',
    },
    {
        id: 'netmount',
        name: 'NetMount',
        description: '统一管理和挂载云存储设施。',
        href: 'https://www.netmount.cn/',
        category: '云存储',
    },
    {
        id: 'omakub',
        name: 'OMAKUB',
        description: 'Ubuntu 集成开发环境一键安装。',
        href: 'https://omakub.org/',
        category: '开发环境',
    },
    {
        id: 'tubedown',
        name: 'TubeDown',
        description: '专注下载YouTube视频，音乐，字幕与封面，兼容多个网站。',
        href: 'https://tubedown.cn/',
        category: '下载工具',
    },
    {
        id: 'xyjun',
        name: '视频解析',
        description: '免费全网VIP视频会员免广告看电影',
        href: 'http://www.xyjun.com/vip/',
        category: '下载工具',
    },
    {
        id: 'curlconverter',
        name: 'CurlConverter',
        description: '将 curl 命令转换为多种编程语言的代码。',
        href: 'https://curlconverter.com/',
        category: '开发工具',
    },
    {
        id: 'freefilesync',
        name: 'FreeFileSync',
        description: '高效免费的文件同步软件',
        href: 'https://freefilesync.org/',
        category: '系统工具',
    },
    {
        id: 'patorjk-taag',
        name: 'Text to ASCII Art',
        description: '在线生成 ASCII 艺术字。',
        href: 'https://www.patorjk.com/software/taag/#p=display&f=Rectangles&t=DF-CLI',
        category: '趣味工具',
    },
    {
        id: 'ustc-speedtest',
        name: '中科大测速网站',
        description: '中国科学技术大学提供的网络测速服务。',
        href: 'https://test.ustc.edu.cn/#',
        category: '网络工具',
    },
    {
        id: 'it-tools',
        name: 'IT Tools',
        description: '在线开发工具集。',
        href: 'https://it-tools.tech/',
        category: '工具集',
    },
    {
        id: 'qq-browser-tools',
        name: 'QQ浏览器工具集',
        description: '腾讯QQ浏览器提供的在线工具集。',
        href: 'https://tool.browser.qq.com/',
        category: '工具集',
    },
    {
        id: 'spiderbox',
        name: '虫盒',
        description: '爬虫工具箱。',
        href: 'https://spiderbox.cn',
        category: '工具集',
    },
    {
        id: 'docsmall',
        name: 'docsmall',
        description: '在线文件处理工具集 (PDF压缩等)。',
        href: 'https://docsmall.com/pdf-compress',
        category: '工具集',
    },
    {
        id: 'xizhi',
        name: '息知',
        description: '通过 API 发送微信通知。',
        href: 'https://xizhi.qqoq.net/',
        category: 'API 服务',
    },
    {
        id: 'excalidraw',
        name: 'Excalidraw',
        description: '虚拟协作白板工具，类手写风格, 简洁易用。',
        href: 'https://excalidraw.com/',
        category: '绘图工具',
    },
    {
        id: 'tldraw',
        name: 'Tldraw',
        description: '简单有趣的在线绘图工具。',
        href: 'https://www.tldraw.com',
        category: '绘图工具',
    },
    {
        id: 'easychuan',
        name: '轻松传',
        description: '跨设备文件互传工具。',
        href: 'https://easychuan.cn/?mode=standalone',
        category: '文件传输',
    },
    {
        id: 'css-box-shadow-examples',
        name: 'CSS Box Shadow Examples',
        description: '漂亮的 CSS 盒子阴影示例集合。',
        href: 'https://getcssscan.com/css-box-shadow-examples',
        category: '开发工具',
    },
    {
        id: 'howtocook',
        name: '程序员做饭指南',
        description: '教程序员做饭的菜谱集合。🤣',
        href: 'https://cook.aiursoft.cn/',
        category: '趣味工具',
    },
    {
        id: 'shields-io',
        name: 'Shields.io',
        description: '为开源项目创建信息徽章 (小标签)。',
        href: 'https://shields.io/',
        category: '开发工具',
    },
    {
        id: 'netbian',
        name: '彼岸图网',
        description: '免费壁纸网站。',
        href: 'https://pic.netbian.com/',
        category: '设计资源',
    },
    {
        id: 'myfreemp3',
        name: 'MyFreeMP3',
        description: '免费在线音乐播放器。',
        href: 'https://tools.liumingye.cn/music/#/',
        category: '影音娱乐',
    },
    {
        id: 'bootcdn',
        name: 'Boot CDN',
        description: '稳定、快速、免费的前端开源项目 CDN 加速服务。',
        href: 'https://www.bootcdn.cn/',
        category: 'CDN 服务',
    },
    {
        id: 'free-api',
        name: 'FREE-API',
        description: '免费 API 接口集合。',
        href: 'https://www.free-api.com/',
        category: 'API 服务',
    },
    {
        id: 'datafountain',
        name: 'DataFountain',
        description: '人工智能数据集和竞赛平台。',
        href: 'https://www.datafountain.cn/datasets',
        category: '数据集',
    },
    {
        id: 'sms-activate',
        name: 'sms-activate',
        description: '在线接码平台。',
        href: 'https://sms-activate.io/cn',
        category: 'API 服务',
    },
    {
        id: 'tututo',
        name: '图图',
        description: '免费在线图床。',
        href: 'https://tutu.to/upload',
        category: '图床',
    },
    {
        id: 'mermaid',
        name: 'Mermaid 图表转换器',
        description: '在线将 Mermaid 代码转换为 SVG 图表，支持流程图、时序图、甘特图等多种图表类型。',
        href: '/tools/mermaid',
        category: '开发工具',
    },
    {
        id: 'tree-converter',
        name: '文件树转换器',
        description: '将缩进格式的文本转换为树形结构显示。',
        href: '/tools/tree-converter',
        category: '开发工具',
    },
];

const mcpTools: Tool[] = [
    {
        id: 'smithery',
        name: 'Smithery',
        description: 'MCP 服务集合',
        href: 'https://smithery.ai/',
        category: 'MCP',
    },
    {
        id: 'mcp-filesystem',
        name: 'MCP Filesystem',
        description: '使用可配置的访问控件安全文件操作',
        href: 'https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem',
        category: 'MCP',
    },
    {
        id: 'mcp-github',
        name: 'MCP GitHub',
        description: '存储库管理，文件操作和GitHub API集成',
        href: 'https://github.com/modelcontextprotocol/servers/blob/main/src/github',
        category: 'MCP',
    },
    {
        id: 'mcp-google-drive',
        name: 'MCP Google Drive',
        description: '文件访问和搜索功能的Google Drive',
        href: 'https://github.com/modelcontextprotocol/servers/blob/main/src/gdrive',
        category: 'MCP',
    },
    {
        id: 'mcp-blender',
        name: 'MCP Blender',
        description: 'MCP 实现快速辅助 3D 建模、场景创建和操作',
        href: 'https://github.com/ahujasid/blender-mcp',
        category: 'MCP',
    },
    {
        id: 'mcp-browser-tools',
        name: 'MCP BrowserTools',
        description: 'MCP 浏览器监控和交互工具',
        href: 'https://github.com/AgentDeskAI/browser-tools-mcp',
        category: 'MCP',
    }

];

// 存储所有工具，确保 id 唯一
const allToolDataMap = new Map<string, Tool>();

// 先添加 baseTools
baseTools.forEach(tool => {
    if (!allToolDataMap.has(tool.id)) {
        allToolDataMap.set(tool.id, tool);
    }
});

// 再添加 otherAi，如果 id 已存在则跳过
otherAi.forEach(tool => {
    if (!allToolDataMap.has(tool.id)) {
        allToolDataMap.set(tool.id, tool);
    }
});

// 再添加 otherTools，如果 id 已存在则跳过
otherTools.forEach(tool => {
    if (!allToolDataMap.has(tool.id)) {
        allToolDataMap.set(tool.id, tool);
    }
});

mcpTools.forEach(tool => {
    if (!allToolDataMap.has(tool.id)) {
        allToolDataMap.set(tool.id, tool);
    }
});

// 将 Map 转回数组
const allToolsArray = Array.from(allToolDataMap.values());

export function getAllTools(): Tool[] {
    return allToolsArray; // 返回包含所有唯一工具的数组
}
