import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import gsap from "gsap"
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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