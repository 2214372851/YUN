"use client";

import { motion } from "framer-motion";

export function TechStack() {
    return (
        <section className="px-4 bg-[hsl(var(--linear-darker))]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl font-bold mb-2">Tech Stack</h2>
                    <p className="text-muted-foreground">My core technical skills and proficiency levels</p>
                </motion.div>

                <div className="flex gap-3 flex-col">
                    {[
                        { name: "Python", level: 90 },
                        { name: "Django", level: 85 },
                        { name: "Git", level: 80 },
                        { name: "JavaScript/TypeScript", level: 75 },
                        { name: "Docker", level: 65 },
                        { name: "Rust", level: 40 },
                        { name: "Drat", level: 40},
                        { name: "Java", level: 25},
                    ].map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border rounded-lg overflow-hidden bg-[hsl(var(--linear-gray))/0.2] border-[hsl(var(--linear-gray))/0.2]"
                        >
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="font-medium">{tech.name}</span>
                                <span className="text-sm text-muted-foreground">{tech.level}%</span>
                            </div>
                            <div className="h-2 bg-[hsl(var(--linear-gray))/0.4]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${tech.level}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                    viewport={{ once: true }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
