# YunHai 部署指南

本文档提供了部署 YunHai 个人网站的详细说明，包括本地开发环境设置和生产环境部署。YunHai 是一个基于 Next.js 构建的静态导出个人网站，可部署在各种静态网站托管服务上。

## 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [生产环境部署](#生产环境部署)
  - [传统服务器部署](#传统服务器部署)
  - [Vercel 部署](#vercel-部署)
  - [Docker 部署](#docker-部署)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## 环境要求

在开始部署前，请确保您的系统满足以下要求：

- **Node.js**: 18.0.0 或更高版本
- **包管理器**: npm、yarn、pnpm 或 bun
- **Git**: 用于版本控制和部署

您可以使用以下命令检查您的 Node.js 版本：

```bash
node -v
```

## 本地开发

### 1. 克隆代码库

```bash
git clone https://github.com/your-username/YUN.git
cd YUN
```

### 2. 安装依赖

选择您喜欢的包管理器安装依赖：

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

### 3. 启动开发服务器

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

## 生产环境部署

> **注意**：当前项目配置为静态导出（`output: 'export'`），适合部署到静态网站托管服务。以下部署方法可能需要根据实际情况调整。

### 传统服务器部署

#### 1. 构建项目

在您的本地机器或CI/CD环境中构建项目：

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

#### 2. 生成站点地图（可选）

```bash
# 使用 npm
npm run sitemap-build

# 使用 yarn
yarn sitemap-build

# 使用 pnpm
pnpm sitemap-build

# 使用 bun
bun run sitemap-build
```

#### 3. 将构建文件部署到服务器

由于项目配置为静态导出，构建后会生成 `out/` 目录。将以下文件和目录复制到您的服务器：

- `out/` (包含所有静态文件)

如果您修改了配置使用 `standalone` 输出，则需要复制：

- `.next/`
- `public/`
- `package.json`
- `next.config.mjs`

#### 4. 部署静态文件

对于静态导出（`output: 'export'`），您只需要一个静态文件服务器来托管 `out/` 目录中的文件。

##### 使用 Nginx

```bash
# Nginx 配置示例
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/out;
    index index.html;
    
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

##### 使用 Apache

创建 `.htaccess` 文件：

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

#### 5. 服务器端渲染部署（如果修改为 SSR 模式）

如果您将 `next.config.mjs` 中的 `output` 配置修改为 `standalone` 或移除，需要在服务器上安装依赖并启动 Next.js 服务器：

```bash
# 安装依赖
npm install --production

# 启动生产服务器
npm run start
```

默认情况下，服务器将在端口 3000 上运行。您可以通过设置 `PORT` 环境变量来更改端口：

```bash
PORT=8080 npm run start
```

##### 使用进程管理器（推荐）

对于服务器端渲染模式，推荐使用 PM2 等进程管理器来保持应用程序运行：

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "yunhai" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### Vercel 部署

Vercel 是部署 Next.js 应用最简单的方式，并且完全支持静态导出模式：

1. 访问 [Vercel 平台](https://vercel.com/new)
2. 导入您的 GitHub 仓库
3. 配置项目设置：
   - 框架预设：Next.js
   - 构建命令：`npm run build` 或 `yarn build` 或 `pnpm build`
   - 输出目录：`out` (对于静态导出模式)
   - 安装命令：`npm install` 或 `yarn install` 或 `pnpm install`
4. 点击"部署"

部署后，Vercel 将自动为您的项目提供一个域名。您可以在项目设置中配置自定义域名。

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/YUN)

### Netlify 部署

Netlify 也是一个很好的静态网站托管选择：

1. 访问 [Netlify](https://app.netlify.com/)
2. 点击"New site from Git"
3. 选择您的 Git 提供商并授权 Netlify
4. 选择您的仓库
5. 配置构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`out`
6. 点击"Deploy site"

### GitHub Pages 部署

您也可以使用 GitHub Pages 托管您的静态网站：

1. 在 `package.json` 中添加部署脚本：

```json
"scripts": {
  "deploy": "next build && touch out/.nojekyll && gh-pages -d out -t true"
}
```

2. 安装 gh-pages 包：

```bash
npm install --save-dev gh-pages
```

3. 运行部署命令：

```bash
npm run deploy
```

4. 在 GitHub 仓库设置中，配置 GitHub Pages 使用 `gh-pages` 分支

### Docker 部署

> **注意**：由于当前项目配置为静态导出（`output: 'export'`），以下 Docker 部署方法已针对静态网站托管进行了调整。

#### 1. 创建 Dockerfile

##### 用于静态导出的 Dockerfile

对于静态导出，您可以使用 Nginx 来托管静态文件：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f bun.lock ]; then yarn global add bun && bun install; \
  else echo "Lockfile not found." && exit 1; \
  fi
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf` 文件：

```
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

##### 用于服务器端渲染的 Dockerfile（如果修改配置）

如果您将配置修改为服务器端渲染模式，可以使用以下 Dockerfile：

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock* package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f bun.lock ]; then yarn global add bun && bun install; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 修改 next.config.mjs 以使用 standalone 输出
RUN sed -i 's/output: .export./output: .standalone./' next.config.mjs
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. 更新 next.config.mjs

注意：当前项目的 `next.config.mjs` 文件使用 `output: 'export'` 配置用于静态导出。如果您想使用 Docker 部署，需要将其更改为 `output: 'standalone'`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 保留其他配置...
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {}
  }
};

export default nextConfig;
```

#### 3. 构建和运行 Docker 镜像

##### 静态导出模式

```bash
# 构建镜像
docker build -t yunhai-static -f Dockerfile.static .

# 运行容器
docker run -p 80:80 yunhai-static
```

##### 服务器端渲染模式（如果修改配置）

```bash
# 构建镜像
docker build -t yunhai-ssr -f Dockerfile.ssr .

# 运行容器
docker run -p 3000:3000 yunhai-ssr
```

## 环境变量配置

您可以通过环境变量自定义应用程序的行为。创建一个 `.env.local` 文件（用于本地开发）或在生产环境中设置环境变量：

```
# 示例环境变量
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

对于 Vercel 部署，您可以在 Vercel 项目设置中的"Environment Variables"部分配置这些变量。

## 常见问题

### 1. 构建失败

如果构建过程失败，请检查：

- Node.js 版本是否满足要求（18+）
- 所有依赖项是否正确安装
- 是否有语法错误或类型错误

### 2. 页面加载缓慢

如果页面加载速度慢，可以考虑：

- 启用图像优化
- 实现增量静态再生成 (ISR)
- 使用 CDN 分发静态资源

### 3. 自定义域名配置

对于 Vercel 部署，您可以在项目设置中的"Domains"部分添加自定义域名。按照 Vercel 提供的说明更新您的 DNS 记录。

### 4. 内容更新

如果您需要更新网站内容，可以：

1. 修改 `src/content/` 目录下的相关文件
2. 提交更改到 Git 仓库
3. 重新部署应用程序

对于静态内容更改，您可能需要重新构建应用程序。 