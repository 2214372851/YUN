'use client';
import {motion} from "framer-motion";
import Image from "next/image";
import {Link} from "next-view-transitions"
import {image} from '@/config/site';
import {STORAGE_HOST} from "@/data/baseUrl";


export default function Contact() {
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
                                alt="YunHai"
                                width={128}
                                height={128}
                                className="w-full h-full rounded-full object-cover"
                                priority
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Contact Me
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Let's connect and create something amazing together.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 px-4 bg-white/5">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center mt-8 md:mt-0">Contact Methods</h2>
                    <div className="space-y-6">
                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-blue-500 mr-3 rounded-full"/>
                                Email
                            </h3>
                            <p className="text-muted-foreground text-lg mb-4">
                                Feel free to reach out to me via email for any inquiries or collaboration opportunities.
                            </p>
                            <Link href="mailto:yunhai@yhnotes.com" className="text-blue-500 hover:underline"
                                  target="_blank">
                                Click Contact me by email
                            </Link>
                        </div>

                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-purple-500 mr-3 rounded-full"/>
                                GitHub
                            </h3>
                            <p className="text-muted-foreground text-lg mb-4">
                                Check out my open source projects and contributions on GitHub.
                            </p>
                            <Link href="https://github.com/2214372851" className="text-blue-500 hover:underline"
                                  target="_blank">
                                Click here to view my Github
                            </Link>
                        </div>

                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-orange-500 mr-3 rounded-full"/>
                                Gitee
                            </h3>
                            <p className="text-muted-foreground text-lg mb-4">
                                Follow my projects and activities on Gitee.
                            </p>
                            <Link href="https://gitee.com/yun2hai" className="text-blue-500 hover:underline"
                                  target="_blank">
                                Click here to view my Gitee
                            </Link>
                        </div>
                        <div className="border rounded-lg p-6 hover:bg-white/5 transition-colors">
                            <h3 className="flex items-center text-xl font-semibold mb-4">
                                <div className="size-3 bg-green-500 mr-3 rounded-full"/>
                                WeChat
                            </h3>
                            <div className="flex">
                                <p className="text-muted-foreground text-lg mb-4">
                                    I can be contacted in this way, but of course you need to indicate your intention
                                    when
                                    adding it to facilitate our subsequent communication
                                </p>
                                <Image
                                    width={120}
                                    height={120}
                                    alt="aaa"
                                    src={`${STORAGE_HOST}/docs/contact-wechat.png`}/>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Support Section */}
            <section className="py-16 px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center mt-8 md:mt-0">Support</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                            <h3 className="text-xl font-bold mb-4">Technical Support</h3>
                            <p className="text-muted-foreground">
                                Need help with technical issues? Contact our support team.
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 text-center hover:bg-white/5 transition-colors">
                            <h3 className="text-xl font-bold mb-4">Business Inquiries</h3>
                            <p className="text-muted-foreground">
                                Interested in collaboration? Let's discuss your project.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Response Time */}
            <section className="py-16 px-4 bg-white/5">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    viewport={{once: true}}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 mt-8 md:mt-0">Response Time</h2>
                            <p className="text-muted-foreground text-lg mb-4">
                                I typically respond to all inquiries within 24 hours during business days.
                            </p>
                            <p className="text-muted-foreground text-lg">
                                For urgent matters, please indicate "URGENT" in your email subject line.
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-8">
                            <h3 className="text-xl font-semibold mb-6">Best Practices</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Be specific about your inquiry or request</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Include relevant context and details</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Attach any necessary files or documentation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/*<Footer/>*/}
        </main>
    );
}
