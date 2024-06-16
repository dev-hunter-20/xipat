import NavbarPage from '@/layouts/main/NavbarPage';
import DetailAppPage from './_components/detail-app/DetailAppPage';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { AppDetail } from '@/seo/AppDetail';
import Script from 'next/script';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const app_id = params.app_id;
  let title, description, metaTitle, canonical;
  let appName = '',
    appMetaTitle = '',
    appMetaDesc = '';

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail && appDetail.data && appDetail.data.detail) {
      appName = appDetail.data.detail.name || '';
      appMetaTitle = appDetail.data.detail.metatitle || '';
      appMetaDesc = appDetail.data.detail.metadesc || '';
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  if (AppDetail) {
    const {
      title: getTitle,
      description: getDescription,
      metaTitle: getMetaTitle,
      canonical: getCanonical,
    } = AppDetail;
    title = getTitle(appName, appMetaTitle);
    description = getDescription(appName, appMetaDesc);
    metaTitle = getMetaTitle(appName, currentYear);
    canonical = getCanonical(app_id);
  }

  return {
    title: title || '',
    description: description || '',
    openGraph: {
      title: metaTitle || '',
      description: description || '',
    },
    alternates: {
      canonical: canonical || '',
    },
  };
};

export default async function DetailApp({ params }) {
  const app_id = params.app_id;
  let star = '',
    reviewCount = '',
    appIcon = '',
    desc = '',
    name = '';
  let jsonLd = null;

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail && appDetail.data && appDetail.data.detail) {
      star = appDetail.data.detail.star || '';
      reviewCount = appDetail.data.detail.review_count || '';
      appIcon = appDetail.data.detail.app_icon || '';
      desc = appDetail.data.detail.description || '';
      name = appDetail.data.detail.name || '';

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${name}`,
        url: `https://letsmetrix.com/app/${name}`,
        description: `${desc}`,
        image: `${appIcon}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          worstRating: '1',
          bestRating: '5',
          ratingValue: `${star}`,
          reviewCount: `${reviewCount}`,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  return (
    <>
      <NavbarPage>
        <DetailAppPage />
      </NavbarPage>
      {jsonLd && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="lazyOnload"
          id={app_id}
        />
      )}
    </>
  );
}
