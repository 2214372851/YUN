"use client";

import {Button} from "./ui/button";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import Image from 'next/image';
import {useRef, useState} from 'react';
import {Menu, X} from 'lucide-react';
import {Link} from "next-view-transitions"
// import Link from "@/components/Link";
import {STORAGE_HOST} from "@/data/baseUrl";
import {Command} from "@/components/command";

const navLinks = [
    {href: "/blog/", text: "Blog"},
    {href: "/docs/", text: "Document"},
    {
        href: null,
        text: "Explore",
        children: [
            {
                title: "Tools",
                href: "/tools/",
                description: "Powerful tools for efficient development"
            },
            {
                title: "Share",
                href: "/share/",
                description: "Share easily, collaborate happily"
            },
            {
                title: "API",
                href: "/api/",
                description: "Explore our API, integrate with ease"
            },
            {
                title: "Music",
                href: "/media/",
                description: "Discover great music and enjoy it"
            },
            {
                title: "Test",
                href: "/test/",
                description: "Testing can be fun too"
            },
        ]
    },
    {href: "/contact/", text: "Contact"},
    {href: "/about/", text: "About"},
];


export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
    const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (linkText: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredDropdown(linkText);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredDropdown(null);
        }, 150); // 150ms延迟
    };

    const mobileHandleClick = () => {
        setIsOpen(false);
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 h-16 py-3 bg-background/50 backdrop-blur-md border-b border-white/5"> {/* Added h-16 for consistent height */}
            {/* Container: Relative for positioning button, center on mobile, space-between on desktop */}
            <div
                className="container max-w-7xl mx-auto px-4 relative flex items-center justify-center md:justify-between h-full">
                {/* Logo Link - Centered on mobile via container justify-center */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={`${STORAGE_HOST}/docs/Avatar.webp`}
                        alt="YunHai Logo"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                    />
                    <span className="font-semibold">YunHai</span>
                </Link>
                <nav className="hidden md:flex gap-2 items-center">
                    {navLinks.map((link) => (
                        link.children ? (
                            <div
                                key={link.text}
                                className="relative text-sm transition-colors hover:text-white"
                                onMouseEnter={() => handleMouseEnter(link.text)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span
                                    className={cn(
                                        "text-sm transition-colors hover:text-white cursor-pointer flex items-center gap-1 hover:bg-[rgba(255,255,255,0.05)] py-1 px-2 rounded-md min-h-[32px]",
                                        link.children.some(child => pathname === child.href) ? "text-white" : "text-gray-400"
                                    )}
                                >
                                    {link.text}
                                </span>
                                {/* 下拉菜单 */}
                                <div
                                    className={cn(
                                        "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[60vw] bg-background/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50 transition-all duration-150 p-2",
                                        hoveredDropdown === link.text ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                    )}
                                    onMouseEnter={() => handleMouseEnter(link.text)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="grid grid-cols-3 gap-6 bg-[#151617] rounded-md p-4">
                                        {link.children.map(child => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "block p-4 rounded-md hover:bg-white/5 transition-colors group",
                                                    pathname === child.href ? "bg-white/10" : ""
                                                )}
                                            >
                                                <div
                                                    className="font-medium text-white mb-2 group-hover:text-white transition-colors">
                                                    {child.title}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                                    {child.description}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm transition-colors hover:text-white hover:bg-[rgba(255,255,255,0.05)] py-1 px-4 rounded-md",
                                    pathname === link.href ? "text-white" : "text-gray-400"
                                )}
                            >
                                {link.text}
                            </Link>
                        )
                    ))}
                </nav>

                {/* GitHub Icon */}
                <div className="flex gap-3">
                    <div className="hidden md:flex items-center">
                        <Command />
                    </div>
                    <div className="hidden md:flex items-center">
                        <a
                            href="https://github.com/2214372851"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/5"
                        >
                            <Image src="/github-mark-white.svg" alt="github" width={5} height={5}
                                   className="size-5"></Image>
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button: Positioned absolutely on mobile */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-400 hover:text-white hover:bg-[#393e46]"
                    >
                        {isOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                    </Button>
                </div>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/5 md:hidden">
                        <div className="flex flex-col px-4 py-2">
                            {navLinks.map((link) => (
                                link.children ? (
                                    <div key={link.text}>
                                        <button
                                            className={cn(
                                                "py-2 text-sm w-full text-left flex items-center gap-1 transition-colors hover:text-white focus:outline-none",
                                                link.children.some(child => pathname === child.href) ? "text-white" : "text-gray-400"
                                            )}
                                            onClick={() => setOpenMobileDropdown(openMobileDropdown === link.text ? null : link.text)}
                                        >
                                            {link.text}
                                            <svg
                                                className={cn("w-3 h-3 ml-1 transition-transform", openMobileDropdown === link.text ? "rotate-180" : "")}
                                                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </button>
                                        {openMobileDropdown === link.text && (
                                            <div className="pl-4">
                                                {link.children.map(child => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={cn(
                                                            "block py-2 text-sm transition-colors hover:text-white",
                                                            pathname === child.href ? "text-white" : "text-gray-400"
                                                        )}
                                                        onClick={mobileHandleClick}
                                                    >
                                                        <div className="font-medium">{child.title}</div>
                                                        <div
                                                            className="text-xs text-gray-500 mt-1">{child.description}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "py-2 text-sm transition-colors hover:text-white",
                                            pathname === link.href ? "text-white" : "text-gray-400"
                                        )}
                                        onClick={mobileHandleClick}
                                    >
                                        {link.text}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
                )}
                {/* Removed the extra wrapping div around logo and desktop nav */}
            </div>
            {/* End of container div */}
        </header>
    );
}
