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
        tl.set([banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10], {
            yPercent: 0
        }).to([banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10], {
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
        tl.set([banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10], {
            yPercent: -100,
        }).to([banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10], {
            yPercent: 0,
            stagger: 0.1,
            onComplete: () => {
                router.push(href)
            },
        })
    }
}

export function darkenIfNearWhite(hexColor: string, factor = 0.7, threshold = 200) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 判断是否接近白色
    if (r >= threshold && g >= threshold && b >= threshold) {
        // 变暗处理
        const nr = Math.max(Math.min(Math.floor(r * factor), 255), 0);
        const ng = Math.max(Math.min(Math.floor(g * factor), 255), 0);
        const nb = Math.max(Math.min(Math.floor(b * factor), 255), 0);

        const toHex: (n: number) => string = n => n.toString(16).padStart(2, '0');
        return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
    } else {
        // 非接近白色，保持原色
        return hexColor;
    }
}