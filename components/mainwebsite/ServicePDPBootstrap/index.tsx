'use client';

import Link from 'next/link';
import Image from 'next/image';
import RelatedServicesCarousel from '@/components/mainwebsite/services/RelatedServicesCarousel';
import CareCard from '@/components/mainwebsite/services/CareCard';
import styles from './ServicePDPBootstrap.module.scss';

type TagType = string | { name?: string; _id?: string };

type FAQItem = {
  question: string;
  answer: string;
};

type RelatedService = {
  _id?: string;
  slug?: string;
  name?: string;
  service_charge?: number | string;
  image?: string;
  images?: string[];
};

type ServiceType = {
  _id?: string;
  name: string;
  bestTreatment?: boolean;
  popularProduct?: boolean;
  service_charge?: number;
  consult_charge?: number;
  estimate_time?: string;
  description?: string;
  aboutUs?: string;
  benefits?: any[] | string;
  postTreatmentCare?: any[] | string;
  faq?: FAQItem[] | string;
  images?: string[];
  image?: string;
  tags?: TagType[];
  category?: { name?: string } | string;
  sub_category?: { name?: string } | string;
};

type Props = {
  service: ServiceType;
  catName?: string;
  subName?: string;
  related?: RelatedService[];
};

const toArray = (val?: any[] | string | undefined) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;

  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

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
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/[\s\n\r]+/g, ' ')
    .trim();
};

