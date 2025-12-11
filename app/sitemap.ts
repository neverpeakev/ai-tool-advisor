import { MetadataRoute } from 'next';
import { TOOLS, getAllComparisonSlugs } from '@/lib/tools-data';
import { getAllRoleSlugs } from '@/lib/seo-configs';

const BASE_URL = 'https://aitooladvisor.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Homepage
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Tool category pages (via query params - for SEO these would ideally be separate routes)
  const categoryRoutes: MetadataRoute.Sitemap = [
    'vibe-coding',
    'design',
    'writing',
    'productivity',
  ].map((category) => ({
    url: `${BASE_URL}/?category=${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Comparison pages - /compare/[toolA-vs-toolB]
  const comparisonSlugs = getAllComparisonSlugs();
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Role pages - /for/[role]
  const roleSlugs = getAllRoleSlugs();
  const roleRoutes: MetadataRoute.Sitemap = roleSlugs.map((slug) => ({
    url: `${BASE_URL}/for/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Generate additional comparison permutations for cross-category comparisons
  const additionalComparisons: MetadataRoute.Sitemap = [];

  // Popular cross-category comparisons
  const popularCrossCategory = [
    'lovable-vs-jasper',
    'cursor-vs-midjourney',
    'capcut-vs-jasper',
    'bolt-new-vs-writesonic',
    'shopify-vs-lovable',
  ];

  popularCrossCategory.forEach((slug) => {
    if (!comparisonSlugs.includes(slug)) {
      additionalComparisons.push({
        url: `${BASE_URL}/compare/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  });

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...roleRoutes,
    ...comparisonRoutes,
    ...additionalComparisons,
  ];

  console.log(`Sitemap generated with ${allRoutes.length} URLs:`);
  console.log(`  - Static: ${staticRoutes.length}`);
  console.log(`  - Categories: ${categoryRoutes.length}`);
  console.log(`  - Roles: ${roleRoutes.length}`);
  console.log(`  - Comparisons: ${comparisonRoutes.length}`);
  console.log(`  - Additional: ${additionalComparisons.length}`);

  return allRoutes;
}
