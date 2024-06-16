import NavbarPage from '@/layouts/main/NavbarPage';
import ReviewAppDetail from './_components/ReviewAppDetail';
import { ReviewDetail } from '@/seo/Reviews';

export const generateMetadata = async ({ searchParams }) => {
  const queryString = new URLSearchParams(searchParams).toString();
  const { canonical } = ReviewDetail;

  return {
    alternates: {
      canonical: canonical(queryString),
    },
  };
};

export default function Review() {
  return (
    <NavbarPage>
      <ReviewAppDetail />
    </NavbarPage>
  );
}
