"use client";

import {Button} from "./ui/button";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import Image from 'next/image';
import {useState} from 'react';
import {Menu, X} from 'lucide-react';
import TransitionLink from "@/components/TransitionLink";

const navLinks = [
    {href: "/", text: ""},
    {href: "/blog/", text: "Blog"},
    {href: "/docs/", text: "Document"},
    {href: "/tools/", text: "Tools"},
    {href: "/media/", text: "Music"},
    {href: "/contact/", text: "Contact"},
    {href: "/about/", text: "About"},
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

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
                <TransitionLink href="/" className="flex items-center gap-2">
                    <Image
                        src="https://minio-endpoint.bybxbwg.fun/docs/Avatar.webp"
                        alt="头像"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                    />
                    <span className="font-semibold">YunHai</span>
                </TransitionLink>
                <nav className="hidden md:flex gap-5">
                    {navLinks.map((link) => (
                        <TransitionLink
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm transition-colors hover:text-white",
                                pathname === link.href ? "text-white" : "text-gray-400"
                            )}
                        >
                            {link.text}
                        </TransitionLink>
                    ))}
                </nav>
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
                                <TransitionLink
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "py-2 text-sm transition-colors hover:text-white",
                                        pathname === link.href ? "text-white" : "text-gray-400"
                                    )}
                                    callback={mobileHandleClick}
                                >
                                    {link.text}
                                </TransitionLink>
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
