"use client"

import {useEffect} from "react";
import {animatePageIn} from "@/lib/utils";

export default function Template({children}: { children: React.ReactNode }) {
    useEffect(() => {
        animatePageIn()
    }, [])
    return children
}