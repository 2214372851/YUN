import Image from "next/image";
import {useEffect, useRef} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

export default function SlideHorizontallyPage() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardBoxRef = useRef<HTMLDivElement>(null);
    const distanceRef = useRef(0);
    const isLeaveRef = useRef(false); // 用 useRef 替代 let isLeave

    useEffect(() => {
        const resize = () => {

            if (!cardBoxRef.current || !wrapperRef.current) {
                console.log("resize cardBoxRef or wrapperRef is not defined");
                return
            }
            distanceRef.current = cardBoxRef.current.scrollWidth - innerWidth * 0.75; // 修改为 distanceRef.current
            wrapperRef.current.style.height = cardBoxRef.current.scrollWidth + "px";
            if (isLeaveRef.current) { // 修改为 isLeaveRef.current
                cardBoxRef.current.style.transform = `translateX(-${distanceRef.current}px)`; // 修改为 distanceRef.current
            }
        }

        const createScrollTrigger = () => {
            if (wrapperRef.current && cardBoxRef.current) {
                gsap.registerPlugin(ScrollTrigger);

                ScrollTrigger.create({
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    onUpdate: (self) => {
                        if (cardBoxRef.current) {
                            cardBoxRef.current.style.transform = `translateX(-${self.progress * distanceRef.current}px)`; // 修改为 distanceRef.current
                        }
                    },
                    onLeave: () => {
                        isLeaveRef.current = true; // 修改为 isLeaveRef.current
                    },
                    onEnterBack: () => {
                        isLeaveRef.current = false; // 修改为 isLeaveRef.current
                    }
                })
            }
        }
        resize();
        createScrollTrigger();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);


    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="sticky top-[64px] flex items-center w-full h-screen overflow-hidden">
                <div ref={cardBoxRef} className="flex h-full items-center">
                    {
                        new Array(20).fill(0).map((_, i) => (
                            <div key={i}
                                 className="p-1 rounded-lg overflow-hidden flex justify-center items-center w-1/3 h-1/2 m-[40px] text-white bg-white flex-shrink-0">
                                <Image
                                    src="https://minio-endpoint.yhnotes.com/docs/卡提希娅.png"
                                    alt="卡提希娅"
                                    width={20}
                                    height={20}
                                    className="size-full rounded-lg"/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}