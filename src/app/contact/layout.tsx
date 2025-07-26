import { siteName, image } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `联系 | ${siteName}`,
    description: `通过本页面联系 ${siteName}`,
    openGraph: {
        title: `联系 | ${siteName}`,
        description: `通过本页面联系 ${siteName}`,
        images: [image],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}

