"use client";

import Link from "next/link";
import {Separator} from "./ui/separator";

const footerLinks = [
    {
        title: "Service",
        links: [
            {href: "https://ai.bybxbwg.fun", label: "Open WebUI"},
            {href: "https://minio-console.bybxbwg.fun/", label: "OSS"},
            {href: "https://uptime.bybxbwg.fun/status/aliyun", label: "Service Status"},
            {href: "https://status.bybxbwg.fun/", label: "Server Status"},
        ],
    },
    {
        title: "Project",
        links: [
            {href: "https://github.com/2214372851/D0-Tools", label: "D0 Tools"},
            {href: "https://github.com/2214372851/naive-for-qt", label: "Naive for Qt"},
            {href: "https://github.com/2214372851/job_hive", label: "Job Hive"},
            {href: "https://github.com/2214372851/crawlsy", label: "Crawlsy"},
            {href: "https://github.com/2214372851/yundownload", label: "Yundownload"},
            {href: "https://github.com/2214372851/YunChat", label: "Yun Chat"},
        ],
    },
    {
        title: "Resource",
        links: [
            {href: "", label: "API"},
        ],
    },
    {
        title: "Contact",
        links: [
            {href: "https://github.com/2214372851", label: "GitHub"},
            {href: "https://gitee.com/yun2hai", label: "Gitee"},
            {href: "mailto:bybxbwg@foxmail.com", label: "Email"},
        ],
    },
    {
        title: "Help",
        links: [
            {href: "/contact", label: "Support"},
        ]
    },
];

export function Footer() {
    return (
        <footer className="pb-16 pt-24 px-4 border-t border-white/5">
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-medium mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="bg-white/5 mb-8"/>

                <div className="text-sm text-muted-foreground flex justify-between">
                    <p>© 2025 YunHai. All rights reserved.</p>
                    <p>Sharing Agreement&nbsp;
                        <Link
                            className="hover:text-blue-400"
                            href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en">
                            (CC BY-NC-SA 4.0)
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
