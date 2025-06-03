import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import gsap from "gsap"
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function animatePageIn() {
    const banner1 = document.getElementById("banner-1")
    const banner2 = document.getElementById("banner-2")
    const banner3 = document.getElementById("banner-3")
    const banner4 = document.getElementById("banner-4")
    const banner5 = document.getElementById("banner-5")
    const banner6 = document.getElementById("banner-6")
    const banner7 = document.getElementById("banner-7")
    const banner8 = document.getElementById("banner-8")
    const banner9 = document.getElementById("banner-9")
    const banner10 = document.getElementById("banner-10")

    if (banner1 && banner2 && banner3 && banner4 && banner5 && banner6 && banner7 && banner8 && banner9 && banner10) {
        const tl = gsap.timeline()
        tl.set([banner1, banner2, banner3, banner4, banner5,  banner6,  banner7, banner8, banner9, banner10], {
            yPercent: 0
        }).to([banner1, banner2, banner3, banner4, banner5,  banner6,  banner7, banner8, banner9, banner10], {
            yPercent: 100,
            stagger: 0.1
        })
    }
}

export function animatePageOut(href: string, router: AppRouterInstance) {
    const banner1 = document.getElementById("banner-1")
    const banner2 = document.getElementById("banner-2")
    const banner3 = document.getElementById("banner-3")
    const banner4 = document.getElementById("banner-4")
    const banner5 = document.getElementById("banner-5")
    const banner6 = document.getElementById("banner-6")
    const banner7 = document.getElementById("banner-7")
    const banner8 = document.getElementById("banner-8")
    const banner9 = document.getElementById("banner-9")
    const banner10 = document.getElementById("banner-10")

    if (banner1 && banner2 && banner3 && banner4 && banner5 && banner6 && banner7 && banner8 && banner9 && banner10) {
        const tl = gsap.timeline()
        tl.set([banner1, banner2, banner3, banner4,  banner5,  banner6, banner7, banner8, banner9, banner10], {
            yPercent: -100,
        }).to([banner1, banner2, banner3, banner4,  banner5,  banner6,  banner7, banner8, banner9, banner10], {
            yPercent: 0,
            stagger: 0.1,
            onComplete: () => {
                router.push(href)
            },
        })
    }
}