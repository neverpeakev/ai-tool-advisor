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
      </body>
    </html>
  );
}
