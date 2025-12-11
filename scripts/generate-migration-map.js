const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://aitooladvisor.com';
const SITEMAP_URLS = [
  `${SITE_URL}/sitemap_index.xml`,
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/post-sitemap.xml`,
  `${SITE_URL}/page-sitemap.xml`,
];

async function fetchSitemap(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Migration-Bot/1.0)',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.log(`  ⚠️  Could not fetch: ${url}`);
    return null;
  }
}

async function parseSitemap(xmlData) {
  const parser = new xml2js.Parser();
  try {
    const result = await parser.parseStringPromise(xmlData);
    return result;
  } catch (error) {
    console.error('Error parsing XML:', error.message);
    return null;
  }
}

function extractUrls(sitemapData) {
  const urls = [];

  // Handle sitemap index (contains links to other sitemaps)
  if (sitemapData?.sitemapindex?.sitemap) {
    for (const sitemap of sitemapData.sitemapindex.sitemap) {
      if (sitemap.loc && sitemap.loc[0]) {
        urls.push({ type: 'sitemap', url: sitemap.loc[0] });
      }
    }
  }

  // Handle regular sitemap (contains page URLs)
  if (sitemapData?.urlset?.url) {
    for (const urlEntry of sitemapData.urlset.url) {
      if (urlEntry.loc && urlEntry.loc[0]) {
        urls.push({ type: 'page', url: urlEntry.loc[0] });
      }
    }
  }

  return urls;
}

function categorizeUrl(url) {
  const urlLower = url.toLowerCase();
  const pathname = new URL(url).pathname;

  // Skip homepage and common non-content pages
  if (pathname === '/' || pathname === '') {
    return null;
  }

  // Writing/Copywriting category
  if (urlLower.includes('writing') || urlLower.includes('copy') ||
      urlLower.includes('content') || urlLower.includes('blog') ||
      urlLower.includes('seo') || urlLower.includes('article')) {
    return 'writing';
  }

  // Design/Video category
  if (urlLower.includes('design') || urlLower.includes('video') ||
      urlLower.includes('image') || urlLower.includes('graphic') ||
      urlLower.includes('art') || urlLower.includes('photo')) {
    return 'design';
  }

  // Vibe Coding category
  if (urlLower.includes('coding') || urlLower.includes('dev') ||
      urlLower.includes('code') || urlLower.includes('program') ||
      urlLower.includes('software') || urlLower.includes('app') ||
      urlLower.includes('web') || urlLower.includes('build')) {
    return 'vibe-coding';
  }

  // Productivity category
  if (urlLower.includes('product') || urlLower.includes('tool') ||
      urlLower.includes('automat') || urlLower.includes('workflow')) {
    return 'productivity';
  }

  // Default fallback
  return 'all';
}

function generateRedirect(url, category) {
  const pathname = new URL(url).pathname;

  // Clean up the pathname (remove trailing slash)
  const source = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  if (!source || source === '/') {
    return null;
  }

  const destination = category
    ? `/?category=${category}&ref=migration`
    : '/?ref=migration';

  return {
    source,
    destination,
    permanent: true,
  };
}

async function main() {
  console.log('\n🔍 AiToolAdvisor SEO Migration Map Generator\n');
  console.log('━'.repeat(50));

  const allPageUrls = [];
  const processedSitemaps = new Set();

  // Try each sitemap URL
  for (const sitemapUrl of SITEMAP_URLS) {
    if (processedSitemaps.has(sitemapUrl)) continue;

    console.log(`\n📡 Fetching: ${sitemapUrl}`);
    const xmlData = await fetchSitemap(sitemapUrl);

    if (!xmlData) continue;

    processedSitemaps.add(sitemapUrl);
    const parsed = await parseSitemap(xmlData);

    if (!parsed) continue;

    const urls = extractUrls(parsed);
    console.log(`   Found ${urls.length} entries`);

    for (const entry of urls) {
      if (entry.type === 'sitemap') {
        // Fetch nested sitemap
        if (!processedSitemaps.has(entry.url)) {
          console.log(`\n📡 Fetching nested sitemap: ${entry.url}`);
          const nestedXml = await fetchSitemap(entry.url);
          if (nestedXml) {
            processedSitemaps.add(entry.url);
            const nestedParsed = await parseSitemap(nestedXml);
            if (nestedParsed) {
              const nestedUrls = extractUrls(nestedParsed);
              console.log(`   Found ${nestedUrls.length} pages`);
              allPageUrls.push(...nestedUrls.filter(u => u.type === 'page').map(u => u.url));
            }
          }
        }
      } else {
        allPageUrls.push(entry.url);
      }
    }
  }

  // Remove duplicates
  const uniqueUrls = [...new Set(allPageUrls)];

  console.log('\n' + '━'.repeat(50));
  console.log(`\n📊 Total unique URLs found: ${uniqueUrls.length}\n`);

  // Generate redirects
  const redirects = [];
  const categoryCount = {
    'writing': 0,
    'design': 0,
    'vibe-coding': 0,
    'productivity': 0,
    'all': 0,
  };

  for (const url of uniqueUrls) {
    const category = categorizeUrl(url);
    if (category) {
      categoryCount[category]++;
      const redirect = generateRedirect(url, category);
      if (redirect) {
        redirects.push(redirect);
      }
    }
  }

  // Print category breakdown
  console.log('📁 Category Distribution:');
  console.log(`   Writing/Copy:    ${categoryCount['writing']} URLs`);
  console.log(`   Design/Video:    ${categoryCount['design']} URLs`);
  console.log(`   Vibe Coding:     ${categoryCount['vibe-coding']} URLs`);
  console.log(`   Productivity:    ${categoryCount['productivity']} URLs`);
  console.log(`   General/Other:   ${categoryCount['all']} URLs`);

  // Generate redirects.js file
  const redirectsFileContent = `// Auto-generated SEO Migration Redirects
// Generated on: ${new Date().toISOString()}
// Source: ${SITE_URL}
// Total URLs mapped: ${redirects.length}

const migrationRedirects = async () => {
  return ${JSON.stringify(redirects, null, 2)};
};

module.exports = migrationRedirects;
`;

  const outputPath = path.join(__dirname, 'redirects.js');
  fs.writeFileSync(outputPath, redirectsFileContent);

  console.log('\n' + '━'.repeat(50));
  console.log(`\n✅ Migration Map Generated: ${redirects.length} URLs mapped to App Categories.`);
  console.log(`   📄 Output: ${outputPath}\n`);

  // Also output a summary JSON for reference
  const summaryPath = path.join(__dirname, 'migration-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceUrl: SITE_URL,
    totalUrls: uniqueUrls.length,
    totalRedirects: redirects.length,
    categoryBreakdown: categoryCount,
    sitemapsProcessed: [...processedSitemaps],
  }, null, 2));

  console.log(`   📊 Summary: ${summaryPath}\n`);
}

main().catch(console.error);
