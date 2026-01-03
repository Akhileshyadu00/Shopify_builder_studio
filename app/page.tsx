"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/shared/SectionCard";
import { sections } from "@/data/sections";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featuredSections = sections.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden dark:bg-black">
      {/* Global Noise Overlay */}
      <div className="bg-noise fixed inset-0 z-[100] pointer-events-none" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32 mesh-gradient">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Premium Liquid Framework</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mb-8 max-w-5xl text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-[0.9]"
            >
              Design Better <br />
              <span className="text-primary italic font-serif">Storefronts.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground lg:text-xl font-medium leading-relaxed"
            >
              The ultimate toolkit for Shopify developers. Copy-paste high-end liquid sections,
              customize in real-time, and ship world-class commerce experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link
                href="/sections"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-black px-10 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Library <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <a
                href="#featured"
                className="inline-flex h-14 items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm px-10 text-sm font-bold transition-all hover:bg-white active:scale-95 dark:border-zinc-800 dark:bg-black/50"
              >
                See Examples
              </a>
            </motion.div>
          </div>
        </section>

        {/* Features Staggered */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {[
                { icon: Code2, title: "Clean Architecture", desc: "Optimized Liquid, CSS, and JS bundled into modular, valid Shopify blocks." },
                { icon: Zap, title: "Zero Latency", desc: "Native theme blocks mean zero app-proxy overhead and maximum page speed." },
                { icon: Sparkles, title: "Dynamic Schema", desc: "Full control via the Shopify Theme Editor with auto-generated settings." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group flex flex-col items-start gap-4 rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-10 transition-all hover:border-black/5 hover:bg-white hover:shadow-2xl dark:border-zinc-900 dark:bg-zinc-900/50 dark:hover:bg-black"
                >
                  <div className="rounded-2xl bg-black p-4 text-white dark:bg-white dark:text-black shadow-xl group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mt-4 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Sections with dynamic interaction */}
        <section id="featured" className="py-32 bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="mb-20 flex flex-col md:flex-row items-end justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl uppercase leading-none mb-6">
                  Featured <span className="text-primary italic">Drops</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  The most converted sections by top-tier Shopify Plus stores. Plug and play.
                </p>
              </div>
              <Link href="/sections" className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors">
                View All Releases <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSections.map((section, idx) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
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