"use client";

import {Button} from "./ui/button";
import {motion} from "framer-motion";
import Image from 'next/image';
import {TypeAnimation} from 'react-type-animation';
import TransitionLink from "@/components/TransitionLink";


function ProductDiagram() {
    const imageMap = [
        {
            src: "https://minio-endpoint.bybxbwg.fun/docs/ide.png",
            alt: "Ide",
        },
        {
            src: "https://minio-endpoint.bybxbwg.fun/docs/carwlsy.png",
            alt: "Carwlsy",
        },
        {
            src: "https://minio-endpoint.bybxbwg.fun/docs/node.png",
            alt: "Node",
        },
    ]
    return (
        <div
            className="relative flex flex-col items-center justify-center size-full pt-40"
        >
            {
                imageMap.map((image, index) => (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -200,
                            rotateX: 40,
                            rotateY: 10,
                            rotateZ: -20,
                            // translateX: index * 30,
                            // translateY: index * -40,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 40,
                            rotateY: 10,
                            rotateZ: -20,
                            translateX: index * 50,
                            translateY: index * -40,
                        }}
                        key={index}
                        exit={{opacity: 0, x: 0}} // 添加退出动画
                        transition={{duration: 1, exit: {duration: 1}, delay: !index ? 0 : index + 0.3}} // 为进入和退出动画设置时长
                        className={index ? "max-w-4xl mx-auto absolute bottom-13" : "max-w-4xl mx-auto"}
                    >
                        <Image
                            className="rounded-md"
                            width={800}
                            height={200}
                            src={image.src}
                            alt={image.alt}/>
                    </motion.div>
                ))
            }
        </div>
    )
}

export function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
            <motion.div
                initial={{opacity: 0, y: -100}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, x: 100}} // 添加退出动画
                transition={{duration: 2, exit: {duration: 1}}} // 为进入和退出动画设置时长
                className="max-w-4xl mx-auto"
            >
                <TypeAnimation
                    sequence={[
                        "Hi, I'm Yunhai",
                        1000,
                        'My whimsical thoughts',
                        1000,
                        'My Learning Journey',
                        1000
                    ]}
                    wrapper="h1"
                    cursor={true}
                    repeat={Infinity}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
                />
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    I hope the content here can help you
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" asChild className="px-8 py-6 text-base">
                        <TransitionLink href="/docs">Start reading</TransitionLink>
                    </Button>

                    <Button size="lg" variant="secondary" asChild className="px-8 py-6 text-base">
                        <TransitionLink href="/about" className="flex items-center gap-2">
                            <span>Introduce me</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </TransitionLink>
                    </Button>
                </div>
            </motion.div>

            <div className="h-[calc(100vh-128px)] w-full overflow-hidden">
                <ProductDiagram/>
            </div>

            {/* Moved this section out of absolute positioning and added margin */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8, delay: 0.3}}
                className="text-center mt-24"
            >
                <p className="text-sm text-muted-foreground mb-6">
                    There is no need to rush, no need to shine, no need to be anyone else just be yourself
                </p>
                <div className="flex flex-wrap justify-center gap-8 px-4 grayscale opacity-70">
                    {Array.from({length: 8}).map((_, index) => (
                        <div key={index} className="w-24 h-8 bg-gray-800 rounded"></div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
