import { siteName, image } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `共享`,
    description: `将你的静态网页免费托管在该站点，从而可以通过链接分享给他人。`,
    openGraph: {
        title: `共享 | ${siteName}`,
        description: `将你的静态网页免费托管在该站点，从而可以通过链接分享给他人。`,
        images: [image],
    },
    twitter: {
        title: `共享 | ${siteName}`,
        description: `将你的静态网页免费托管在该站点，从而可以通过链接分享给他人。`,
        images: [image],
    },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
    return children;
}

