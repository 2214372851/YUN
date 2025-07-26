"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import { image } from '@/config/site';

export default function About() {
    return (
        <main className="min-h-screen flex flex-col">

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="w-32 h-32 md:w-64 md:h-64">
                            <Image
                                src={image}
                                alt="头像"
                                width={128}
                                height={128}
                                className="w-full h-full rounded-full object-cover"
                                priority
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                About Me
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Make technology simpler and life better.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Work Experience */}
            <section className="py-16 px-4 bg-white/5">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center mt-8 md:mt-0">Work Experience</h2>
                    <div className="space-y-6">
                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-red-500 mr-3 rounded-full"/>
                                Crawler Engineer
                            </h3>
                            <p className="text-muted-foreground text-lg mb-4">
                                Sometimes I am a crawler engineer, and I will get public data through JavaScript
                                analysis websites. Have encountered many types,
                                For example: Websocket encryption internal communication protocol,
                                Cloudeflare, etc.
                            </p>
                            <p className="text-muted-foreground text-lg">
                                For human-machine verification, such as slider verification, you can calculate
                                distance based on the page scaling.
                            </p>
                        </div>

                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-yellow-500 mr-3 rounded-full"/>
                                Backend Development
                            </h3>
                            <p className="text-muted-foreground text-lg mb-4">
                                Sometimes, I am a backend developer. My expertise lies in Python, particularly with
                                Django and FastAPI.
                                I've built multiple projects using the Django Rest Framework, including the <a
                                href="https://maadaa.ai"
                                className="text-blue-500 hover:underline">Maadaa</a> project.
                            </p>
                            <p className="text-muted-foreground text-lg">
                                The project involved Google and Github Login integration, user management, and a
                                Celery-based
                                asynchronous queue system for message delivery.
                            </p>
                        </div>

                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-green-500 mr-3 rounded-full"/>
                                Frontend Development
                            </h3>
                            <p className="text-muted-foreground text-lg">
                                I'm experienced in both Vue and React. This website is my first React project,
                                showcasing my ability to adapt and learn new technologies.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Skills Grid */}
            <section className="py-16 px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center mt-8 md:mt-0">Skills & Expertise</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                            <h3 className="text-xl font-bold mb-4">Application Development</h3>
                            <p className="text-muted-foreground">
                                Desktop pyqt and pyside, mobile flutter
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                            <h3 className="text-xl font-bold mb-4">AI Development</h3>
                            <p className="text-muted-foreground">
                                SAM, YOLO and GPT 3 for visual data labeling, AI Agent development
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                            <h3 className="text-xl font-bold mb-4">Data Processing</h3>
                            <p className="text-muted-foreground">
                                AI visual data analysis, audio text processing, Google mute detection
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Hometown */}
            <section className="py-16 px-4 bg-white/5">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-bold mb-6 mt-8 md:mt-0">Hometown</h2>
                            <p className="text-muted-foreground text-lg">
                                Yunnan, a floating paradise suspended among clouds: At Jianggan Riverside Spring,
                                the Dragon Spring gushes celestial tears—the legend's origin of where the dragon god
                                spat jewels. Yulong Snow Mountain wears a frosted armor woven from the Naxi ethnic's
                                Dongba script.
                            </p>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src={'https://minio-endpoint.bybxbwg.fun/docs/xuanwei.svg'}
                                alt="xuanwei"
                                width={400}
                                height={400}
                                className="w-full h-auto object-cover border p-2 rounded-lg"
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Values */}
            <section className="py-16 px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 mt-8 md:mt-0">Explore</h2>
                            <p className="text-muted-foreground text-lg mb-4">
                                I hope this website can carry the journey of exploration and provide an instant
                                platform for sudden ideas.
                            </p>
                            <p className="text-muted-foreground text-lg">
                                We believe that technology should serve human beings, not make life more
                                complicated. Our goal is to make it easy for everyone to use technology.
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-8">
                            <h3 className="text-xl font-semibold mb-6">Values</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Innovation: Continuously explore new technologies and learn new technologies</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Open: Keep an open mind and embrace change</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>The road is long and arduous, and I will search up and down</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
