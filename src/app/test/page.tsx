"use client";

import {useEffect, useRef} from "react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import gsap from "gsap";

function TestPage() {

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
        <div className="main pt-32">
            <div className="flex items-center justify-between mb-16">
                <h1 className="text-4xl font-bold">探索 · 测试</h1>
            </div>
            <div className="mt-2 text-3xl mb-10">横向滑动</div>

            <div ref={wrapperRef} className="relative w-full">
                <div className="sticky top-[64px] flex items-center w-full h-screen overflow-hidden bg-red-400/20">
                    <div ref={cardBoxRef} className="flex h-full items-center">
                        {
                            new Array(20).fill(0).map((_, i) => (
                                <div key={i}
                                     className="flex justify-center items-center w-1/3 h-1/2 m-[40px] text-white bg-black/50 flex-shrink-0">
                                    text {i}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="h-[60rem] bg-white/30 mt-2">test3</div>
        </div>
    );
}

export default TestPage;