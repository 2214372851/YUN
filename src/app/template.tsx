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
            <div id='loading-progress' className='w-full h-[2px] bg-blue-400 fixed z-50 bottom-0'></div>
            {children}
        </div>
    )
}