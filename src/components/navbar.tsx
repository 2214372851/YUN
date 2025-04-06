"use client";

import Link from "next/link";
import {Button} from "./ui/button";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    {href: "/", text: ""},
    {href: "/blog", text: "博客"},
    {href: "/docs", text: "文档"},
    {href: "/tools", text: "工具"},
    {href: "/media", text: "音乐"},
    {href: "/about", text: "关于"},
    {href: "/contact", text: "联系"},
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 h-16 py-3 bg-background/50 backdrop-blur-md border-b border-white/5"> {/* Added h-16 for consistent height */}
            {/* Container: Relative for positioning button, center on mobile, space-between on desktop */}
            <div className="container max-w-7xl mx-auto px-4 relative flex items-center justify-center md:justify-between h-full">
                {/* Logo Link - Centered on mobile via container justify-center */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="https://minio-endpoint.bybxbwg.fun/docs/Avatar.png"
                        alt="头像"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                    />
                    <span className="font-semibold">YunHai</span>
                </Link>
                <nav className="hidden md:flex gap-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm transition-colors hover:text-white",
                        pathname === link.href ? "text-white" : "text-gray-400"
                      )}
                    >
                      {link.text}
                    </Link>
                  ))}
                </nav>
                {/* Mobile Menu Button: Positioned absolutely on mobile */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-400 hover:text-white"
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>

                {isOpen && (
                  <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/5 md:hidden">
                    <div className="flex flex-col px-4 py-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "py-2 text-sm transition-colors hover:text-white",
                            pathname === link.href ? "text-white" : "text-gray-400"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {/* Removed the extra wrapping div around logo and desktop nav */}
            </div> {/* End of container div */}
        </header>
    );
}
