"use client";

import { Section } from "@/data/sections";
import { ArrowLeft, Star, ChevronDown, Check, Mail, LayoutTemplate, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- PREVIEW COMPONENTS ---

const LuxuryHero = () => (
    <div className="relative h-[600px] w-full bg-stone-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
        {/* Mock Background Image */}
        <div className="absolute inset-0 opacity-70">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="relative z-20 text-center text-white p-6 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                Elevate Your Style
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                Discover the new collection defined by timeless elegance and modern comfort.
            </p>
            <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <Button className="rounded-full h-12 px-8 bg-white text-black hover:bg-gray-100">
                    Shop Collection
                </Button>
                <Button variant="outline" className="rounded-full h-12 px-8 border-white text-white hover:bg-white/10 hover:text-white">
                    View Lookbook
                </Button>
            </div>
        </div>
    </div>
);

const MinimalProductGrid = () => (
    <div className="py-16 px-4 md:px-8 bg-white">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <div className="h-1 w-20 bg-black mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-xl">
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider">New</div>
                        <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center text-gray-400">
                            <span className="text-4xl font-light">{i}</span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <Button className="w-full bg-white text-black hover:bg-black hover:text-white shadow-lg">Quick Add</Button>
                        </div>
                    </div>
                    <h3 className="text-base font-medium mb-1">Essential Cotton Tee</h3>
                    <p className="text-sm text-gray-500">$45.00</p>
                </div>
            ))}
        </div>
    </div>
);

const AnimatedTestimonials = () => (
    <div className="py-16 bg-slate-50 overflow-hidden">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What They Say</h2>
        </div>
        <div className="flex gap-8 animate-scroll whitespace-nowrap overflow-hidden py-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="inline-block w-[350px] p-8 bg-white rounded-2xl shadow-sm border border-gray-100 whitespace-normal">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        &quot;Absolutely love the quality. The attention to detail is unmatched and the customer service was exceptional.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div>
                            <p className="font-bold text-sm">Sarah Johnson</p>
                            <p className="text-xs text-gray-400">Verified Buyer</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    </div>
);

const CollectionSplit = () => (
    <div className="grid md:grid-cols-2 min-h-[600px]">
        <div className="relative h-64 md:h-auto bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-stone-300 flex items-center justify-center text-stone-400 text-6xl font-serif italic">
                Autumn
            </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-zinc-900 text-white p-16 text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-zinc-400">Featured Collection</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">The Autumn Edit</h2>
            <p className="max-w-md text-zinc-400 mb-8 leading-relaxed">
                Warm tones, soft textures, and essential layers for the changing season. Explore our curated selection of fall favorites.
            </p>
            <a
                href="/sections"
                onClick={(e) => {
                    e.preventDefault();
                    toast.info("This would navigate to the collection in a real store");
                }}
                className="inline-block border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors"
            >
                Explore Collection
            </a>

        </div>
    </div>
);

const MarqueeLogos = () => (
    <div className="py-12 border-y border-gray-100 bg-white">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by top brands</p>
        <div className="flex justify-around items-center opacity-40 grayscale flex-wrap gap-8 px-4">
            {/* Placeholder logos */}
            <div className="text-2xl font-bold font-serif">VOGUE</div>
            <div className="text-2xl font-bold tracking-tighter">HYPEBEAST</div>
            <div className="text-2xl font-black italic">GQ</div>
            <div className="text-2xl font-mono">Forbes</div>
            <div className="text-2xl font-serif">ELLE</div>
        </div>
    </div>
);

const BeforeAfter = () => {
    // Simplified for demo
    // const [sliderPosition, setSliderPosition] = useState(50);
    // const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="py-16 px-4 bg-gray-50 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8">Real Results</h2>
            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl cursor-ew-resize select-none">
                <div className="absolute inset-0 bg-sepia-[.5] bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white drop-shadow-md">AFTER</span>
                </div>
                <div
                    className="absolute inset-0 bg-gray-500 overflow-hidden border-r-4 border-white"
                    style={{ width: '50%' }}
                >
                    <div className="absolute inset-0 w-[200%] bg-gray-600 flex items-center justify-center translate-x-[-25%]">
                        <span className="text-4xl font-bold text-white drop-shadow-md">BEFORE</span>
                    </div>
                </div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center top-1/2 -translate-y-1/2">
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-center text-gray-500">Drag the slider to see the difference</p>
        </div>
    );
};

