import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import gsap from "gsap"
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function animatePageIn() {
    const banner = document.getElementById("banner")
    if (banner) {
        const tl = gsap.timeline()
        tl.set([banner], {
            opacity: 1,
            visibility: "visible",
        }).to([banner], {
            opacity: 0.1,
            duration: 1.5,
            onComplete: () => {
                banner.style.visibility = "hidden"
            },
        })
    }
}

export function animatePageOut(href: string, router: AppRouterInstance) {
    const banner = document.getElementById("banner")

    if (banner) {
        const tl = gsap.timeline()
        tl.set([banner], {
            opacity: 0,
            visibility: "visible",
        }).to([banner], {
            opacity: 1,
            stagger: 0.2,
            visibility: "visible",
            onComplete: () => {
                router.push(href)
            },
        })
    }
}