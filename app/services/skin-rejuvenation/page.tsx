import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import SubCategoryServiceListing from '@/components/mainwebsite/services/SubCategoryServiceListing';
import { SUB_CATEGORY_BY_SLUG } from '@/config/subCategoryServices';

const { id, label } = SUB_CATEGORY_BY_SLUG['skin-rejuvenation'];

export default function SkinRejuvenationPage() {
  return (
    <>
      <Header />
      <main className="main-content">
        <SubCategoryServiceListing subCategoryId={id} pageTitle={label} />
      </main>
      <Footer />
    </>
  );
}
