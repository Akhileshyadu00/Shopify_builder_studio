"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { SectionCard } from "@/components/shared/SectionCard";
import { sections } from "@/data/sections";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featuredSections = sections.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Premium Shopify Sections Library</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold tracking-tight lg:text-7xl"
            >
              Scale Your <span className="text-primary italic">Store</span> Faster with Custom Liquid Blocks
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground lg:text-xl"
            >
              Copy-paste premium, high-converting Shopify sections. No apps needed. Just clean, optimized code for your theme.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/sections"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105"
              >
                Browse All Sections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#featured"
                className="inline-flex h-12 items-center justify-center rounded-full border bg-background px-8 text-sm font-semibold transition-all hover:bg-muted"
              >
                View Featured
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Clean Code</h3>
                <p className="text-sm text-muted-foreground text-center">Optimized Liquid, CSS, and JS in a single block.</p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground text-center">Built for performance. Zero impact on page speed.</p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Full Customization</h3>
                <p className="text-sm text-muted-foreground text-center">Easily tweak colors, spacing, and layouts via schema.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Sections */}
        <section id="featured" className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Sections</h2>
                <p className="mt-2 text-muted-foreground">The most popular building blocks for modern stores.</p>
              </div>
              <Link href="/sections" className="hidden items-center font-semibold text-primary hover:underline md:flex">
                View all sections <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSections.map((section, idx) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <SectionCard section={section} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
// testing