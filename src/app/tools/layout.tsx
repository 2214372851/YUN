import { siteName, image } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `工具`,
    description: `一些推荐或自建的实用工具与网站`,
    openGraph: {
        title: `工具 | ${siteName}`,
        description: `一些推荐或自建的实用工具与网站`,
        images: [image],
    },
    twitter: {
        title: `工具 | ${siteName}`,
        description: `一些推荐或自建的实用工具与网站`,
        images: [image],
    },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return children;
}

