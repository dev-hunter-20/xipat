import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import CategoryCollectionDetail from '@/components/category-collection/CategoryCollectionDetail';
import NavbarPage from '@/layouts/main/NavbarPage';
import { categories } from '@/seo/AppDashboard';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const slug = params.slug;
  const categoryData = await CategoriesApiService.getConversationCategory(
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
  const { title, description, metaTitle, canonical } = categories;

  return {
    title: title(categoryData.data.text, currentYear),
    description: description(categoryData.data.text),
    openGraph: {
      title: metaTitle(categoryData.data.text),
      description: description(categoryData.data.text),
    },
    alternates: {
      canonical: canonical(slug),
    },
  };
};

export default function Category() {
  return (
    <NavbarPage>
      <CategoryCollectionDetail />
    </NavbarPage>
  );
}
