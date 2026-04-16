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
            {service?.areasTreatedSection?.enabled && (
  <section className="py-5 bg-light">
    <div className="container">
      {/* Heading */}
      <div className="text-center mb-5">
        {service.areasTreatedSection.badge && (
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
            {service.areasTreatedSection.badge}
          </span>
        )}
        {service.areasTreatedSection.title && (
          <h2 className="fw-bold mb-3">{service.areasTreatedSection.title}</h2>
        )}
        {service.areasTreatedSection.subtitle && (
          <p className="text-muted mx-auto" style={{ maxWidth: "850px" }}>
            {service.areasTreatedSection.subtitle}
          </p>
        )}
      </div>

      {/* Women + Men */}
   
{(womenExists || menExists) && (
  <div className="mb-5">
    <div className="row g-4">
      {/* Women */}
      {womenExists && (
        <div className={cardColClass}>
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(13,110,253,0.1)",
                  }}
                >
                  <i className="bi bi-gender-female text-primary fs-4"></i>
                </div>
                <h3 className="h4 fw-bold mb-0">For Women</h3>
              </div>

              {service?.areasTreatedSection?.womenIntro && (
                <p className="text-muted mb-4">
                  {service.areasTreatedSection.womenIntro}
                </p>
              )}

              {(service?.areasTreatedSection?.womenAreas || []).length > 0 && (
                <ul className="list-unstyled mb-0">
                  {(service.areasTreatedSection.womenAreas || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="d-flex align-items-start mb-3">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3"
                          style={{
                            width: "28px",
                            height: "28px",
                            background: "rgba(25,135,84,0.12)",
                          }}
                        >
                          <i className="bi bi-check-lg text-success small"></i>
                        </span>
                        <span className="text-dark">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Men */}
      {menExists && (
        <div className={cardColClass}>
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(13,110,253,0.1)",
                  }}
                >
                  <i className="bi bi-gender-male text-primary fs-4"></i>
                </div>
                <h3 className="h4 fw-bold mb-0">For Men</h3>
              </div>

              {service?.areasTreatedSection?.menIntro && (
                <p className="text-muted mb-4">
                  {service.areasTreatedSection.menIntro}
                </p>
              )}

              {(service?.areasTreatedSection?.menAreas || []).length > 0 && (
                <ul className="list-unstyled mb-0">
                  {(service.areasTreatedSection.menAreas || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="d-flex align-items-start mb-3">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3"
                          style={{
                            width: "28px",
                            height: "28px",
                            background: "rgba(25,135,84,0.12)",
                          }}
                        >
                          <i className="bi bi-check-lg text-success small"></i>
                        </span>
                        <span className="text-dark">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      {/* How It Works */}
      {(service.areasTreatedSection.howItWorksTitle ||
        (service.areasTreatedSection.howItWorksParagraphs || []).length > 0) && (
        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-body p-4 p-lg-5">
            {service.areasTreatedSection.howItWorksTitle && (
              <h3 className="h4 fw-bold mb-3">
                {service.areasTreatedSection.howItWorksTitle}
              </h3>
            )}

            {(service.areasTreatedSection.howItWorksParagraphs || []).map(
              (paragraph: string, index: number) => (
                <p key={index} className="text-muted mb-3">
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>
      )}

      {/* Benefits */}
      {(service.areasTreatedSection.benefitsTitle ||
        (service.areasTreatedSection.benefits || []).length > 0) && (
        <div className="mb-5">
          <div className="text-center mb-4">
            {service.areasTreatedSection.benefitsTitle && (
              <h3 className="fw-bold">{service.areasTreatedSection.benefitsTitle}</h3>
            )}
            {service.areasTreatedSection.benefitsSubtitle && (
              <p className="text-muted mb-0">
                {service.areasTreatedSection.benefitsSubtitle}
              </p>
            )}
          </div>

        
<div
  className="rounded-4 shadow-sm border p-4 p-lg-5"
  style={{
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    borderColor: "rgba(13, 110, 253, 0.08)",
  }}
>
  <div className="row align-items-center mb-4">
    <div className="col-lg-8">
      <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
        Why Choose This Treatment
      </span>
      <h3 className="fw-bold mb-2">Benefits of Laser Hair Removal</h3>
      <p className="text-muted mb-0">
        Safe, effective, and designed for smoother skin with long-term convenience.
      </p>
    </div>

    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: "72px",
          height: "72px",
          background: "rgba(13, 110, 253, 0.08)",
        }}
      >
        <i className="bi bi-stars text-primary fs-2"></i>
      </div>
    </div>
  </div>

  <div className="row g-3">
    {(service?.areasTreatedSection?.benefits || []).map(
      (item: string, index: number) => (
        <div key={index} className="col-md-6">
          <div
            className="d-flex align-items-start h-100 rounded-4 px-3 py-3"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(13, 110, 253, 0.08)",
            }}
          >
            <span
              className="me-3 d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 fw-bold text-primary"
              style={{
                width: "34px",
                height: "34px",
                background: "rgba(13, 110, 253, 0.08)",
                fontSize: "14px",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <p
              className="mb-0 text-dark fw-medium"
              style={{ lineHeight: "1.7" }}
            >
              {item}
            </p>
          </div>
        </div>
      )
    )}
  </div>
</div>
        </div>
      )}

      {/* Before / After */}
      <div className="row g-4 mb-5">
        {/* Before */}
        {(service.areasTreatedSection.beforeTitle ||
          (service.areasTreatedSection.beforeItems || []).length > 0) && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                {service.areasTreatedSection.beforeTitle && (
                  <h3 className="h4 fw-bold mb-3">
                    {service.areasTreatedSection.beforeTitle}
                  </h3>
                )}
                <ul className="list-unstyled mb-0 mt-4">
                  {(service.areasTreatedSection.beforeItems || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="mb-1">
                        <i className="bi bi-dot fs-4 text-primary me-2"></i>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* After */}
        {(service.areasTreatedSection.afterTitle ||
          (service.areasTreatedSection.afterItems || []).length > 0) && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                {service.areasTreatedSection.afterTitle && (
                  <h3 className="h4 fw-bold mb-3">
                    {service.areasTreatedSection.afterTitle}
                  </h3>
                )}
                <ul className="list-unstyled mb-0 mt-4">
                  {(service.areasTreatedSection.afterItems || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="mb-1">
                        <i className="bi bi-dot fs-4 text-primary me-2"></i>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ideal / Not Ideal */}
      <div className="row g-4 mb-5">
        {/* Ideal */}
        {(service.areasTreatedSection.idealTitle ||
          (service.areasTreatedSection.idealItems || []).length > 0) && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                {service.areasTreatedSection.idealTitle && (
                  <h3 className="h4 fw-bold text-success mb-3">
                    {service.areasTreatedSection.idealTitle}
                  </h3>
                )}
                <ul className="list-unstyled mb-0 mt-4">
                  {(service.areasTreatedSection.idealItems || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-lg text-success me-2"></i>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Not Ideal */}
        {(service.areasTreatedSection.notIdealTitle ||
          (service.areasTreatedSection.notIdealItems || []).length > 0) && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                {service.areasTreatedSection.notIdealTitle && (
                  <h3 className="h4 fw-bold text-danger mb-3">
                    {service.areasTreatedSection.notIdealTitle}
                  </h3>
                )}
                <ul className="list-unstyled mb-0 mt-4">
                  {(service.areasTreatedSection.notIdealItems || []).map(
                    (item: string, index: number) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-x-lg text-danger me-2"></i>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      {(service.areasTreatedSection.ctaTitle || service.areasTreatedSection.ctaText) && (
        <div className="card border-0 bg-primary text-white rounded-4 shadow-sm overflow-hidden">
          <div className="card-body p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                {service.areasTreatedSection.ctaTitle && (
                  <h3 className="fw-bold mb-3">{service.areasTreatedSection.ctaTitle}</h3>
                )}
                {service.areasTreatedSection.ctaText && (
                  <p className="mb-0 opacity-75">{service.areasTreatedSection.ctaText}</p>
                )}
              </div>
              <div className="col-lg-4 text-lg-end">
                <a
                  href={service.areasTreatedSection.ctaButtonLink || ""}
                  className="btn btn-light btn-lg px-4 rounded-pill fw-semibold"
                >
                  {service.areasTreatedSection.ctaButtonText || "Book Consultation"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
)}
            {/* {service.aboutUs && (
              <div className={styles.aboutSection}>
             <div dangerouslySetInnerHTML={{ __html: service.aboutUs }} />
                <p className={styles.aboutLabel}>About</p>
                <p className={styles.aboutText}>{stripHtml(service.aboutUs)}</p>
              </div>
            )} */}
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