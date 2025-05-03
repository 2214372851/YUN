"use client"

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {animatePageIn} from "@/lib/utils";
import Orb from "@/components/orb";

export default function Template({children}: {children: React.ReactNode}) {
    const pathname = usePathname()
    useEffect(()=>{
        animatePageIn()
    }, [pathname])
    return (
        <div>
            <div id="banner" className="min-h-screen bg-black/80 backdrop-blur-md z-50 fixed top-0 left-0 w-full h-full">
                <Orb/>
            </div>
            {children}
        </div>
    )
}