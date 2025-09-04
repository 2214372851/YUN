"use client";

import {getAnnouncement} from "@/data/announcement";
import {Link} from "next-view-transitions"
import {motion} from "framer-motion";


export function Announcement() {
    const announcement = getAnnouncement();
    return (
        <div className="relative flex justify-center z-20 max-w-3/4">
            <motion.div
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                transition={{duration: 0.5, delay: 1}}
                viewport={{once: true}}
                className="text-white p-4 pt-20 text-center flex justify-center px-4 absolute top-0">
                <Link href={announcement.link}>
                    <div className="announcement rounded-full w-auto max-w-[90vw] md:max-w-none">
                        {/*不能换行，变省略*/}
                        <div className="announcement-content py-1.5 px-4 md:px-8 rounded-full border text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                            {announcement.content}
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
