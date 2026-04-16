import Link from 'next/link';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import type { Metadata } from 'next';
import {
  getPublicServices,
  getPublicCategories,
  getPublicSubCategoriesByCategory,
  getPublicConditions,
  type PublicService,
  type PublicCategory,
  type PublicSubCategory,
  type PublicCondition,
} from '@/utils/api/public';
import ServicesListingClient from '@/components/mainwebsite/services/ServicesListingClient';
import styles from './style.module.scss';

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: 'Services | SIAMA',
  description: 'Browse expert laser, skin, and hair treatments. Filter by category, sub-category, popularity, and conditions to find the perfect service.',
};

export default async function ServicesListingPage() {
  const [categoriesRes, conditionsRes, servicesRes] = await Promise.all([
    getPublicCategories({ page: 1, limit: 200 }).catch(() => ({ status: 'error' as const })),
    getPublicConditions({ page: 1, limit: 200 }).catch(() => ({ status: 'error' as const })),
    getPublicServices({ page: 1, limit: PAGE_SIZE }).catch(() => ({ status: 'error' as const })),
  ]);

  const categories: PublicCategory[] = categoriesRes.status === 'success' && categoriesRes.data ? categoriesRes.data : [];
  const conditions: PublicCondition[] = conditionsRes.status === 'success' && conditionsRes.data ? conditionsRes.data : [];
  const initialServices: PublicService[] = servicesRes.status === 'success' && servicesRes.data ? servicesRes.data : [];
  const pagination = servicesRes.status === 'success' && servicesRes.pagination
    ? servicesRes.pagination
    : { page: 1, limit: PAGE_SIZE, total: initialServices.length, totalPages: 1 };

  return (
    <div className={styles.servicesPage}>
      <Header />
      <div className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <p className={styles.heroLabel}>Services</p>
          <h1 className={styles.heroTitle}>Expert treatments tailored to your needs</h1>
          <p className={styles.heroDescription}>
            Browse our curated services, filter by category, and find the perfect treatment with best and popular picks.
          </p>
        </div>
      </div>
      <ServicesListingClient
        initialServices={initialServices}
        initialPagination={pagination}
        categories={categories}
        conditions={conditions}
        pageSize={PAGE_SIZE}
      />
      <Footer />
    </div>
  );
}
