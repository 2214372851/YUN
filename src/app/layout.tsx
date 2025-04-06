import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import {LoadingOverlay} from "@/components/loading-overlay";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "YunHai - 个人网站",
        template: "%s | YunHai"
    },
    description: "YunHai的个人网站，分享技术文章、项目经验和生活点滴",
    keywords: ["YunHai", "个人网站", "技术博客", "前端开发", "全栈开发"],
    authors: [{ name: "YunHai" }],
    creator: "YunHai",
    publisher: "YunHai",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://your-domain.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "YunHai - 个人网站",
        description: "YunHai的个人网站，分享技术文章、项目经验和生活点滴",
        url: 'https://your-domain.com',
        siteName: 'YunHai',
        images: [
            {
                url: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.png',
                width: 800,
                height: 600,
            },
        ],
        locale: 'zh_CN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "YunHai - 个人网站",
        description: "YunHai的个人网站，分享技术文章、项目经验和生活点滴",
        images: ['https://minio-endpoint.bybxbwg.fun/docs/Avatar.png'],
    },
    icons: {
        icon: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.png',
        apple: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.png',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-site-verification',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
        <body className={inter.className}>
        <Navbar/>
        {children}
        <Footer/>
        <LoadingOverlay />
        </body>
        </html>
    );
}
