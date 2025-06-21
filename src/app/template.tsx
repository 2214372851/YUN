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
            <div id='loading-top' className='w-full h-[51vh] bg-white fixed z-50 top-0' style={{ transform: 'translateY(0)' }}></div>
            <div id='loading-fill' className='w-full bg-sky-400 fixed z-40 top-1/4 bottom-1/4' style={{ opacity: 1, transform: 'translateY(0)' }}></div>
            <div id='loading-bottom' className='w-full h-[51vh] bg-white fixed z-50 bottom-0' style={{ transform: 'translateY(0)' }}></div>
            {children}
        </div>
    )
}