import NavbarPage from '@/layouts/main/NavbarPage';
import ReviewApp from '../_components/review/ReviewApp';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { AppDetailReviews } from '@/seo/AppDetail';

export const generateMetadata = async ({ params }) => {
  const app_id = params.app_id;
  const appDetail = await DetailAppApiService.getAppInfo(app_id);

  const { title, description, metaTitle, canonical } = AppDetailReviews;
  const appName = appDetail.data.detail.name;

  return {
    title: title(appName),
    description: description(appName),
    openGraph: {
      title: metaTitle(appName),
      description: description(appName),
    },
    alternates: {
      canonical: canonical(app_id),
    },
  };
};

export default function Reviews() {
  return (
    <NavbarPage>
      <ReviewApp />
    </NavbarPage>
  );
}
