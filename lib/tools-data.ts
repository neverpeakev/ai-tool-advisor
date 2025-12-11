// Centralized Tools Database for Programmatic SEO
// All affiliate links preserved exactly as provided

export interface Tool {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  pros: string[];
  cons: string[];
  rating: number;
  sentiment: number;
  reviews: number;
  pricing: string;
  deal: string;
  dealEnds?: Date;
  link: string;
  featured: boolean;
  verified: boolean;
  trend: number[];
  tags: string[];
  logo: string;
  // SEO fields for pSEO
  targetRoles?: string[];
  useCases?: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 1,
    slug: "lovable",
    name: "Lovable",
    category: "vibe-coding",
    description: "The king of 'Vibe Coding'. Builds full-stack apps instantly.",
    longDescription: "Lovable is a full-stack engineer in a box. It specializes in React, Tailwind, and Supabase integration. Perfect for founders building MVPs.",
    pros: ["One-click deployment", "Handles database schema", "Beautiful UI by default"],
    cons: ["Limited backend customization", "Paid plan required for export"],
    rating: 4.9,
    sentiment: 98,
    reviews: 1205,
    pricing: "Freemium",
    deal: "10% Off First 6 Mo",
    dealEnds: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    link: "https://lovable.dev/#via=7fe201",
    featured: true,
    verified: true,
    trend: [10, 25, 40, 35, 50, 65, 85],
    tags: ["Web App", "React", "No-Code"],
    logo: "❤️",
    targetRoles: ["saas-founders", "entrepreneurs", "marketers"],
    useCases: ["MVP Development", "Landing Pages", "SaaS Apps"]
  },
  {
    id: 2,
    slug: "bolt-new",
    name: "Bolt.new",
    category: "vibe-coding",
    description: "Browser-based full-stack environment. Excellent for debugging.",
    longDescription: "Bolt brings local dev to the browser. Powered by WebContainers, run Node.js servers and install npm packages in the cloud.",
    pros: ["Runs Node.js in browser", "Install any npm package", "Great debugging tools"],
    cons: ["Can be slower than local", "Token limits on free tier"],
    rating: 4.8,
    sentiment: 92,
    reviews: 980,
    pricing: "Free / Pro",
    deal: "Free Tokens",
    link: "https://bolt.new",
    featured: true,
    verified: true,
    trend: [15, 20, 35, 45, 40, 60, 75],
    tags: ["Dev Tools", "WebContainers", "Fast"],
    logo: "⚡",
    targetRoles: ["developers", "saas-founders", "students"],
    useCases: ["Rapid Prototyping", "Code Debugging", "Learning"]
  },
  {
    id: 3,
    slug: "sketch-ai",
    name: "Sketch AI",
    category: "design",
    description: "Generative vector features for professional UI design.",
    longDescription: "Sketch has reinvented itself. Describe an icon or UI element, and it generates editable vector paths.",
    pros: ["Editable vectors", "Native Mac app", "Industry standard"],
    cons: ["Mac only", "Steeper learning curve"],
    rating: 4.6,
    sentiment: 85,
    reviews: 3400,
    pricing: "Paid",
    deal: "30 Day Trial",
    link: "https://sketch.com",
    featured: false,
    verified: true,
    trend: [40, 42, 45, 43, 46, 48, 50],
    tags: ["UI/UX", "Vector", "Mac"],
    logo: "💎",
    targetRoles: ["designers", "agencies", "product-teams"],
    useCases: ["UI Design", "Icon Generation", "Design Systems"]
  },
  {
    id: 4,
    slug: "jasper",
    name: "Jasper",
    category: "writing",
    description: "Enterprise-grade AI marketing copilot.",
    longDescription: "Jasper understands brand voice, style guides, and SEO requirements better than generic LLMs.",
    pros: ["Brand voice memory", "SEO Surfer integration", "Team collaboration"],
    cons: ["Expensive for individuals", "Feature bloat"],
    rating: 4.7,
    sentiment: 88,
    reviews: 5100,
    pricing: "Paid",
    deal: "Free Trial",
    link: "https://www.jasper.ai/?fpr=npm",
    featured: false,
    verified: false,
    trend: [60, 58, 55, 62, 65, 70, 68],
    tags: ["Marketing", "SEO", "Enterprise"],
    logo: "🦄",
    targetRoles: ["marketers", "content-creators", "agencies"],
    useCases: ["Blog Writing", "Ad Copy", "Social Media"]
  },
  {
    id: 5,
    slug: "midjourney",
    name: "Midjourney",
    category: "design",
    description: "Highest fidelity AI image generator.",
    longDescription: "Midjourney v6.1 offers the most photorealistic and artistic image generation available.",
    pros: ["Best-in-class aesthetics", "Web interface", "Character reference"],
    cons: ["No free trial anymore", "Subscription only"],
    rating: 4.9,
    sentiment: 96,
    reviews: 10000,
    pricing: "Paid",
    deal: "None",
    link: "https://midjourney.com",
    featured: true,
    verified: true,
    trend: [80, 85, 82, 90, 95, 92, 98],
    tags: ["Image", "Art", "Creative"],
    logo: "⛵",
    targetRoles: ["designers", "content-creators", "marketers"],
    useCases: ["Marketing Images", "Product Mockups", "Art Generation"]
  },
  {
    id: 6,
    slug: "cursor",
    name: "Cursor",
    category: "vibe-coding",
    description: "The AI Code Editor. A VS Code fork that predicts edits.",
    longDescription: "Cursor integrates AI at the cursor level. It predicts your next edit and lets you chat with your codebase.",
    pros: ["Privacy mode available", "VS Code extensions", "Codebase indexing"],
    cons: ["Requires API key for heavy use", "Another subscription"],
    rating: 4.9,
    sentiment: 99,
    reviews: 2500,
    pricing: "Freemium",
    deal: "Free Tier",
    link: "https://cursor.sh",
    featured: false,
    verified: true,
    trend: [20, 30, 50, 60, 80, 90, 100],
    tags: ["IDE", "Coding", "Local"],
    logo: "🖱️",
    targetRoles: ["developers", "saas-founders", "students"],
    useCases: ["Code Editing", "Refactoring", "Learning to Code"]
  },
  {
    id: 7,
    slug: "capcut",
    name: "CapCut",
    category: "design",
    description: "All-in-one video editor for viral short-form content.",
    longDescription: "CapCut is the ultimate tool for creating TikToks and Reels with AI auto-captions and trending templates.",
    pros: ["Best-in-class auto captioning", "Massive library of effects", "Cross-platform"],
    cons: ["Pro features require subscription", "Desktop app resource heavy"],
    rating: 4.8,
    sentiment: 95,
    reviews: 15000,
    pricing: "Freemium",
    deal: "Free Download",
    link: "https://capcutaffiliateprogram.pxf.io/xLb10O",
    featured: true,
    verified: true,
    trend: [85, 88, 90, 92, 95, 98, 100],
    tags: ["Video", "Social Media", "Editing"],
    logo: "🎬",
    targetRoles: ["content-creators", "youtubers", "marketers"],
    useCases: ["TikTok Videos", "YouTube Shorts", "Social Media Content"]
  },
  {
    id: 8,
    slug: "invideo-ai",
    name: "InVideo AI",
    category: "design",
    description: "Turn text prompts into publish-ready videos.",
    longDescription: "InVideo AI generates scripts, visuals, and voiceovers from a single prompt.",
    pros: ["Text-to-video generation", "Human-sounding AI voiceovers", "Stock media integration"],
    cons: ["Watermark on free plan", "Rendering can take time"],
    rating: 4.7,
    sentiment: 89,
    reviews: 3200,
    pricing: "Freemium",
    deal: "Free Trial",
    link: "https://invideo.sjv.io/zxQRze",
    featured: false,
    verified: true,
    trend: [60, 65, 70, 75, 78, 80, 85],
    tags: ["Video Gen", "Marketing", "Content"],
    logo: "🎥",
    targetRoles: ["content-creators", "marketers", "youtubers"],
    useCases: ["Faceless YouTube", "Ad Videos", "Explainer Videos"]
  },
  {
    id: 9,
    slug: "hostinger",
    name: "Hostinger",
    category: "vibe-coding",
    description: "Affordable, high-speed hosting for your AI apps.",
    longDescription: "Hostinger provides the perfect infrastructure for deploying web apps with AI Website Builder.",
    pros: ["Incredible price-to-performance", "AI Website Builder included", "Global data centers"],
    cons: ["No phone support", "Renewal rates higher than intro"],
    rating: 4.6,
    sentiment: 93,
    reviews: 20000,
    pricing: "Paid",
    deal: "Up to 75% Off",
    link: "https://hostinger.sjv.io/6b2EmN",
    featured: true,
    verified: true,
    trend: [70, 72, 75, 74, 76, 78, 80],
    tags: ["Hosting", "Deployment", "Infrastructure"],
    logo: "🌐",
    targetRoles: ["saas-founders", "entrepreneurs", "agencies"],
    useCases: ["Web Hosting", "App Deployment", "Website Building"]
  },
  {
    id: 10,
    slug: "namecheap",
    name: "Namecheap",
    category: "productivity",
    description: "Secure your .ai domain name today.",
    longDescription: "Namecheap offers low prices, free privacy protection, and excellent DNS management.",
    pros: ["Free WhoisGuard privacy", "Transparent pricing", "Great support"],
    cons: ["Upsells during checkout", "Basic hosting is just okay"],
    rating: 4.8,
    sentiment: 94,
    reviews: 18000,
    pricing: "Paid",
    deal: "Domains from $0.99",
    link: "https://namecheap.pxf.io/QyPEe3",
    featured: false,
    verified: true,
    trend: [65, 66, 68, 70, 72, 74, 75],
    tags: ["Domains", "Startup", "Business"],
    logo: "🏷️",
    targetRoles: ["entrepreneurs", "saas-founders", "agencies"],
    useCases: ["Domain Registration", "Brand Protection", "Startup Launch"]
  },
  {
    id: 11,
    slug: "shopify",
    name: "Shopify",
    category: "productivity",
    description: "Build an AI-powered e-commerce empire.",
    longDescription: "Shopify with Shopify Magic (AI) generates product descriptions and optimizes your store.",
    pros: ["Shopify Magic AI tools", "Massive app ecosystem", "Scales infinitely"],
    cons: ["Transaction fees", "Apps can get expensive"],
    rating: 4.9,
    sentiment: 97,
    reviews: 45000,
    pricing: "Paid",
    deal: "$1/month for 3 months",
    link: "https://shopify.pxf.io/nXOg4o",
    featured: true,
    verified: true,
    trend: [90, 91, 92, 93, 94, 95, 96],
    tags: ["eCommerce", "Store Builder", "Business"],
    logo: "🛍️",
    targetRoles: ["entrepreneurs", "real-estate", "marketers"],
    useCases: ["Online Store", "Dropshipping", "Product Sales"]
  },
  {
    id: 12,
    slug: "justcall",
    name: "JustCall",
    category: "productivity",
    description: "AI-powered cloud phone system for sales teams.",
    longDescription: "JustCall uses AI to transcribe calls, score leads, and coach sales agents in real-time.",
    pros: ["Real-time AI coaching", "CRM integrations", "SMS automation"],
    cons: ["Per-user pricing adds up", "Requires good internet"],
    rating: 4.5,
    sentiment: 88,
    reviews: 1200,
    pricing: "Paid",
    deal: "14 Day Free Trial",
    link: "http://justcall.io?fp_ref=kevin93",
    featured: false,
    verified: true,
    trend: [40, 45, 42, 50, 55, 60, 62],
    tags: ["Sales", "VoIP", "CRM"],
    logo: "📞",
    targetRoles: ["real-estate", "sales-teams", "agencies"],
    useCases: ["Sales Calls", "Lead Management", "Team Coaching"]
  },
  {
    id: 13,
    slug: "copy-ai",
    name: "Copy.ai",
    category: "writing",
    description: "Brainstorm content angles and create variations instantly.",
    longDescription: "Copy.ai is an AI-powered copywriter that generates high-quality copy for your business.",
    pros: ["Unlimited words on Pro plan", "90+ copywriting tools", "Brand voice features"],
    cons: ["Can be repetitive", "Long-form editor needs work"],
    rating: 4.7,
    sentiment: 90,
    reviews: 4200,
    pricing: "Freemium",
    deal: "Free Account",
    link: "https://www.copy.ai/?fpr=npm",
    featured: false,
    verified: true,
    trend: [50, 55, 60, 58, 62, 65, 70],
    tags: ["Marketing", "Copywriting", "Social Media"],
    logo: "©️",
    targetRoles: ["marketers", "content-creators", "agencies"],
    useCases: ["Ad Copy", "Email Marketing", "Social Posts"]
  },
  {
    id: 14,
    slug: "rytr",
    name: "Rytr",
    category: "writing",
    description: "Affordable, high-quality AI writing assistant.",
    longDescription: "Rytr helps you create high-quality content in just a few seconds at a fraction of the cost.",
    pros: ["Very affordable", "Easy to use interface", "Built-in plagiarism checker"],
    cons: ["Less powerful than Jasper", "Limited long-form features"],
    rating: 4.5,
    sentiment: 88,
    reviews: 3100,
    pricing: "Freemium",
    deal: "Free Forever Plan",
    link: "https://rytr.me/?via=npm",
    featured: false,
    verified: false,
    trend: [40, 42, 45, 48, 50, 52, 55],
    tags: ["Writing", "Blog", "Emails"],
    logo: "✍️",
    targetRoles: ["students", "bloggers", "freelancers"],
    useCases: ["Blog Posts", "Email Writing", "Social Media"]
  },
  {
    id: 15,
    slug: "writesonic",
    name: "Writesonic",
    category: "writing",
    description: "Create SEO-optimized content 10x faster.",
    longDescription: "Writesonic is trained on top-performing SEO content to help you write articles that rank.",
    pros: ["SEO-optimized output", "Surfer SEO integration", "AI Article Writer 5.0"],
    cons: ["Credit system can be confusing", "Quality varies by template"],
    rating: 4.7,
    sentiment: 91,
    reviews: 5500,
    pricing: "Freemium",
    deal: "Free Trial",
    link: "https://writesonic.com/chat?ref=npm",
    featured: true,
    verified: true,
    trend: [55, 60, 65, 70, 75, 80, 85],
    tags: ["SEO", "Blog", "Ads"],
    logo: "⚡",
    targetRoles: ["marketers", "bloggers", "seo-specialists"],
    useCases: ["SEO Articles", "Landing Pages", "Ad Copy"]
  },
  {
    id: 16,
    slug: "beehiiv",
    name: "Beehiiv",
    category: "writing",
    description: "The newsletter platform built for growth.",
    longDescription: "Beehiiv includes the best tools for you to scale and monetize your newsletter.",
    pros: ["Built-in growth tools", "3D analytics", "Referral program included"],
    cons: ["Email only focus", "Newer platform"],
    rating: 4.9,
    sentiment: 97,
    reviews: 2000,
    pricing: "Freemium",
    deal: "Free up to 2500 subs",
    link: "https://www.beehiiv.com/?via=d14772",
    featured: true,
    verified: true,
    trend: [45, 55, 65, 75, 85, 90, 95],
    tags: ["Newsletter", "Email", "Growth"],
    logo: "🐝",
    targetRoles: ["content-creators", "bloggers", "entrepreneurs"],
    useCases: ["Newsletter Growth", "Email Marketing", "Audience Building"]
  }
];