export default function ServicePDPBootstrap({
  service,
  catName,
  subName,
  related = [],
}: Props) {
  const allImages =
    Array.isArray(service.images) && service.images.length > 0
      ? service.images
      : service.image
      ? [service.image]
      : [];

  const validImages = allImages.filter(
    (img) =>
      img &&
      (img.startsWith('/') ||
        img.startsWith('http://') ||
        img.startsWith('https://'))
  );

  return (
    <div className={styles.pageWrap}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className={styles.heroCard}>
                <div className={styles.heroBadges}>
                  {catName && <span className={styles.heroBadge}>{catName}</span>}
                  {subName && <span className={styles.heroBadge}>{subName}</span>}
                  {service.bestTreatment && (
                    <span className={`${styles.heroBadge} ${styles.heroBadgeBest}`}>
                      Best
                    </span>
                  )}
                  {service.popularProduct && (
                    <span className={`${styles.heroBadge} ${styles.heroBadgePopular}`}>
                      Popular
                    </span>
                  )}
                </div>

                <h1 className={styles.heroTitle}>{service.name}</h1>

                <p className={styles.heroPrice}>
                  {service.service_charge
                    ? `₹${service.service_charge}`
                    : 'Price on request'}
                  {service.consult_charge
                    ? ` · Consult ₹${service.consult_charge}`
                    : ''}
                  {service.estimate_time ? ` · ${service.estimate_time}` : ''}
                </p>

                {service.tags && service.tags.length > 0 && (
                  <div className={styles.heroTags}>
                    {service.tags.map((t, idx) => {
                      const name =
                        typeof t === 'string' ? t : t?.name || t?._id || '';
                      return (
                        <span key={idx} className={styles.heroTag}>
                          {name}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className={styles.heroActions}>
                  <button
                    className={`${styles.heroAddToCartButton} hero-add-to-cart-trigger`}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2.5 3.33334H4.16667L6.40001 13.9917C6.47637 14.3753 6.68509 14.72 6.98975 14.9653C7.29441 15.2105 7.6752 15.3408 8.06667 15.3333H15.5C15.8915 15.3408 16.2723 15.2105 16.5769 14.9653C16.8816 14.72 17.0903 14.3753 17.1667 13.9917L18.3333 7.50001H5M8.33334 18.3333C8.33334 18.7936 7.96024 19.1667 7.50001 19.1667C7.03977 19.1667 6.66667 18.7936 6.66667 18.3333C6.66667 17.8731 7.03977 17.5 7.50001 17.5C7.96024 17.5 8.33334 17.8731 8.33334 18.3333ZM16.6667 18.3333C16.6667 18.7936 16.2936 19.1667 15.8333 19.1667C15.3731 19.1667 15 18.7936 15 18.3333C15 17.8731 15.3731 17.5 15.8333 17.5C16.2936 17.5 16.6667 17.8731 16.6667 18.3333Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add to Cart
                  </button>

                  <Link href="/contact" className={styles.bookButton}>
                    Book / Enquire
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={styles.heroImageWrap}>
                {validImages.length > 0 ? (
                  <div className={styles.heroImageBox}>
                    <Image
                      src={validImages[0]}
                      alt={service.name}
                      fill
                      className={styles.heroImage}
                      sizes="(max-width: 991px) 100vw, 40vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className={styles.heroImageFallback}>
                    <span>{service.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className={styles.mainContent}>
        <div className="container">
          {/* KEY INFO */}
          <section className={styles.keyInfoGrid}>
            <div className="row g-4">
              <div className="col-md-4">
                <div className={`${styles.keyInfoCard} ${styles.keyInfoCardGold}`}>
                  <div className={styles.keyInfoContent}>
                    <p className={`${styles.keyInfoLabel} ${styles.keyInfoLabelGold}`}>
                      Package
                    </p>
                    <p className={styles.keyInfoDescription}>Transparent pricing</p>
                  </div>
                  <div className={styles.keyInfoValue}>
                    <span className={styles.keyInfoValueAmount}>
                      {service.service_charge ? `₹${service.service_charge}` : 'N/A'}
                    </span>
                    <span className={styles.keyInfoValueLabel}>per package</span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className={`${styles.keyInfoCard} ${styles.keyInfoCardBlue}`}>
                  <div className={styles.keyInfoContent}>
                    <p className={`${styles.keyInfoLabel} ${styles.keyInfoLabelBlue}`}>
                      Duration
                    </p>
                    <p className={styles.keyInfoDescription}>Estimated time</p>
                  </div>
                  <span className={`${styles.keyInfoBadge} ${styles.keyInfoBadgeBlue}`}>
                    {service.estimate_time || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <div className={`${styles.keyInfoCard} ${styles.keyInfoCardIndigo}`}>
                  <div className={styles.keyInfoContent}>
                    <p className={`${styles.keyInfoLabel} ${styles.keyInfoLabelIndigo}`}>
                      Consult
                    </p>
                    <p className={styles.keyInfoDescription}>Optional consultation</p>
                  </div>
                  <span className={`${styles.keyInfoBadge} ${styles.keyInfoBadgeIndigo}`}>
                    {service.consult_charge ? `₹${service.consult_charge}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CATEGORY AND TAGS */}
          <section className={styles.categorySection}>
            <div className={styles.categoryTags}>
              {typeof service.category === 'object' && service.category && (
                <span className={`${styles.categoryTag} ${styles.categoryTagBlue}`}>
                  {(service.category as any).name}
                </span>
              )}

              {typeof service.sub_category === 'object' && service.sub_category && (
                <span className={`${styles.categoryTag} ${styles.categoryTagIndigo}`}>
                  {(service.sub_category as any).name}
                </span>
              )}

              {service.tags &&
                service.tags.length > 0 &&
                service.tags.slice(0, 6).map((t, idx) => {
                  const name =
                    typeof t === 'string' ? t : t?.name || t?._id || '';
                  return (
                    <span key={idx} className={styles.conditionTag}>
                      {name}
                    </span>
                  );
                })}
            </div>

            <div>
              <Link href="/contact" className={styles.bookButtonSecondary}>
                Book / Enquire
              </Link>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <div
              className={styles.sectionContent}
              dangerouslySetInnerHTML={{
                __html: service.description || '<p>No description available.</p>',
              }}
            />

            {service.aboutUs && (
              <div className={styles.aboutSection}>
                <p className={styles.aboutLabel}>About</p>
                <p className={styles.aboutText}>{stripHtml(service.aboutUs)}</p>
              </div>
            )}
          </section>

          {/* BENEFITS & CARE */}
          <section className={styles.benefitsGrid}>
            <div className="row g-4">
              <div className="col-lg-6">
                <CareCard
                  title="Pre-Treatment Care"
                  items={toArray(service.benefits)}
                  itemKey="benefits"
                  emptyMessage="No benefits listed."
                />
              </div>
              <div className="col-lg-6">
                <CareCard
                  title="Post-Treatment Care"
                  items={toArray(service.postTreatmentCare)}
                  itemKey="tips"
                  emptyMessage="No care tips listed."
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section
            className={styles.contentSection}
            itemScope={true as any}
            itemType="https://schema.org/FAQPage"
          >
            <h3 className={styles.sectionTitle}>FAQs</h3>

            {toArray(service.faq).length ? (
              <div className="accordion" id="serviceFaqAccordion">
                {toArray(service.faq).map((f: FAQItem, idx: number) => (
                  <div
                    key={idx}
                    className={`accordion-item ${styles.faqAccordionItem}`}
                    itemScope={true as any}
                    itemType="https://schema.org/Question"
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${styles.faqAccordionButton} ${
                          idx !== 0 ? 'collapsed' : ''
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-item-${idx}`}
                        aria-expanded={idx === 0 ? 'true' : 'false'}
                        aria-controls={`faq-item-${idx}`}
                      >
                        {f.question}
                      </button>
                    </h2>
                    <div
                      id={`faq-item-${idx}`}
                      className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                      data-bs-parent="#serviceFaqAccordion"
                    >
                      <div
                        className={`accordion-body ${styles.faqAccordionBody}`}
                        itemScope={true as any}
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                      >
                        {f.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className={styles.faqList}>
                <li className={styles.emptyList}>No FAQs available.</li>
              </ul>
            )}
          </section>

          {/* GALLERY */}
          {validImages.length > 0 && (
            <section className={styles.contentSection}>
              <h3 className={styles.sectionTitle}>Gallery</h3>
              <div className="row g-3">
                {validImages.map((img, idx) => (
                  <div key={idx} className="col-6 col-md-4 col-lg-3">
                    <div className={styles.galleryItem}>
                      <Image
                        src={img}
                        alt={`${service.name} ${idx + 1}`}
                        fill
                        className={styles.galleryImage}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RELATED */}
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

              <RelatedServicesCarousel services={related as any} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}