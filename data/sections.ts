export type Niche =
  | "Beauty"
  | "Electronics"
  | "Dropshipping"
  | "Fashion"
  | "Fitness"
  | "Home Decor"
  | "Jewelry"
  | "Luxury"
  | "Minimal"
  | "Ready-To-Use Templates";

export interface Section {
  slug: string;
  name: string;
  description: string;
  niches: Niche[];
  category: string;
  preview: string;
  code: string;
  likes?: number;
  saves?: number;
}

export const sections: Section[] = [
  {
    slug: "luxury-hero-banner",
    name: "Luxury Hero Banner",
    description: "A full-height hero banner with video background support.",
    niches: ["Luxury", "Fashion"],
    category: "Hero",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Luxury Hero" } {% endschema %} <div class='luxury-hero'><h1>Elevate Your Style</h1></div>`,
    likes: 124,
    saves: 45,
  },
  {
    slug: "minimal-product-grid",
    name: "Minimal Product Grid",
    description: "A clean, whitespace-heavy grid for displaying products.",
    niches: ["Minimal", "Dropshipping"],
    category: "Product",
    preview: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Minimal Grid" } {% endschema %} <div class='product-grid'><h2>New Arrivals</h2></div>`,
    likes: 89,
    saves: 32,
  },
  {
    slug: "beauty-glow-reveal",
    name: "Beauty Glow Reveal",
    description: "Perfect for skincare and beauty brands.",
    niches: ["Beauty"],
    category: "Image",
    preview: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Beauty Glow" } {% endschema %} <div class='beauty-glow'><h2>Radiant Skin</h2></div>`,
    likes: 210,
    saves: 78,
  },
  {
    slug: "electronics-bento-specs",
    name: "Electronics Bento Specs",
    description: "Modern bento-style grid for tech specs.",
    niches: ["Electronics"],
    category: "Interactive",
    preview: "https://images.unsplash.com/photo-1526733158272-60b4946274e9?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Electronics Bento" } {% endschema %} <div class='bento-grid'><h2>Smart Features</h2></div>`,
    likes: 156,
    saves: 54,
  },
  {
    slug: "fitness-performance-stats",
    name: "Fitness Performance Stats",
    description: "Display metrics and results for fitness brands.",
    niches: ["Fitness"],
    category: "Social Proof",
    preview: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Fitness Stats" } {% endschema %} <div class='fitness-stats'><h2>50k+ Results</h2></div>`,
    likes: 92,
    saves: 28,
  },
  {
    slug: "home-decor-masonry",
    name: "Masonry Decor Gallery",
    description: "Elegant gallery for interior design products.",
    niches: ["Home Decor"],
    category: "Collection",
    preview: "https://images.unsplash.com/photo-1513519247388-193ad513d7ea?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Decor Masonry" } {% endschema %} <div class='decor-masonry'><h2>Living Spaces</h2></div>`,
    likes: 134,
    saves: 41,
  },
  {
    slug: "jewelry-comparison-table",
    name: "Jewelry Grade Comparison",
    description: "Compare materials and quality for premium jewelry.",
    niches: ["Jewelry", "Luxury"],
    category: "Text",
    preview: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Jewelry Table" } {% endschema %} <div class='jewelry-table'><h2>Material Guide</h2></div>`,
    likes: 76,
    saves: 19,
  },
  {
    slug: "dropshipping-winner-bar",
    name: "Winning Product Sticky Bar",
    description: "High-conversion bar for dropshipping products.",
    niches: ["Dropshipping"],
    category: "Forms",
    preview: "https://images.unsplash.com/photo-1627384113743-4dc975bc6640?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Winner Bar" } {% endschema %} <div class='winner-bar'><h2>Limited Time Offer</h2></div>`,
    likes: 342,
    saves: 112,
  },
  {
    slug: "ready-to-use-cta-grid",
    name: "Multi-Purpose CTA Grid",
    description: "Fast start templates for any store.",
    niches: ["Ready-To-Use Templates"],
    category: "Hero",
    preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "CTA Grid" } {% endschema %} <div class='cta-grid'><h2>Launch Now</h2></div>`,
    likes: 56,
    saves: 12,
  },
  {
    slug: "luxury-brand-story",
    name: "Heritage Brand Story",
    description: "Deep storytelling for premium brands.",
    niches: ["Luxury", "Fashion"],
    category: "Image",
    preview: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Brand Story" } {% endschema %} <div class='brand-story'><h2>Our Heritage</h2></div>`,
    likes: 187,
    saves: 63,
  },
  {
    slug: "minimal-footer-v3",
    name: "Modern Minimalist Footer",
    description: "Clean footer for modern brands.",
    niches: ["Minimal"],
    category: "Text",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Minimal Footer" } {% endschema %} <div class='minimal-footer'><h2>&copy; 2024</h2></div>`,
    likes: 45,
    saves: 8,
  },
  {
    slug: "beauty-carousel-v2",
    name: "Skincare Product Carousel",
    description: "Smooth sliding cards for beauty products.",
    niches: ["Beauty"],
    category: "Product",
    preview: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=801",
    code: `{% schema %} { "name": "Beauty Carousel" } {% endschema %} <div class='beauty-carousel'><h2>Best Sellers</h2></div>`,
    likes: 129,
    saves: 37,
  },
  {
    slug: "electronics-tabs-v2",
    name: "High-Tech Specs Tabs",
    description: "Tabbed interface for hardware specifications.",
    niches: ["Electronics"],
    category: "Interactive",
    preview: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Tech Tabs" } {% endschema %} <div class='tech-tabs'><h2>Specifications</h2></div>`,
    likes: 67,
    saves: 15,
  },
  {
    slug: "fitness-coach-booking-v2",
    name: "Coach Booking Grid",
    description: "Schedule sessions directly on the site.",
    niches: ["Fitness"],
    category: "Forms",
    preview: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Coach Booking" } {% endschema %} <div class='booking-grid'><h2>Book a Session</h2></div>`,
    likes: 83,
    saves: 21,
  },
  {
    slug: "home-decor-split-v2",
    name: "Interior Showcase Split",
    description: "Side-by-side layout for decor collections.",
    niches: ["Home Decor", "Minimal"],
    category: "Collection",
    preview: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    code: `{% schema %} { "name": "Decor Split" } {% endschema %} <div class='decor-split'><h2>Modern Living</h2></div>`,
    likes: 112,
    saves: 34,
  }
];
