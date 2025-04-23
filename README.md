# Linear Clone

A Next.js project that references Linear's design philosophy and user experience.

## Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Markdown Processing**: Marked, Remark
- **Code Highlighting**: Highlight.js
- **Charts**: Mermaid
- **Type System**: TypeScript

## Project Structure

```
src/
├── app/           # Next.js app directory
│   ├── about/     # About page
│   ├── blog/      # Blog pages
│   ├── contact/   # Contact page
│   ├── docs/      # Documentation pages
│   ├── media/     # Media resources
│   ├── test/      # Testing related
│   ├── tools/     # Tools pages
│   ├── layout.tsx # Root layout
│   ├── page.tsx   # Home page
│   ├── globals.css # Global styles
│   └── ClientBody.tsx # Client component
│
└── content/       # Content management
    ├── blogs/     # Blog content
    └── docs/      # Documentation content
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm/yarn/pnpm/bun

### Installation

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### Development

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

The development server will start at [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build

# Using bun
bun run build
```

### Start Production Server

```bash
# Using npm
npm run start

# Using yarn
yarn start

# Using pnpm
pnpm start

# Using bun
bun run start
```

## Key Features

- Responsive Design
- Markdown Support
  - Custom container support (`info` | `warning` | `tip` | `danger`)
     - Syntax: `::: danger :::`
  - Mermaid diagram support
- Code Highlighting
- Chart Rendering
- Animation Effects
- Theme Support

## Development Guidelines

1. Use TypeScript for type safety
2. Style with Tailwind CSS
3. Follow Next.js 13+ App Router conventions
4. Use ESLint for code quality

## Deployment

The project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/YUN)

### Vercel Deployment Guide

1. Visit [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` or `yarn build` or `pnpm build`
   - Output Directory: `.next`
   - Install Command: `npm install` or `yarn install` or `pnpm install`
4. Click Deploy

After deployment, Vercel will automatically provide a domain for your project. You can configure a custom domain in the project settings.

For more deployment details, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Issues and Pull Requests are welcome to help improve the project.

## License

MIT
