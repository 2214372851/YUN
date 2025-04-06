"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function CallToAction() {
  return (
    <section className="py-24 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Learn more about me</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" size="lg" asChild className="px-8 py-6 text-base">
            <Link href="/blog" style={{ color: 'gray' }}>View the blog</Link>
          </Button>
          <Button size="lg" asChild className="px-8 py-6 text-base">
            <Link href="/docs">View the docs</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
