import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AiToolAdvisor - Best AI Tools for Every Profession | 2025",
    template: "%s | AiToolAdvisor"
  },
  description: "Discover the best AI tools for vibe coding, design, writing, and productivity. Compare tools side-by-side with AI-powered verdicts. Curated recommendations for real estate agents, SaaS founders, marketers, and more.",
  keywords: ["AI tools", "vibe coding", "Lovable", "Cursor", "Bolt.new", "AI writing tools", "AI design tools", "best AI tools 2025"],
  authors: [{ name: "AiToolAdvisor" }],
  creator: "AiToolAdvisor",
  metadataBase: new URL("https://aitooladvisor.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aitooladvisor.com",
    siteName: "AiToolAdvisor",
    title: "AiToolAdvisor - Best AI Tools for Every Profession",
    description: "Discover, compare, and master the best AI tools. Curated recommendations for real estate agents, SaaS founders, marketers, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AiToolAdvisor - Best AI Tools",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiToolAdvisor - Best AI Tools for Every Profession",
    description: "Discover, compare, and master the best AI tools. Curated recommendations for every profession.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// Organization structured data for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AiToolAdvisor",
  "url": "https://aitooladvisor.com",
  "logo": "https://aitooladvisor.com/logo.png",
  "description": "Discover the best AI tools for vibe coding, design, writing, and productivity. Compare tools side-by-side with AI-powered verdicts.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@aitooladvisor.com"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AiToolAdvisor",
  "url": "https://aitooladvisor.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://aitooladvisor.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Affiliate Disclosure Component
function AffiliateDisclosure() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <span>
          <strong className="text-slate-300">Affiliate Disclosure:</strong> We may earn commissions from partner links.
          Our AI-powered recommendations are personalized to your needs using the latest LLM technology.
          <a href="/affiliate-disclosure" className="text-blue-400 hover:text-blue-300 ml-1 underline">Learn more</a>
        </span>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AffiliateDisclosure />
      </body>
    </html>
  );
}
