import NavbarPage from '@/layouts/main/NavbarPage';
import DeveloperDetail from './_components/DeveloperDetail';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import { DeveloperBySlug } from '@/seo/Developer';

export async function generateMetadata({ params }) {
  const currentYear = new Date().getFullYear();
  const developer_id = params.developer_id;
  const developerSlug = await DashboardDeveloperApiService.getDetailDeveloper(developer_id);

  const { title, description, metaTitle, metaDesc, canonical } = DeveloperBySlug;
  const name = developerSlug.data.name;

  return {
    title: title(name),
    description: description(name),
    openGraph: {
      title: metaTitle(name, currentYear),
      description: metaDesc(name),
    },
    alternates: {
      canonical: canonical(developer_id),
    },
  };
}

export default function DetailDeveloper() {
  return (
    <NavbarPage>
      <DeveloperDetail />
    </NavbarPage>
  );
}
