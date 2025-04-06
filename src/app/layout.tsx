import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import {LoadingOverlay} from "@/components/loading-overlay";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "YunHai",
    description: "YunHai的个人网站",
    icons: {
        icon: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.png',
        apple: 'https://minio-endpoint.bybxbwg.fun/docs/Avatar.png',
    }
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
