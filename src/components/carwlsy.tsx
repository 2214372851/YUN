"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";

export function Carwlsy() {
    return (
        <section className="py-24 px-4 bg-[hsl(var(--linear-darker))]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <div className="order-2 md:order-1 bg-gray-800 rounded-lg overflow-hidden h-80 relative">
                        <Image
                            src="https://minio-endpoint.bybxbwg.fun/docs/carwlsy.png"
                            alt="D0 Tools"
                            width={0}
                            height={0}
                            className="size-full rounded-md"
                        />
                    </div>

                    <div className="order-1 md:order-2">
                        <div
                            className="inline-flex items-center px-3 py-1 rounded-full bg-[hsl(var(--linear-gray))/0.2] text-sm text-gray-400 mb-4">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            Distributed data collection platform
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Carwlsy</h2>
                        <p className="text-muted-foreground mb-6">
                            Optimize speed and efficiency. With the built-in SDK for data integration and alerting,
                            Carwlsy can easily deploy Python scripts and provide distributed scheduling capabilities.
                        </p>

                        <div className="space-y-4 mb-8">
                            <Feature title="Simplified deployment"
                                     description="You can deploy out-of-the-box services via Docker or local commands"/>
                            <Feature title="Web ide"
                                     description="Agile development and deployment can be carried out using the built-in Ide"/>
                        </div>

                        <Link
                            target="_blank"
                            href="https://github.com/2214372851/crawlsy"
                            className="text-white font-medium hover:underline inline-flex items-center">
                            Learn more about Crawlsy
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Feature({title, description}: { title: string; description: string }) {
    return (
        <div>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
