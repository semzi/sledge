import fs from 'fs';
import { resolve } from 'path';

// Define the base URL
const BASE_URL = 'https://sledgementorship.com';

// Define static routes
const routes = [
  '/',
  '/mentorship',
  '/plus',
  '/schedule',
  '/plus/schedule',
  '/program',
  '/contact',
  '/mentors',
  '/community',
  '/book-a-session',
  '/partners',
  '/terms',
  '/privacy',
  '/license'
];

// Generate XML content
const generateSitemap = () => {
  const date = new Date().toISOString().split('T')[0];
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${date}</lastmod>
    <priority>${route === '/' ? '1.0' : route.includes('plus') || route.includes('mentorship') ? '0.9' : '0.7'}</priority>
  </url>`).join('')}
</urlset>`;

  const publicPath = resolve('public/sitemap.xml');
  fs.writeFileSync(publicPath, sitemapXml);
  console.log('✅ Sitemap generated successfully!');
};

generateSitemap();
