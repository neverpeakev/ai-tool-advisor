import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS, getToolBySlug, getAllComparisonSlugs, Tool } from '@/lib/tools-data';
import { CURRENT_YEAR } from '@/lib/seo-configs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import {
  Star, CheckCircle, XCircle, ArrowRight, Trophy,
  ExternalLink, Zap, ChevronRight
} from 'lucide-react';

// Initialize Gemini
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

// Parse "lovable-vs-bolt-new" into two tool slugs
function parseComparisonSlug(slug: string): { toolA: string; toolB: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return { toolA: parts[0], toolB: parts[1] };
}

// Generate AI verdict using Gemini
async function generateVerdict(toolA: Tool, toolB: Tool): Promise<string> {
  if (!genAI) {
    return `Based on user ratings, ${toolA.rating > toolB.rating ? toolA.name : toolB.name} edges ahead with superior ${toolA.rating > toolB.rating ? 'user satisfaction' : 'features'}.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an AI tool expert. Compare these two tools and give a 2-sentence verdict on which is better and why.

Tool A: ${toolA.name}
- Rating: ${toolA.rating}/5
- Pros: ${toolA.pros.join(', ')}
- Cons: ${toolA.cons.join(', ')}
- Pricing: ${toolA.pricing}

Tool B: ${toolB.name}
- Rating: ${toolB.rating}/5
- Pros: ${toolB.pros.join(', ')}
- Cons: ${toolB.cons.join(', ')}
- Pricing: ${toolB.pricing}

Give a short, punchy verdict (2 sentences max). Be decisive. Format: "[Winner] wins because... However, [Loser] is better if..."`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return `${toolA.rating >= toolB.rating ? toolA.name : toolB.name} takes the lead with a ${Math.max(toolA.rating, toolB.rating)}/5 rating. Choose based on your specific needs.`;
  }
}

