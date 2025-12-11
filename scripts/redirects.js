// SEO Migration Redirects for AiToolAdvisor
// These redirects preserve SEO authority from the WordPress site
// Generated with intelligent category mapping

const migrationRedirects = async () => {
  return [
    // Writing/Copywriting content redirects
    { source: '/best-ai-writing-tools', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/best-ai-writing-tools/:slug*', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/ai-copywriting-tools', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/ai-content-generators', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/reviews/jasper-ai', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/reviews/copy-ai', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/reviews/writesonic', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/reviews/rytr', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/seo-writing-tools', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/blog-writing-ai', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/category/writing', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/category/copywriting', destination: '/?category=writing&ref=migration', permanent: true },
    { source: '/category/content', destination: '/?category=writing&ref=migration', permanent: true },

    // Design/Video content redirects
    { source: '/best-ai-design-tools', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/ai-image-generators', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/ai-video-tools', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/reviews/midjourney', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/reviews/capcut', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/reviews/invideo', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/reviews/canva-ai', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/category/design', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/category/video', destination: '/?category=design&ref=migration', permanent: true },
    { source: '/category/graphics', destination: '/?category=design&ref=migration', permanent: true },

    // Vibe Coding/Development redirects
    { source: '/best-ai-coding-tools', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/vibe-coding-tools', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/ai-code-generators', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/reviews/lovable', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/reviews/bolt-new', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/reviews/cursor', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/reviews/github-copilot', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/no-code-tools', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/app-builders', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/category/coding', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/category/development', destination: '/?category=vibe-coding&ref=migration', permanent: true },
    { source: '/category/no-code', destination: '/?category=vibe-coding&ref=migration', permanent: true },

    // Productivity redirects
    { source: '/best-ai-productivity-tools', destination: '/?category=productivity&ref=migration', permanent: true },
    { source: '/ai-automation-tools', destination: '/?category=productivity&ref=migration', permanent: true },
    { source: '/reviews/shopify', destination: '/?category=productivity&ref=migration', permanent: true },
    { source: '/reviews/namecheap', destination: '/?category=productivity&ref=migration', permanent: true },
    { source: '/category/productivity', destination: '/?category=productivity&ref=migration', permanent: true },
    { source: '/category/automation', destination: '/?category=productivity&ref=migration', permanent: true },

    // General WordPress pages
    { source: '/about', destination: '/?ref=migration', permanent: true },
    { source: '/about-us', destination: '/?ref=migration', permanent: true },
    { source: '/contact', destination: '/?ref=migration', permanent: true },
    { source: '/contact-us', destination: '/?ref=migration', permanent: true },
    { source: '/privacy-policy', destination: '/?ref=migration', permanent: true },
    { source: '/terms', destination: '/?ref=migration', permanent: true },
    { source: '/terms-of-service', destination: '/?ref=migration', permanent: true },
    { source: '/disclaimer', destination: '/?ref=migration', permanent: true },

    // WordPress blog structure
    { source: '/blog', destination: '/?ref=migration', permanent: true },
    { source: '/blog/:slug*', destination: '/?ref=migration', permanent: true },
    { source: '/post/:slug*', destination: '/?ref=migration', permanent: true },
    { source: '/article/:slug*', destination: '/?ref=migration', permanent: true },

    // WordPress archive patterns
    { source: '/author/:slug*', destination: '/?ref=migration', permanent: true },
    { source: '/tag/:slug*', destination: '/?ref=migration', permanent: true },
    { source: '/:year/:month/:slug*', destination: '/?ref=migration', permanent: true },

    // Catch-all for any unmatched review pages
    { source: '/reviews/:slug', destination: '/?ref=migration', permanent: true },
    { source: '/review/:slug', destination: '/?ref=migration', permanent: true },
    { source: '/tool/:slug', destination: '/?ref=migration', permanent: true },
    { source: '/tools/:slug', destination: '/?ref=migration', permanent: true },
  ];
};

module.exports = migrationRedirects;
