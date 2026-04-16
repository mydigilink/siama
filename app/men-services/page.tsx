import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import type { Metadata } from 'next';
import MenServicesClient from '@/components/mainwebsite/men-services/MenServicesClient';

export const metadata: Metadata = {
  title: 'Men Services | SIAMA',
  description: 'Expert laser hair reduction and grooming services for men. Professional treatments with advanced technology.',
};

async function getMenServices() {
  try {
    const response = await fetch(
      'https://api.siama.in/api/v1/public/services?page=1&limit=20&sortBy=created_at&sortOrder=desc&category=6654515f16a3fd61d1e6e101&status=true',
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    const data = await response.json();
    return data.status === 'success' ? data.data : [];
  } catch (error) {
    console.error('Error fetching men services:', error);
    return [];
  }
}

export default async function MenServicesPage() {
  const services = await getMenServices();

  return (
    <div>
      <Header />
      <MenServicesClient initialServices={services} />
      <Footer />
    </div>
  );
}