// Generate static params for all comparisons
export async function generateStaticParams() {
  const slugs = getAllComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return { title: 'Comparison Not Found' };

  const toolA = getToolBySlug(parsed.toolA);
  const toolB = getToolBySlug(parsed.toolB);
  if (!toolA || !toolB) return { title: 'Comparison Not Found' };

  const title = `${toolA.name} vs ${toolB.name}: Which is Best in ${CURRENT_YEAR}?`;
  const description = `Compare ${toolA.name} and ${toolB.name} side-by-side. See pricing, features, pros & cons to pick the best AI tool for your needs.`;

  return {
    title,
    description,
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

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) notFound();

  const toolA = getToolBySlug(parsed.toolA);
  const toolB = getToolBySlug(parsed.toolB);
  if (!toolA || !toolB) notFound();

  const verdict = await generateVerdict(toolA, toolB);
  const winner = toolA.rating >= toolB.rating ? toolA : toolB;
  const loser = toolA.rating >= toolB.rating ? toolB : toolA;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${toolA.name} vs ${toolB.name}: Complete Comparison ${CURRENT_YEAR}`,
    "description": `Detailed comparison of ${toolA.name} and ${toolB.name}`,
    "author": {
      "@type": "Organization",
      "name": "AiToolAdvisor"
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
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
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#comparison" className="hover:text-white transition-colors">Comparisons</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-300">{toolA.name} vs {toolB.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> Head-to-Head Comparison
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            <span className="text-blue-400">{toolA.name}</span>
            <span className="text-slate-500 mx-4">vs</span>
            <span className="text-purple-400">{toolB.name}</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Which {toolA.category.replace('-', ' ')} tool is best for you in {CURRENT_YEAR}?
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-5xl mb-2">{toolA.logo}</div>
              <div className="flex items-center gap-1 justify-center text-yellow-400 font-bold">
                <Star className="w-5 h-5 fill-current" /> {toolA.rating}
              </div>
              <p className="text-slate-500 text-sm">{toolA.reviews.toLocaleString()} reviews</p>
            </div>
            <div className="text-slate-600 text-4xl font-bold self-center">VS</div>
            <div className="text-center">
              <div className="text-5xl mb-2">{toolB.logo}</div>
              <div className="flex items-center gap-1 justify-center text-yellow-400 font-bold">
                <Star className="w-5 h-5 fill-current" /> {toolB.rating}
              </div>
              <p className="text-slate-500 text-sm">{toolB.reviews.toLocaleString()} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Verdict Banner */}
      <div className="bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-green-900/30 border-y border-green-500/30">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-sm uppercase mb-3">
            <Trophy className="w-5 h-5" /> AI-Powered Verdict
          </div>
          <p className="text-lg text-slate-200 leading-relaxed">{verdict}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Side-by-Side Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Column */}
          <div className="hidden md:block space-y-4 pt-20">
            {['Rating', 'Pricing', 'Best For', 'Pros', 'Cons'].map((label) => (
              <div key={label} className="h-32 flex items-center">
                <span className="text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Tool A Column */}
          <div className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 relative overflow-hidden">
            {toolA === winner && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                WINNER
              </div>
            )}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">{toolA.logo}</div>
              <h3 className="text-2xl font-bold text-white">{toolA.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{toolA.description}</p>
            </div>

            <div className="space-y-4">
              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Rating</p>
                <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400">
                  <Star className="w-6 h-6 fill-current" /> {toolA.rating}/5
                </div>
                <p className="text-slate-500 text-sm">{toolA.sentiment}% positive sentiment</p>
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Pricing</p>
                <p className="text-xl font-bold text-white">{toolA.pricing}</p>
                {toolA.deal && toolA.deal !== 'None' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {toolA.deal}
                  </span>
                )}
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Best For</p>
                <div className="flex flex-wrap gap-2">
                  {toolA.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Pros</p>
                <ul className="space-y-2">
                  {toolA.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-32">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Cons</p>
                <ul className="space-y-2">
                  {toolA.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-400">
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={toolA.link}
              target="_blank"
              rel="nofollow noreferrer"
              className={`mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all ${
                toolA === winner
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Try {toolA.name} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Tool B Column */}
          <div className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 relative overflow-hidden">
            {toolB === winner && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                WINNER
              </div>
            )}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">{toolB.logo}</div>
              <h3 className="text-2xl font-bold text-white">{toolB.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{toolB.description}</p>
            </div>

            <div className="space-y-4">
              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Rating</p>
                <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400">
                  <Star className="w-6 h-6 fill-current" /> {toolB.rating}/5
                </div>
                <p className="text-slate-500 text-sm">{toolB.sentiment}% positive sentiment</p>
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Pricing</p>
                <p className="text-xl font-bold text-white">{toolB.pricing}</p>
                {toolB.deal && toolB.deal !== 'None' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {toolB.deal}
                  </span>
                )}
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Best For</p>
                <div className="flex flex-wrap gap-2">
                  {toolB.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-32 border-b border-slate-700 pb-4">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Pros</p>
                <ul className="space-y-2">
                  {toolB.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-32">
                <p className="text-slate-500 text-xs uppercase mb-2 md:hidden">Cons</p>
                <ul className="space-y-2">
                  {toolB.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-400">
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={toolB.link}
              target="_blank"
              rel="nofollow noreferrer"
              className={`mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all ${
                toolB === winner
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Try {toolB.name} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Winner CTA */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-y border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">{winner.logo}</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Recommendation: {winner.name}
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            With a {winner.rating}/5 rating from {winner.reviews.toLocaleString()} users,
            {winner.name} is the clear choice for most users looking for a {winner.category.replace('-', ' ')} solution.
          </p>
          <a
            href={winner.link}
            target="_blank"
            rel="nofollow noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-green-500/25"
          >
            <Trophy className="w-6 h-6" />
            Get Started with {winner.name}
            <ArrowRight className="w-5 h-5" />
          </a>
          {winner.deal && winner.deal !== 'None' && (
            <p className="text-green-400 mt-4 font-medium">{winner.deal}</p>
          )}
        </div>
      </div>

      {/* Related Comparisons */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Related Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOOLS.filter(t => t.category === toolA.category && t.id !== toolA.id && t.id !== toolB.id)
            .slice(0, 3)
            .map(tool => (
              <Link
                key={tool.id}
                href={`/compare/${toolA.slug}-vs-${tool.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-all flex items-center gap-4"
              >
                <div className="text-3xl">{tool.logo}</div>
                <div>
                  <p className="text-white font-medium">{toolA.name} vs {tool.name}</p>
                  <p className="text-slate-500 text-sm">See comparison</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 ml-auto" />
              </Link>
            ))}
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center pb-16">
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
