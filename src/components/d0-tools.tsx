"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import Image from 'next/image';

export function D0Tools() {
    return (
        <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <div>
                        <div
                            className="inline-flex items-center px-3 py-1 rounded-full bg-[hsl(var(--linear-gray))/0.2] text-sm text-gray-400 mb-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Data annotation tools
                        </div>
                        <h2 className="text-3xl font-bold mb-4">D0 Tools</h2>
                        <p className="text-muted-foreground mb-6">
                            Focus on a unified data annotation experience and open interfaces. Deeply integrate D0 with
                            YOLO, SAM, and other models to provide a smarter annotation experience.
                        </p>

                        <div className="space-y-4 mb-8">
                            <Feature
                                title="Safe and reliable"
                                description="Centralize data collection, annotation, and delivery, set expiration times for data, and ensure data security."/>
                            <Feature
                                title="Extremely versatile"
                                description="Built-in rectangle, polygon, segment, and point callouts. Pixel-level operations as well as commonality, layer adjustments, data fine-tuning, and more."/>
                        </div>

                        <Link
                            target="_blank"
                            href="https://github.com/2214372851/D0-Tools"
                            className="text-white font-medium hover:underline inline-flex items-center">
                            Learn more about D0 Tools
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>

                    <div
                        className="bg-gray-600 rounded-lg overflow-hidden h-80 relative flex justify-center items-center">
                        <Image
                            src="https://minio-endpoint.bybxbwg.fun/docs/data-label.webp"
                            alt="D0 Tools"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="size-full"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Feature({
                     title, description
                 }: {
    title: string;
    description: string
}) {
    return (
        <div>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
