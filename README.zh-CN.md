# Linear Clone

我心随我，这就是我，参考了 Linear 的设计理念和用户体验。

## 技术栈

- **框架**: Next.js 15.2.4 (App Router)
- **UI 组件**: Radix UI
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **Markdown 处理**: Marked, Remark
- **代码高亮**: Highlight.js
- **图表**: Mermaid
- **类型系统**: TypeScript

## 项目结构

```
src/
├── app/           # Next.js 应用主目录
│   ├── about/     # 关于页面
│   ├── blog/      # 博客相关页面
│   ├── contact/   # 联系页面
│   ├── docs/      # 文档页面
│   ├── media/     # 媒体资源
│   ├── test/      # 测试相关
│   ├── tools/     # 工具页面
│   ├── layout.tsx # 根布局
│   ├── page.tsx   # 首页
│   ├── globals.css # 全局样式
│   └── ClientBody.tsx # 客户端组件
│
└── content/       # 内容管理目录
    ├── blogs/     # 博客文章内容
    └── docs/      # 文档内容
```

## 开始使用

### 环境要求

- Node.js 18+ 或 Bun 1.0+
- npm/yarn/pnpm/bun

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install

# 使用 bun
bun install
```

### 开发环境

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev

# 使用 bun
bun dev
```

开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build

# 使用 pnpm
pnpm build

# 使用 bun
bun run build
```

### 启动生产服务器

```bash
# 使用 npm
npm run start

# 使用 yarn
yarn start

# 使用 pnpm
pnpm start

# 使用 bun
bun run start
```

## 主要功能

- 响应式设计
- Markdown 支持
- 代码高亮
- 图表渲染
- 动画效果
- 主题支持

## 开发指南

1. 项目使用 TypeScript 进行开发，确保类型安全
2. 使用 Tailwind CSS 进行样式开发
3. 遵循 Next.js 13+ 的 App Router 规范
4. 使用 ESLint 进行代码规范检查

## 部署

项目可以轻松部署到 Vercel 平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/linear-clone)

### Vercel 部署说明

1. 访问 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
2. 导入您的 GitHub 仓库
3. 配置项目设置：
   - 框架预设：Next.js
   - 构建命令：`npm run build` 或 `yarn build` 或 `pnpm build`
   - 输出目录：`.next`
   - 安装命令：`npm install` 或 `yarn install` 或 `pnpm install`
4. 点击部署按钮

部署完成后，Vercel 会自动为您的项目提供一个域名，您可以在项目设置中配置自定义域名。

更多部署详情，请参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT 