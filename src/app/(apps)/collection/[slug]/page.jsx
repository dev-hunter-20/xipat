import NavbarPage from '@/layouts/main/NavbarPage';
import CategoryCollectionDetail from '@/components/category-collection/CategoryCollectionDetail';
import { collections } from '@/seo/AppDashboard';
import CategoriesApiService from '@/api-services/api/CategoriesApiService';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const slug = params.slug;
  const collection = await CategoriesApiService.getConversationCollection(
    slug,
    'best_match',
    1,
    20,
    'uk',
    'rank',
    'all',
    0,
    0,
  );
  const { title, description, metaTitle, canonical } = collections;

  return {
    title: title(collection.data.text, currentYear),
    description: description(collection.data.text, currentYear),
    openGraph: {
      title: metaTitle(collection.data.text, currentYear),
      description: description(collection.data.text, currentYear),
    },
    alternates: {
      canonical: canonical(slug),
    },
  };
};

export default function Collection() {
  return (
    <NavbarPage>
      <CategoryCollectionDetail />
    </NavbarPage>
  );
}
