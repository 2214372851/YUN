"use client"
import {usePathname, useRouter} from "next/navigation";

interface Props {
    href: string
    id?: string
    className?: string
    children?: React.ReactNode
    callback?: () => void
}

const TransitionLink = ({id, href, className, children, callback}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = () => {
        if (pathname === href) {
            return
        }
        if (callback) {
            callback()
        }
        router.push(href)
    }

    return (
        <div
            id={id}
            className={`${className} hover:cursor-pointer`}
            onClick={handleClick}
        >
            {children}
        </div>

    )
}

export default TransitionLink