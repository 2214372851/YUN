import {getAnnouncement} from "@/data/announcement";
import TransitionLink from "@/components/TransitionLink";

export function Announcement() {
    const announcement = getAnnouncement();
    return (
        <div className="text-white p-4 pt-20 text-center flex justify-center">
            <TransitionLink href={announcement.link}>
                <div className="announcement rounded-full w-auto">
                    <div className="announcement-content py-1.5 px-8 rounded-full border ">
                        {announcement.content}
                    </div>
                </div>
            </TransitionLink>
        </div>
    );
}