// Helper functions for data access
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  if (category === 'all') return TOOLS;
  return TOOLS.filter(t => t.category === category);
}

export function getToolsByRole(role: string): Tool[] {
  return TOOLS.filter(t => t.targetRoles?.includes(role));
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter(t => t.featured);
}

// Generate all possible comparison slugs for sitemap
export function getAllComparisonSlugs(): string[] {
  const slugs: string[] = [];
  const categories = [...new Set(TOOLS.map(t => t.category))];

  for (const category of categories) {
    const categoryTools = getToolsByCategory(category);
    for (let i = 0; i < categoryTools.length; i++) {
      for (let j = i + 1; j < categoryTools.length; j++) {
        slugs.push(`${categoryTools[i].slug}-vs-${categoryTools[j].slug}`);
      }
    }
  }

  return slugs;
}

export const FAQS = [
  { question: "What is Vibe Coding?", answer: "Vibe Coding is the practice of building software using natural language and AI tools, focusing on the 'vibe' or intent of the product rather than the syntax of the code." },
  { question: "Are these tools free?", answer: "Most tools listed offer a 'Freemium' model, allowing you to test them out before committing to a paid subscription." },
  { question: "How do we rank tools?", answer: "We use a combination of real user reviews, feature velocity, and our own internal testing to assign a 'Vibe Score' to each tool." },
  { question: "Can I submit a tool?", answer: "Yes! Check the footer for the submission link. We review all submissions manually to ensure quality." },
];
