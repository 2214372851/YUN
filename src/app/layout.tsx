import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import React from "react";
import {Toaster} from "@/components/ui/toaster"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: "YunHai",
        template: "%s | YunHai"
    },
    description: "YunHai，分享技术文章、项目经验和生活点滴",
    keywords: ["YunHai", "技术博客", "前端开发", "全栈开发"],
    authors: [{name: "YunHai"}],
    creator: "YunHai",
    publisher: "YunHai",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://bybxbwg.fun'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "YunHai - 云海亦云",
        description: "YunHai的网站，分享技术文章、项目经验和生活点滴",
        url: 'https://bybxbwg.fun',
        siteName: 'YunHai',
        images: [
            {
                url: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp',
                width: 800,
                height: 600,
            },
        ],
        locale: 'zh_CN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "YunHai - 云海亦云",
        description: "YunHai的网站，分享技术文章、项目经验和生活点滴",
        images: ['https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp'],
    },
    icons: {
        icon: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp',
        apple: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp',
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
        <Toaster />
        {children}
        <Footer/>
        </body>
        </html>
    );
}
