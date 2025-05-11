"use client"
import {usePathname, useRouter} from "next/navigation";
import {animatePageOut} from "@/lib/utils";

interface Props {
    href: string
    className?: string
    children?: React.ReactNode
    callback?: () => void
}

const TransitionLink = ({href, className, children, callback}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = () => {
        if (pathname === href) {
            return
        }
        if (callback) {
            callback()
        }
        animatePageOut(href, router)
    }

    return (
        <div
            className={`${className} hover:cursor-pointer`}
            onClick={handleClick}
        >
            {children}
        </div>

    )
}

export default TransitionLink