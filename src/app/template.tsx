"use client"

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {animatePageIn} from "@/lib/utils";

export default function Template({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    useEffect(() => {
        if (!pathname.startsWith('/docs')){
            animatePageIn()
        }
    }, [pathname])
    return (
        <div>
            <div id="banner-1" className="min-h-screen bg-[#1D4ABC] z-50 fixed top-0 left-0 w-[10%] h-full"/>
            <div id="banner-2" className="min-h-screen bg-[#020077] z-50 fixed top-0 left-[10%] w-[10%] h-full"/>
            <div id="banner-3" className="min-h-screen bg-[#193DAD] z-50 fixed top-0 left-[20%] w-[10%] h-full"/>
            <div id="banner-4" className="min-h-screen bg-[#A96ACF] z-50 fixed top-0 left-[30%] w-[10%] h-full"/>
            <div id="banner-5" className="min-h-screen bg-[#FA7B80] z-50 fixed top-0 left-[40%] w-[10%] h-full"/>
            <div id="banner-6" className="min-h-screen bg-[#FECB92] z-50 fixed top-0 left-[50%] w-[10%] h-full"/>
            <div id="banner-7" className="min-h-screen bg-[#3260CB] z-50 fixed top-0 left-[60%] w-[10%] h-full"/>
            <div id="banner-8" className="min-h-screen bg-[#CE71B2] z-50 fixed top-0 left-[70%] w-[10%] h-full"/>
            <div id="banner-9" className="min-h-screen bg-[#7066D4] z-50 fixed top-0 left-[80%] w-[10%] h-full"/>
            <div id="banner-10" className="min-h-screen bg-[#0C299B] z-50 fixed top-0 left-[90%] w-[10%] h-full"/>
            {children}
        </div>
    )
}