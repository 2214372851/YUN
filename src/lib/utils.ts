import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import gsap from "gsap"
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function animatePageIn() {
    const loadingTop = document.getElementById("loading-progress")

    if (loadingTop) {
        const tl = gsap.timeline();
        
        // 首先确保元素在正确的初始位置
        tl.to([loadingTop], {
            width: "100%",
            opacity: 1
        });
        tl.to([loadingTop], {
            opacity: 0,
            duration: 0.2
        })
    }
}

export function animatePageOut(href: string, router: AppRouterInstance) {
    const loadingTop = document.getElementById("loading-progress")

    if (loadingTop) {
        const tl = gsap.timeline();
        
        // 1. 先重置元素位置和状态，确保无论前置状态如何，元素都在正确的起始位置
        tl.set(loadingTop, {
            width: "0%",
            opacity: 1
        }).to(loadingTop, {
            width: "50%",
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                // 4. 动画完成后跳转到新页面
                router.push(href);
            }
        });
    } else {
        // 如果元素不存在，直接跳转
        router.push(href);
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