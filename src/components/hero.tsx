"use client";

import {Button} from "./ui/button";
import {motion} from "framer-motion";
import Image from 'next/image';
import {TypeAnimation} from 'react-type-animation';
import {Link} from "next-view-transitions"
import {STORAGE_HOST} from "@/data/baseUrl";
import Particles from "@/components/blocks/Backgrounds/Particles/Particles";


function ProductDiagram() {
    const imageMap = [
        {
            src: `${STORAGE_HOST}/docs/ide.png`,
            alt: "Ide",
        },
        {
            src: `${STORAGE_HOST}/docs/carwlsy.png`,
            alt: "Carwlsy",
        },
        {
            src: `${STORAGE_HOST}/docs/node.png`,
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
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            rotateX: 40,
                            rotateY: 10,
                            rotateZ: -20,
                            translateX: index * 50,
                            translateY: index * -40,
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        key={index}
                        exit={{opacity: 0, x: 0}} // 添加退出动画
                        transition={{duration: 1, delay: !index ? 0 : index + 0.3}} // 为进入和退出动画设置时长
                        className={index ? "max-w-4xl mx-auto absolute bottom-13" : "max-w-4xl mx-auto"}
                    >
                        <Image
                            className="rounded-md"
                            priority={true}
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
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-10 pb-24">
            <motion.div
                initial={{opacity: 0, y: -100}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, x: 100}} // 添加退出动画
                transition={{duration: 2}} // 为进入和退出动画设置时长
                className="w-full mx-auto relative min-h-screen h-fit flex flex-col justify-center"
            >
                <div className="absolute size-full z-0">
                    <Particles
                        particleColors={['#ffffff', '#ffffff']}
                        particleCount={150}
                        particleSpread={10}
                        speed={0.1}
                        particleBaseSize={100}
                        moveParticlesOnHover={false}
                        alphaParticles={false}
                        disableRotation={false}
                    />
                </div>

                <div className="z-10">
                    <TypeAnimation
                        sequence={[
                            "Hi, I'm Yunhai",
                            1000,
                            'Tech for life',
                            1000,
                            'Keep exploring',
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
                            <Link href="/docs">Start reading</Link>
                        </Button>

                        <Button size="lg" variant="secondary" asChild className="px-8 py-6 text-base">
                            <Link href="/about" className="flex items-center gap-2">
                                <span>Introduce me</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </Button>
                    </div>
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
                <p className="text-sm text-muted-foreground">
                    There is no need to rush, no need to shine, no need to be anyone else just be yourself
                </p>
                <p className="text-sm text-muted-foreground my-8">
                    None of them are me, and none of them are me.
                </p>
                <div className="flex flex-wrap justify-center gap-8 px-4 grayscale opacity-70">
                    {['Document', 'Record', 'Learn', 'Explore', 'Life', 'Love'].map((value, index) => (
                        <div key={index} className="w-24 h-8 bg-gray-800 rounded flex items-center justify-center">
                            {value}
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
