"use client"
import {usePathname, useRouter} from "next/navigation";
import {animatePageOut} from "@/lib/utils";

interface Props {
    href: string
    className?: string
    children?: React.ReactNode
}

const TransitionLink = ({href, className, children}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = () => {
        console.log(pathname, href)
        if (pathname === href) {
            return
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