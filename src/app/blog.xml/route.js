import { NextResponse } from 'next/server';
import axios from 'axios';
import { DOMAIN } from '@/constants/ApiUrl';

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const blogs = await axios.get(`https://letsmetrix.com/admin-blog/wp-json/wp/v2/blogs`);

    const urls = blogs.data.map((item) => ({
      loc: `https://letsmetrix.com/blogs/${item.slug}`,
      lastmod: currentDate,
    }));

    let sitemapXml = `<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXml += `
      <url>
        <loc>${url.loc}</loc>
        <changefreq>weekly</changefreq>
        <lastmod>${url.lastmod}</lastmod>
        <priority>0.6</priority>
      </url>`;
    });

    sitemapXml += `
    </urlset>`;

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
