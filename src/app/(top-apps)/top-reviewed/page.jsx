import NavbarPage from '@/layouts/main/NavbarPage';
import TopMostReviews from './_components/MostReviewes';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-reviewed`,
  },
};

export default function TopReviewed() {
  return (
    <NavbarPage>
      <TopMostReviews />
    </NavbarPage>
  );
}
