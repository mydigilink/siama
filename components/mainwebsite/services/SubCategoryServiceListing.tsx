'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/mainwebsite/concerns/ConcernsServicesWidget.module.scss';

const API_BASE =
  'https://api.siama.in/api/v1/public/services?page=1&limit=50&sortBy=created_at&sortOrder=desc&category=665451b416a3fd61d1e6e104';

interface SubCategoryServiceListingProps {
  subCategoryId: string;
  pageTitle: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  service_charge: string;
  estimate_time?: string;
  ratingAverage: number;
  ratingNumber: number;
  slug: string;
}

function getEstimateTime(service: Service): string {
  if (service.estimate_time && service.estimate_time !== 'undefined') {
    return service.estimate_time;
  }
  const charge = parseInt(service.service_charge, 10) || 0;
  if (charge >= 10000) return '180 mins';
  if (charge >= 7000) return '90 mins';
  return '60 mins';
}

function getDescriptionPoints(description: string): string[] {
  if (!description) return [];
  const clean = description.replace(/<[^>]*>/g, '').trim();
  if (!clean) return [];
  const points = clean.split(/[.\n]/).filter((p) => p.trim().length > 0);
  return points.slice(0, 4);
}

function getRating(service: Service): number {
  return Number(service.ratingAverage) || 0;
}

export default function SubCategoryServiceListing({
  subCategoryId,
  pageTitle,
}: SubCategoryServiceListingProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${API_BASE}&sub_category=${subCategoryId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === 'success' && Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load services.');
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subCategoryId]);

  return (
    <section className={styles.widget}>
      <div className={styles.container}>
        <h2 className={styles.widgetTitle}>{pageTitle}</h2>

        {loading && (
          <div className={styles.loading}>Loading services...</div>
        )}

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className={styles.empty}>No services found for this category.</div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className={styles.cardsGrid}>
            {services.map((service) => {
              const rating = getRating(service);
              const duration = getEstimateTime(service);
              const points = getDescriptionPoints(service.description);

              return (
                <div key={service._id} className={styles.card}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardText}>
                      <Link href={`/services/${service.slug}`} className={styles.cardTitleLink}>
                        <div className={styles.cardImageWrap}>
                      <Image
                        src={service.image || '/img/assts/seo/prp-hair-treatment-min.webp'}
                        alt={service.name}
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div> <h3 className={styles.cardTitle}>{service.name}</h3>
                      </Link>
                      <div className={styles.meta}>
                        <div className={styles.ratingContainer}>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill={i < Math.floor(rating) ? '#FFD700' : 'none'}
                                stroke={i < Math.floor(rating) ? '#FFD700' : '#E0E0E0'}
                                strokeWidth="2"
                                className={styles.star}
                              >
                                <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                              </svg>
                            ))}
                          </div>
                          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                        </div>
                        <span className={styles.duration}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {duration}
                        </span>
                      </div>
                      {points.length > 0 && (
                        <ul className={styles.descList}>
                          {points.map((p, i) => (
                            <li key={i}>{p.trim()}</li>
                          ))}
                        </ul>
                      )}
                      <div className={styles.actions}>
                        <Link
                          href={`/services/${service.slug}`}
                          className={styles.viewDetailsBtn}
                        >
                          VIEW DETAILS
                        </Link>
                      </div>
                    </div>
                   
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
