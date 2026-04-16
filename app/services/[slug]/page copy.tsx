import Link from 'next/link';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import {
  getPublicServiceBySlug,
  getPublicServicesByCategorySlug,
  type PublicService,
  type PublicCategory,
} from '@/utils/api/public';
import type { Metadata } from 'next';
import styles from './style.module.scss';
import ServicePDPBootstrap from '@/components/mainwebsite/ServicePDPBootstrap';

const stripHtml = (html?: string) => {
  if (!html) return '';

  let cleaned = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/^\d+\.\s*/gm, '')
    .replace(/[\s\n\r]+/g, ' ')
    .trim();

  return cleaned;
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const serviceRes = await getPublicServiceBySlug(slug).catch(() => ({
    status: 'error' as const,
    message: 'Request failed',
  }));

  if (serviceRes.status !== 'success' || !serviceRes.data) {
    return (
      <div className={styles.errorState}>
        <Header />
        <div className={styles.errorContent}>
          <div className={styles.errorCard}>
            <h1 className={styles.errorTitle}>Service not found</h1>
            <p className={styles.errorMessage}>
              {'message' in serviceRes
                ? serviceRes.message
                : 'This service is unavailable right now.'}
            </p>
            <Link href="/services" className={styles.errorLink}>
              Back to Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const service = serviceRes.data;

  let related: PublicService[] = [];
  const catSlug =
    typeof service.category === 'object' && service.category
      ? (service.category as PublicCategory).slug
      : undefined;

  if (catSlug) {
    const rel = await getPublicServicesByCategorySlug(catSlug, {
      page: 1,
      limit: 12,
    }).catch(() => ({ status: 'error' as const }));

    if (rel.status === 'success' && rel.data) {
      related = rel.data.filter((s) => s._id !== service._id).slice(0, 4);
    }
  }

  const catName =
    typeof service.category === 'object' && service.category
      ? (service.category as any).name
      : '';

  const subName =
    typeof service.sub_category === 'object' && service.sub_category
      ? (service.sub_category as any).name
      : '';

  const serviceData = {
    _id: service._id,
    slug: (service as any).slug,
    name: service.name,
    bestTreatment: (service as any).bestTreatment,
    popularProduct: (service as any).popularProduct,
    service_charge: service.service_charge
      ? parseFloat(service.service_charge as any)
      : undefined,
    consult_charge: service.consult_charge
      ? parseFloat(service.consult_charge as any)
      : undefined,
    estimate_time: service.estimate_time,
    description: service.description,
    aboutUs: (service as any).aboutUs,
    benefits: (service as any).benefits,
    postTreatmentCare: (service as any).postTreatmentCare,
    faq: (service as any).faq,
    tags: (service as any).tags,
    category: service.category,
    sub_category: (service as any).sub_category,
    images: Array.isArray((service as any).images)
      ? (service as any).images
      : service.image
      ? [service.image]
      : [],
    image: service.image,
  };

  return (
    <div className={styles.serviceDetailPage}>
      <Header />

      <ServicePDPBootstrap
        service={serviceData}
        catName={catName}
        subName={subName}
        related={related}
      />

      <Footer />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublicServiceBySlug(slug).catch(() => ({
    status: 'error' as const,
    data: null,
  }));

  if (res.status !== 'success' || !res.data) {
    return {
      title: 'Service | SIAMA',
      description:
        'Explore SIAMA services tailored for laser, skin, and hair treatments.',
    };
  }

  const name = res.data.name || 'Service';
  const desc =
    (res.data as any).aboutUs ||
    stripHtml(res.data.description) ||
    'Discover this SIAMA service with expert care and tailored outcomes.';

  return {
    title: `${name} | SIAMA`,
    description: desc.slice(0, 150),
  };
}