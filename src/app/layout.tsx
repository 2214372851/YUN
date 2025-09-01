import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import React from "react";
import {Toaster} from "@/components/ui/toaster"
import {baseUrl, image, siteName} from '@/config/site';
import Script from "next/script";
import {ViewTransitions} from 'next-view-transitions'


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: siteName,
        template: `%s | ${siteName}`
    },
    description: `${siteName}，专注于技术文章、项目经验、生活点滴与云端分享。`,
    keywords: [siteName, "云海亦云", "技术博客", "前端开发", "全栈开发", "项目经验", "生活分享"],
    authors: [{name: siteName}],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: baseUrl,
    },
    openGraph: {
        title: siteName,
        description: `${siteName}，专注于技术文章、项目经验、生活点滴与云端分享。`,
        url: baseUrl,
        siteName: siteName,
        images: [
            {
                url: image,
                width: 800,
                height: 600,
            },
        ],
        locale: 'zh_CN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteName,
        description: `${siteName}，专注于技术文章、项目经验、生活点滴与云端分享。`,
        images: [image],
    },
    icons: {
        icon: image,
        apple: image,
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
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="zh-CN">
            {/* 网站监控脚本 */}
            <Script
                defer
                src="https://cloud.umami.is/script.js"
                data-website-id="e7012192-3cfd-4138-af60-453aa655c7f9"
            ></Script>
            <body className={inter.className}>
            <Navbar/>
            <Toaster/>
            <main className="min-h-screen">
                {children}
            </main>
            <Footer/>
            </body>
            </html>
        </ViewTransitions>
    );
}

export const dynamicParams = false