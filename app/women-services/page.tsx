import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import type { Metadata } from 'next';
import MenServicesClient from '@/components/mainwebsite/women-services/WoMenServicesClient';

export const metadata: Metadata = {
  title: 'Women Services | SIAMA',
  description: 'Expert laser hair reduction and grooming services for women.',
};

async function getWomenServices(page: number) {
  try {
    const response = await fetch(
      `https://api.siama.in/api/v1/public/services?page=${page}&limit=20&sortBy=created_at&sortOrder=desc&category=665451b416a3fd61d1e6e104&status=true`,
      { cache: 'no-store' }
    );

    if (!response.ok) throw new Error('Failed to fetch services');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: [], meta: {} };
  }
}

export default async function WomenServicesPage({ searchParams }: any) {
  const page = parseInt(searchParams?.page || '1');

  const response = await getWomenServices(page);

  const services = response?.data || [];
  const totalPages = response?.meta?.totalPages || 1;

  return (
    <div>
      <Header />

      <MenServicesClient initialServices={services} />

      {/* ✅ Pagination UI */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        {page > 1 && (
          <a href={`?page=${page - 1}`} style={{ marginRight: '10px' }}>
            ⬅ Prev
          </a>
        )}

        <span>Page {page} of {totalPages}</span>

        {page < totalPages && (
          <a href={`?page=${page + 1}`} style={{ marginLeft: '10px' }}>
            Next ➡
          </a>
        )}
      </div>

      <Footer />
    </div>
  );
}