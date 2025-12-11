// SEO Configuration for Programmatic SEO Pages

export interface Role {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  keywords: string[];
  toolCategories: string[];
  targetTools: string[];
}

export const ROLES: Role[] = [
  {
    slug: "real-estate-agents",
    title: "Real Estate Agents",
    emoji: "🏠",
    description: "AI tools to automate listings, generate property descriptions, and close more deals.",
    keywords: ["real estate AI", "property listing automation", "agent productivity"],
    toolCategories: ["productivity", "writing", "design"],
    targetTools: ["justcall", "jasper", "capcut", "shopify", "beehiiv"]
  },
  {
    slug: "saas-founders",
    title: "SaaS Founders",
    emoji: "🚀",
    description: "Build, launch, and scale your SaaS product with the best AI tools.",
    keywords: ["saas tools", "startup AI", "mvp builder", "vibe coding"],
    toolCategories: ["vibe-coding", "productivity", "writing"],
    targetTools: ["lovable", "bolt-new", "cursor", "hostinger", "namecheap", "beehiiv"]
  },
  {
    slug: "students",
    title: "Students & Researchers",
    emoji: "🎓",
    description: "AI tools for studying, writing papers, and building projects on a budget.",
    keywords: ["student AI tools", "research AI", "academic writing", "free AI tools"],
    toolCategories: ["writing", "vibe-coding"],
    targetTools: ["cursor", "bolt-new", "rytr", "copy-ai", "midjourney"]
  },
  {
    slug: "youtubers",
    title: "YouTubers & Creators",
    emoji: "📹",
    description: "Create viral content faster with AI video editors and thumbnail generators.",
    keywords: ["youtube AI", "video editing AI", "faceless youtube", "content creator tools"],
    toolCategories: ["design", "writing"],
    targetTools: ["capcut", "invideo-ai", "midjourney", "beehiiv", "jasper"]
  },
  {
    slug: "marketers",
    title: "Digital Marketers",
    emoji: "📈",
    description: "AI tools to automate campaigns, write copy, and analyze performance.",
    keywords: ["marketing AI", "ad copy generator", "seo tools", "email automation"],
    toolCategories: ["writing", "design", "productivity"],
    targetTools: ["jasper", "copy-ai", "writesonic", "beehiiv", "midjourney", "capcut"]
  },
  {
    slug: "agencies",
    title: "Creative Agencies",
    emoji: "🎨",
    description: "Scale your agency output with AI design, writing, and automation tools.",
    keywords: ["agency AI tools", "design automation", "client management"],
    toolCategories: ["design", "writing", "productivity"],
    targetTools: ["midjourney", "sketch-ai", "jasper", "hostinger", "shopify"]
  },
  {
    slug: "freelancers",
    title: "Freelancers",
    emoji: "💼",
    description: "Work smarter and take on more clients with AI-powered productivity tools.",
    keywords: ["freelancer AI", "productivity tools", "time management"],
    toolCategories: ["writing", "design", "productivity"],
    targetTools: ["rytr", "copy-ai", "midjourney", "namecheap", "beehiiv"]
  },
  {
    slug: "entrepreneurs",
    title: "Entrepreneurs",
    emoji: "💡",
    description: "Launch your next big idea with AI tools that do the heavy lifting.",
    keywords: ["startup AI", "business automation", "entrepreneur tools"],
    toolCategories: ["vibe-coding", "productivity", "writing"],
    targetTools: ["lovable", "shopify", "hostinger", "namecheap", "jasper", "beehiiv"]
  }
];

export interface TrendingTopic {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  relatedTools: string[];
  searchVolume: string;
}

export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    emoji: "🤖",
    description: "AI agents that can autonomously complete complex tasks and workflows.",
    relatedTools: ["lovable", "cursor", "bolt-new"],
    searchVolume: "High"
  },
  {
    slug: "vibe-coding",
    title: "Vibe Coding",
    emoji: "✨",
    description: "Build software by describing what you want, not how to code it.",
    relatedTools: ["lovable", "bolt-new", "cursor"],
    searchVolume: "Explosive"
  },
  {
    slug: "faceless-youtube",
    title: "Faceless YouTube",
    emoji: "🎭",
    description: "Create YouTube channels without showing your face using AI tools.",
    relatedTools: ["invideo-ai", "capcut", "midjourney", "jasper"],
    searchVolume: "Very High"
  },
  {
    slug: "automated-seo",
    title: "Automated SEO",
    emoji: "🔍",
    description: "Use AI to generate SEO-optimized content at scale.",
    relatedTools: ["writesonic", "jasper", "copy-ai", "beehiiv"],
    searchVolume: "High"
  },
  {
    slug: "ai-ecommerce",
    title: "AI E-commerce",
    emoji: "🛒",
    description: "Build and scale online stores with AI-powered automation.",
    relatedTools: ["shopify", "jasper", "midjourney"],
    searchVolume: "Very High"
  }
];

// Popular comparison pairs for homepage
export const TRENDING_COMPARISONS = [
  { toolA: "lovable", toolB: "bolt-new", badge: "Most Popular" },
  { toolA: "jasper", toolB: "copy-ai", badge: "Writing" },
  { toolA: "midjourney", toolB: "sketch-ai", badge: "Design" },
  { toolA: "capcut", toolB: "invideo-ai", badge: "Video" },
  { toolA: "cursor", toolB: "lovable", badge: "Coding" },
  { toolA: "writesonic", toolB: "rytr", badge: "Budget" },
];

// Helper functions
export function getRoleBySlug(slug: string): Role | undefined {
  return ROLES.find(r => r.slug === slug);
}

export function getTopicBySlug(slug: string): TrendingTopic | undefined {
  return TRENDING_TOPICS.find(t => t.slug === slug);
}

export function getAllRoleSlugs(): string[] {
  return ROLES.map(r => r.slug);
}

export function getAllTopicSlugs(): string[] {
  return TRENDING_TOPICS.map(t => t.slug);
}

// Current date for SEO
export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().toLocaleString('default', { month: 'long' });
export const MONTH_YEAR = `${CURRENT_MONTH} ${CURRENT_YEAR}`;