const FAQ = () => (
    <div className="max-w-2xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about the product and billing.</p>
        </div>
        <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
                <div key={i} className="py-6 group cursor-pointer">
                    <div className="flex justify-between items-center font-medium text-lg">
                        <span>What is the return policy?</span>
                        <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-hover:rotate-180" />
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                        We offer a 30-day money-back guarantee. If you&apos;re not satisfied with your purchase, simply return it for a full refund, no questions asked.
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const FeatureIcons = () => (
    <div className="py-20 px-4 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {[
                { title: "Free Shipping", text: "On all orders over $50" },
                { title: "Secure Payment", text: "100% secure checkout" },
                { title: "24/7 Support", text: "We&apos;re here to help" },
                { title: "Eco Friendly", text: "Sustainable materials" },
            ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                        <Check className="h-6 w-6" />
                    </div>
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.text}</p>
                </div>
            ))}
        </div>
    </div>
);

const ModernNewsletter = () => (
    <div className="bg-zinc-900 text-white py-24 px-4 text-center">
        <div className="max-w-xl mx-auto">
            <Mail className="h-8 w-8 mx-auto mb-6 text-indigo-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Club</h2>
            <p className="text-zinc-400 mb-8">Subscribe to our newsletter and get 10% off your first order.</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder:text-zinc-500"
                />
                <Button className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-3 h-auto">
                    Subscribe
                </Button>
            </form>
            <p className="text-xs text-zinc-600 mt-4">By subscribing you agree to our Terms & Privacy Policy.</p>
        </div>
    </div>
);

const LifestyleStory = () => (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="md:flex items-center gap-16">
            <div className="md:w-1/2 mb-10 md:mb-0 relative">
                <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-stone-300 flex items-center justify-center text-stone-400">Image Placeholder</div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-indigo-50 rounded-full -z-10 hidden md:block"></div>
            </div>
            <div className="md:w-1/2">
                <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-4 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Crafting durability with sustainable methods.</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                    <p>
                        We started with a simple idea: create products that last a lifetime without harming the planet.
                    </p>
                    <p>
                        Every stitch, every fold, and every material is chosen with intention. We believe in slow fashion—buying less, but buying better.
                    </p>
                </div>
                <div className="mt-8 flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-black">10k+</span>
                        <span className="text-sm text-gray-500">Happy Customers</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-black">100%</span>
                        <span className="text-sm text-gray-500">Recycled Materials</span>
                    </div>
                </div>
                <Button variant="link" className="mt-8 p-0 text-indigo-600 font-medium hover:text-indigo-700 h-auto">
                    Read full story <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
);

interface SectionPreviewProps {
    section: Section;
}

export function SectionPreview({ section }: SectionPreviewProps) {
    switch (section.slug) {
        case "luxury-hero-banner":
            return <LuxuryHero />;
        case "minimal-product-grid":
            return <MinimalProductGrid />;
        case "animated-testimonials":
            return <AnimatedTestimonials />;
        case "collection-showcase-split":
            return <CollectionSplit />;
        case "scrolling-marquee-logos":
            return <MarqueeLogos />;
        case "before-after-reveal":
            return <BeforeAfter />;
        case "faq-accordion-modern":
            return <FAQ />;
        case "feature-icons-section":
            return <FeatureIcons />;
        case "modern-newsletter":
            return <ModernNewsletter />;
        case "lifestyle-story":
            return <LifestyleStory />;
        default:
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8 text-center">
                    <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <LayoutTemplate className="h-8 w-8" />
                    </div>
                    <p>Preview not available for {section.name}</p>
                </div>
            );
    }
}
