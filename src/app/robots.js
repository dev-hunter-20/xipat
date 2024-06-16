import { DOMAIN } from '@/constants/ApiUrl';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/static/js/',
        '/admin-blog/wp-json/',
        '/static/css/',
        '/api.letsmetrix.com/',
        '/api-wix.letsmetrix.com/',
      ],
    },
    sitemap: `${DOMAIN}sitemap.xml`,
  };
}
