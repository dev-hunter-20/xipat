import './globals.scss';
import AppProvider from './AppProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import QueryProvider from './QueryProvider';
import { landingPage } from '@/seo/LandingPage';
import dynamic from 'next/dynamic';
import ServiceWorker from './sw';

const CrispChat = dynamic(() => import('./CrispChat'), { ssr: false });
const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), { ssr: false });

const { canonical } = landingPage;

export const metadata = {
  title: `${landingPage.title}`,
  description: `${landingPage.description}`,
  alternates: {
    canonical: canonical,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppProvider>
            <AntdRegistry>
              {children}
              <CrispChat />
              <GoogleAnalytics />
              <ServiceWorker />
            </AntdRegistry>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
