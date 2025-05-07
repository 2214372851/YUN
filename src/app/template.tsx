"use client"

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {animatePageIn} from "@/lib/utils";

export default function Template({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    useEffect(() => {
        animatePageIn()
    }, [pathname])
    return (
        <div>
            <div id="banner-1" className="min-h-screen bg-[rgb(173,172,170)] z-50 fixed top-0 left-0/4 w-1/4 h-full"/>
            <div id="banner-2" className="min-h-screen bg-[rgb(173,172,170)] z-50 fixed top-0 left-1/4 w-1/4 h-full"/>
            <div id="banner-3" className="min-h-screen bg-[rgb(173,172,170)] z-50 fixed top-0 left-2/4 w-1/4 h-full"/>
            <div id="banner-4" className="min-h-screen bg-[rgb(173,172,170)] z-50 fixed top-0 left-3/4 w-1/4 h-full"/>
            {children}
        </div>
    )
}