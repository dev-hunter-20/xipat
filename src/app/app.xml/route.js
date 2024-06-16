import { NextResponse } from 'next/server';
import axios from 'axios';
import { DOMAIN, URL_API } from '@/constants/ApiUrl';

export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_API_TOKEN;
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentDate = new Date().toISOString();
    const apps = await axios.post(
      `https://api.letsmetrix.com/app`,
      {
        page: 1,
        per_page: 30000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );

    const urls = [
      ...apps.data.apps.map((item) => ({
        loc: `https://letsmetrix.com/app/${item.app_id}`,
        lastmod: currentDate,
      })),
      ...apps.data.apps.map((item) => ({
        loc: `https://letsmetrix.com/app/${item.app_id}/reviews`,
        lastmod: currentDate,
      })),
    ];

    let sitemapXmlApp = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXmlApp += `
        <url>
          <loc>${url.loc}</loc>
          <changefreq>weekly</changefreq>
          <lastmod>${url.lastmod}</lastmod>
          <priority>0.8</priority>
        </url>`;
    });

    sitemapXmlApp += `
      </urlset>`;

    return new NextResponse(sitemapXmlApp, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
