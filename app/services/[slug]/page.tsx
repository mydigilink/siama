import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import {
  getPublicServiceBySlug,
  getPublicServicesByCategorySlug,
  type PublicService,
  type PublicCondition,
  type PublicCategory,
} from '@/utils/api/public';
import RelatedServicesCarousel from '@/components/mainwebsite/services/RelatedServicesCarousel';
import CareCard from '@/components/mainwebsite/services/CareCard';
import ServicePageClient from '@/components/mainwebsite/services/ServicePageClient';
import ServiceHeroActions from '@/components/mainwebsite/ServiceHeroActions';
import type { Metadata } from 'next';
import styles from './style.module.scss';

const toArray = <T,>(val?: T[] | undefined): T[] => (Array.isArray(val) ? val : []);

const stripHtml = (html?: string) => {
  if (!html) return '';

  return html
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
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/^\d+\.\s*/gm, '')
    .replace(/[\s\n\r]+/g, ' ')
    .trim();
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceDetailPage({ params }: PageProps) {
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
  const womenExists =
  !!service?.areasTreatedSection?.womenIntro ||
  (service?.areasTreatedSection?.womenAreas || []).length > 0;

const menExists =
  !!service?.areasTreatedSection?.menIntro ||
  (service?.areasTreatedSection?.menAreas || []).length > 0;

const cardColClass =
  womenExists && menExists ? "col-lg-6" : "col-12";

  let related: PublicService[] = [];
  const catSlug =
    typeof service.category === 'object' && service.category
      ? (service.category as PublicCategory).slug
      : undefined;

  if (catSlug) {
    const rel = await getPublicServicesByCategorySlug(catSlug, { page: 1, limit: 12 }).catch(
      () => ({ status: 'error' as const })
    );

    if (rel.status === 'success' && rel.data) {
      related = rel.data.filter((s) => s._id !== service._id).slice(0, 4);
    }
  }

  const catName =
    typeof service.category === 'object' && service.category
      ? (service.category as PublicCategory).name
      : '';

  const subName =
    typeof service.sub_category === 'object' && service.sub_category
      ? (service.sub_category as any).name
      : '';

  const serviceData = {
    _id: service._id,
    name: service.name,
    service_charge: service.service_charge ? parseFloat(String(service.service_charge)) : undefined,
    consult_charge: service.consult_charge ? parseFloat(String(service.consult_charge)) : undefined,
    estimate_time: service.estimate_time,
    image: service.image,
  };

  return (
    <ServicePageClient service={serviceData}>
      <div className={styles.serviceDetailPage}>
        <Header />

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.heroImageWrapper}>
              <div className={styles.heroImageContainer}>
                <div className={styles.heroImageGlow}></div>
                <div className={styles.heroImageInner}>
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name || 'Service'}
                      width={575}
                      height={380}
                      className={styles.heroImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 575px"
                      quality={95}
                      priority
                    />
                  ) : (
                    <div className={styles.heroImagePlaceholder}>No image</div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.heroContent}>
              {/* Top Badges */}
              <div className={styles.heroBadges}>
                {catName && <span className={styles.heroBadge}>{catName}</span>}
                {subName && <span className={styles.heroBadge}>{subName}</span>}
                {service.bestTreatment && (
                  <span className={`${styles.heroBadge} ${styles.heroBadgeBest}`}>Best Seller</span>
                )}
                {service.popularProduct && (
                  <span className={`${styles.heroBadge} ${styles.heroBadgePopular}`}>
                    Popular Choice
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={styles.heroTitle}>{service.name}</h1>

              {/* Rating */}
              <div className={styles.heroRatingRow}>
                <div className={styles.heroStars}>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                </div>
               
              </div>

              {/* Price */}
              <div className={styles.heroPriceBlock}>
                <div className={`mainPrice ${styles.heroMainPrice}`}>
                  {service.service_charge ? `₹${service.service_charge}` : 'Price on request'}
                </div>

                <div className={styles.heroMetaRow}>
                  {service.consult_charge ? (
                    <span className={styles.heroMetaItem}>
                      Consultation fee: <strong>₹{service.consult_charge}</strong>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Trust */}
              {/* <div className={styles.heroTrustRow}>
                <span className={styles.heroTrustItem}>✔ Minimal downtime</span>
                <span className={styles.heroTrustItem}>✔ Hygienic procedure</span>
                <span className={styles.heroTrustItem}>✔ Expert care</span>
              </div> */}
{service.aboutUs && (
              <div className={styles.aboutSection}>
             <div dangerouslySetInnerHTML={{ __html: service.aboutUs }} />
                {/* <p className={styles.aboutLabel}>About</p> */}
                {/* <p className={styles.aboutText}>{stripHtml(service.aboutUs)}</p> */}
              </div>
            )}
              {/* Tags */}
              {/* {service.tags && service.tags.length > 0 && (
                <div className={styles.heroTags}>
                  {service.tags.map((t, idx) => {
                    const name =
                      typeof t === 'string' ? t : (t as PublicCondition)?.name || (t as any)?._id || '';
                    if (!name) return null;

                    return (
                      <span key={idx} className={styles.heroTag}>
                        {name}
                      </span>
                    );
                  })}
                </div>
              )} */}

              {/* Client-side CTA + Modal */}
              <ServiceHeroActions />

              {/* <p className={styles.heroAssuranceText}>
                Trusted treatment with transparent pricing and expert guidance.
              </p> */}
            </div>
          </div>
        </div>

        <main className={styles.mainContent}>
          {/* Description */}
          <section className="container">
            <h2 className={styles.sectionTitle}>Overview</h2>
            <div
              className={styles.sectionContent}
              dangerouslySetInnerHTML={{
                __html: service.description || '<p>No description available.</p>',
              }}
            />
      
          </section>

          {/* Benefits & Care */}
          {/* <section className={styles.benefitsGrid}>
            <div className="container">
              <div className="row g-4">
                <CareCard
                  title="Pre-Treatment Care"
                  items={toArray(service.benefits)}
                  itemKey="benefits"
                  emptyMessage="No benefits listed."
                />
                <CareCard
                  title="Post-Treatment Care"
                  items={toArray(service.postTreatmentCare)}
                  itemKey="tips"
                  emptyMessage="No care tips listed."
                />
              </div>
            </div>
          </section> */}

          {/* FAQ */}
          <section
            className="container"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            <div className={styles.contentSection}>
              <h3 className={styles.sectionTitle}>FAQs</h3>
              <ul className={styles.faqList}>
                {toArray(service.faq).length ? (
                  toArray(service.faq).map((f, idx) => (
                    <li
                      key={idx}
                      className={styles.faqItem}
                      itemScope
                      itemProp="mainEntity"
                      itemType="https://schema.org/Question"
                    >
                      <p className={styles.faqQuestion} itemProp="name">
                        {f.question}
                      </p>
                      <div
                        itemScope
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                      >
                        <p className={styles.faqAnswer} itemProp="text">
                          {f.answer}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className={styles.emptyList}>No FAQs available.</li>
                )}
              </ul>
            </div>
          </section>

          {/* Gallery */}
          {service.images && service.images.length > 0 && (
            <section className="container mb-5">
              <div className={styles.contentSection}>
                <h3 className={styles.sectionTitle}>Gallery</h3>
                <div className={styles.galleryGrid}>
                  {service.images
                    .filter(
                      (img) =>
                        img &&
                        (img.startsWith('/') ||
                          img.startsWith('http://') ||
                          img.startsWith('https://'))
                    )
                    .map((img, idx) => (
                      <div key={idx} className={styles.galleryItem}>
                        <Image
                          src={img}
                          alt={`${service.name} ${idx + 1}`}
                          fill
                          className={styles.galleryImage}
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className={styles.contentSection}>
              <div className={styles.relatedHeader}>
                <div className={styles.relatedTitle}>
                  <h3 className={styles.relatedTitleText}>Related services</h3>
                  <p className={styles.relatedSubtitle}>More options you may like.</p>
                </div>
                <Link href="/services" className={styles.viewAllButton}>
                  <span>View all</span>
                  <svg
                    className={styles.viewAllIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <RelatedServicesCarousel services={related} />
            </section>
          )}
        </main>

        <Footer />
      </div>
    </ServicePageClient>
  );
}

// SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublicServiceBySlug(slug).catch(() => ({
    status: 'error' as const,
    data: null,
  }));

  if (res.status !== 'success' || !res.data) {
    return {
      title: 'Service | SIAMA',
      description: 'Explore SIAMA services tailored for laser, skin, and hair treatments.',
    };
  }

  const name = res.data.name || 'Service';
  const desc =
    res.data.aboutUs ||
    stripHtml(res.data.description) ||
    'Discover this SIAMA service with expert care and tailored outcomes.';

  return {
    title: `${name} | SIAMA`,
    description: desc.slice(0, 155),
    openGraph: {
      title: `${name} | SIAMA`,
      description: desc.slice(0, 155),
      images: res.data.image ? [res.data.image] : [],
    },
  };
}