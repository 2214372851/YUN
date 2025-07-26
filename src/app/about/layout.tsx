import { siteName, image } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `关于 | ${siteName}`,
    description: `${siteName} 个人介绍与联系方式`,
    openGraph: {
        title: `关于 | ${siteName}`,
        description: `${siteName} 个人介绍与联系方式`,
        images: [image],
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}

