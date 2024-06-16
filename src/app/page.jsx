import NavbarPage from '@/layouts/main/NavbarPage';
import './page.scss';
import LandingPage from '@/components/landing-page/LandingPage';

export default function Home() {
  return (
    <NavbarPage>
      <LandingPage />
    </NavbarPage>
  );
}
