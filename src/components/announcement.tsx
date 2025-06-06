"use client";

import {getAnnouncement} from "@/data/announcement";
import TransitionLink from "@/components/TransitionLink";
import {motion} from "framer-motion";


export function Announcement() {
    const announcement = getAnnouncement();
    return (
        <motion.div
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{duration: 0.5, delay: 1}}
            viewport={{once: true}}
            className="text-white p-4 pt-20 text-center flex justify-center">
            <TransitionLink href={announcement.link}>
                <div className="announcement rounded-full w-auto">
                    <div className="announcement-content py-1.5 px-8 rounded-full border ">
                        {announcement.content}
                    </div>
                </div>
            </TransitionLink>
        </motion.div>
    );
}
