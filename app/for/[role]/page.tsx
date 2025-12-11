import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TOOLS, getToolBySlug, Tool } from '@/lib/tools-data';
import { ROLES, getRoleBySlug, getAllRoleSlugs, CURRENT_YEAR } from '@/lib/seo-configs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SiteHeader from '@/app/components/SiteHeader';
import {
  Star, ExternalLink, ArrowRight, CheckCircle, Sparkles,
  Users, Target, Rocket, ChevronRight
} from 'lucide-react';

// Initialize Gemini
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface RolePageProps {
  params: Promise<{ role: string }>;
}

// Generate AI intro for the role
async function generateRoleIntro(roleTitle: string, tools: Tool[]): Promise<string> {
  if (!genAI) {
    return `In ${CURRENT_YEAR}, ${roleTitle} are leveraging AI tools to automate repetitive tasks, boost productivity, and stay competitive. The right AI stack can transform how you work.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const toolNames = tools.slice(0, 5).map(t => t.name).join(', ');
    const prompt = `Write a compelling 100-word intro about why ${roleTitle} need AI tools in ${CURRENT_YEAR}.
Mention specific benefits like automation, time savings, and competitive advantage.
Tools available: ${toolNames}
Tone: Professional but energetic. No fluff. Focus on ROI and practical benefits.
Do NOT use markdown formatting. Plain text only.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return `In ${CURRENT_YEAR}, ${roleTitle} are leveraging AI tools to automate repetitive tasks, boost productivity, and stay competitive. The right AI stack can transform how you work.`;
  }
}

// Generate static params for all roles
export async function generateStaticParams() {
  const slugs = getAllRoleSlugs();
  return slugs.map((role) => ({ role }));
}

// Generate metadata
export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { role } = await params;
  const roleData = getRoleBySlug(role);
  if (!roleData) return { title: 'Role Not Found' };

  const title = `Best AI Tools for ${roleData.title} in ${CURRENT_YEAR} | AiToolAdvisor`;
  const description = `Discover the top AI tools curated specifically for ${roleData.title}. ${roleData.description} Compare features, pricing, and reviews.`;

  return {
    title,
    description,
    keywords: roleData.keywords,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  const roleData = getRoleBySlug(role);
  if (!roleData) notFound();

  // Get tools for this role
  const roleTools = roleData.targetTools
    .map(slug => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined);

  // Also get tools by category
  const categoryTools = roleData.toolCategories
    .flatMap(cat => TOOLS.filter(t => t.category === cat))
    .filter(t => !roleData.targetTools.includes(t.slug))
    .slice(0, 6);

  const allTools = [...roleTools, ...categoryTools].slice(0, 12);
  const intro = await generateRoleIntro(roleData.title, allTools);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `AI Tools for ${roleData.title}`,
    "description": roleData.description,
    "url": `https://aitooladvisor.com/for/${role}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allTools.length,
      "itemListElement": allTools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": tool.rating,
            "reviewCount": tool.reviews
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#roles" className="hover:text-white transition-colors">Roles</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-300">{roleData.title}</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{roleData.emoji}</div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium mb-2">
                <Target className="w-3 h-3" /> Curated for {roleData.title}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Best AI Tools for {roleData.title}
              </h1>
            </div>
          </div>

          <p className="text-xl text-slate-400 max-w-3xl mb-8">
            {roleData.description}
          </p>

          {/* Stats */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5 text-blue-400" />
              <span>{allTools.length} Tools Curated</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Avg {(allTools.reduce((a, t) => a + t.rating, 0) / allTools.length).toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Rocket className="w-5 h-5 text-purple-400" />
              <span>Updated {CURRENT_YEAR}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Generated Intro */}
      <div className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-purple-400 font-medium text-sm mb-3">
            <Sparkles className="w-4 h-4" /> AI-Generated Industry Insight
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">{intro}</p>
        </div>
      </div>

      {/* Featured Tools */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-2">
          The {roleData.title} AI Stack
        </h2>
        <p className="text-slate-400 mb-8">
          Our hand-picked recommendations based on your role&apos;s specific needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTools.map((tool, index) => (
            <div
              key={tool.id}
              className={`group bg-slate-800/50 border ${
                index < 3 ? 'border-yellow-500/30 ring-1 ring-yellow-500/20' : 'border-slate-700'
              } rounded-2xl p-6 hover:border-slate-500 transition-all hover:shadow-xl relative overflow-hidden`}
            >
              {index < 3 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500/30 to-transparent px-3 py-1 text-xs font-bold text-yellow-400 rounded-bl-xl">
                  TOP PICK #{index + 1}
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl bg-slate-700/50 w-14 h-14 rounded-xl flex items-center justify-center">
                  {tool.logo}
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star className="w-4 h-4 fill-current" /> {tool.rating}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{tool.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {tool.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <ul className="space-y-1 mb-6">
                {tool.pros.slice(0, 2).map((pro, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle className="w-3 h-3" /> {pro}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-sm text-slate-500">{tool.pricing}</span>
                <a
                  href={tool.link}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-800/30 border-y border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Tools by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleData.toolCategories.map(category => {
              const catTools = allTools.filter(t => t.category === category);
              return (
                <div key={category} className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 capitalize">
                    {category.replace('-', ' ')} Tools
                  </h3>
                  <ul className="space-y-3">
                    {catTools.slice(0, 4).map(tool => (
                      <li key={tool.id}>
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="nofollow noreferrer"
                          className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                        >
                          <span className="text-xl">{tool.logo}</span>
                          <span className="flex-1">{tool.name}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Other Roles */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Explore Other Roles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.filter(r => r.slug !== role).slice(0, 4).map(r => (
            <Link
              key={r.slug}
              href={`/for/${r.slug}`}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-all group"
            >
              <div className="text-3xl mb-2">{r.emoji}</div>
              <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                {r.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{r.targetTools.length} tools</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-y border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start with our top recommendation for {roleData.title} and see results in minutes.
          </p>
          {allTools[0] && (
            <a
              href={allTools[0].link}
              target="_blank"
              rel="nofollow noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
            >
              <span className="text-2xl">{allTools[0].logo}</span>
              Get Started with {allTools[0].name}
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to All Tools
        </Link>
      </div>
    </div>
  );
}
