import { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import { ChevronRight, Shield, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | AiToolAdvisor',
  description: 'Learn how AiToolAdvisor uses affiliate links and how our AI-powered recommendations work.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <SiteHeader />

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-300">Affiliate Disclosure</span>
        </nav>

        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Affiliate Disclosure</h1>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Transparency is important to us. This page explains how AiToolAdvisor earns revenue
              and how we ensure our recommendations remain unbiased and helpful.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              How We Make Money
            </h2>
            <p className="text-slate-300 mb-4">
              AiToolAdvisor participates in affiliate programs with many of the AI tools we review and recommend.
              This means when you click on certain links on our site and make a purchase, we may receive a commission
              at no additional cost to you.
            </p>
            <p className="text-slate-300 mb-4">
              These affiliate partnerships help us keep the site running, pay for AI API costs, and continue
              providing free, high-quality recommendations to our users.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Our AI-Powered Recommendations
            </h2>
            <p className="text-slate-300 mb-4">
              What makes AiToolAdvisor different is our use of cutting-edge AI and Large Language Models (LLMs)
              to provide personalized recommendations. Our system:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4 ml-4">
              <li>Analyzes your specific needs and use case</li>
              <li>Compares tools based on features, pricing, and user reviews</li>
              <li>Generates unbiased verdicts using AI analysis</li>
              <li>Updates recommendations based on the latest tool capabilities</li>
            </ul>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">Important:</strong> Our AI recommendations are based on tool quality,
              user reviews, and fit for your needs — not on commission rates. We recommend tools we genuinely
              believe will help you, regardless of whether we earn a commission.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Our Commitment to You</h2>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>We only recommend tools we&apos;ve researched and believe provide genuine value</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Affiliate relationships never influence our ratings or comparisons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>We clearly disclose when links are affiliate links</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Our AI consultant provides honest, personalized advice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>You pay the same price whether you use our links or not</span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Questions?</h2>
            <p className="text-slate-300 mb-4">
              If you have any questions about our affiliate relationships or how we make recommendations,
              feel free to reach out to us. We&apos;re committed to maintaining your trust.
            </p>

            <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-700">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
