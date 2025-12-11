"use client";

import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Script from 'next/script';

interface SeoLandingPadProps {
  category?: string;
  isMigrationVisitor: boolean;
}

export default function SeoLandingPad({ category, isMigrationVisitor }: SeoLandingPadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show banner for migration visitors who haven't dismissed it
    if (isMigrationVisitor && !isDismissed) {
      const dismissed = sessionStorage.getItem('migration-banner-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, [isMigrationVisitor, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('migration-banner-dismissed', 'true');
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat) {
      case 'writing': return 'AI Writing & Copywriting Tools';
      case 'design': return 'AI Design & Video Tools';
      case 'vibe-coding': return 'Vibe Coding & No-Code Tools';
      case 'productivity': return 'AI Productivity Tools';
      default: return 'AI Tools';
    }
  };

  // Schema.org CollectionPage for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${getCategoryLabel(category)} - AiToolAdvisor`,
    "description": `Curated collection of the best ${getCategoryLabel(category).toLowerCase()} in ${new Date().getFullYear()}. Compare features, pricing, and reviews.`,
    "url": typeof window !== 'undefined' ? window.location.href : 'https://aitooladvisor.com',
    "isPartOf": {
      "@type": "WebSite",
      "name": "AiToolAdvisor",
      "url": "https://aitooladvisor.com"
    },
    "about": {
      "@type": "Thing",
      "name": getCategoryLabel(category)
    },
    "provider": {
      "@type": "Organization",
      "name": "AiToolAdvisor",
      "url": "https://aitooladvisor.com"
    },
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US"
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <Script
        id="schema-collection-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Migration Welcome Banner */}
      {isVisible && (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          <div className="relative max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-lg sm:text-xl">
                    Welcome to AiToolAdvisor 2.0!
                  </p>
                  <p className="text-sm text-white/90 mt-0.5">
                    We&apos;ve upgraded our directory. {category && (
                      <>Below are the best <span className="font-semibold">{getCategoryLabel(category).toLowerCase()}</span> you were looking for.</>
                    )}
                    {!category && <>Explore our curated collection of AI tools below.</>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#directory"
                  className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold transition-all"
                >
                  Explore Tools <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated gradient line at bottom */}
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-gradient" />
        </div>
      )}

      {/* SEO-friendly breadcrumb for migrated content */}
      {isMigrationVisitor && category && (
        <nav aria-label="Breadcrumb" className="bg-slate-800/50 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">Home</a>
              </li>
              <li className="text-slate-600">/</li>
              <li className="text-white font-medium">
                {getCategoryLabel(category)}
              </li>
            </ol>
          </div>
        </nav>
      )}
    </>
  );
}
