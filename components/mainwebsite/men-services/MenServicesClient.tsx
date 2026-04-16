"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

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

interface Props {
  initialServices: Service[];
}

export default function MenServicesClient({ initialServices }: Props) {
  const [services] = useState<Service[]>(initialServices);

  function getEstimateTime(service: Service): string {
    if (service.estimate_time && service.estimate_time !== 'undefined') {
      return service.estimate_time;
    }
    // Default times based on service charge
    const charge = parseInt(service.service_charge);
    if (charge >= 10000) return '180 mins';
    if (charge >= 7000) return '90 mins';
    return '60 mins';
  }

  function getDescriptionPoints(description: string): string[] {
    if (!description) return [];
    // Remove HTML tags and split into sentences
    const clean = description.replace(/<[^>]*>/g, '').trim();
    if (!clean) return [];
    
    // Split by periods or newlines and filter empty strings
    const points = clean.split(/[.\n]/).filter(p => p.trim().length > 0);
    return points.slice(0, 2); // Return max 2 points
  }

  function getRating(service: Service): number {
    return Number(service.ratingAverage) || 0;
  }

  function handleAddToCart(serviceId: string) {
    // TODO: Implement cart functionality
    console.log('Add to cart:', serviceId);
  }

  return (
    <div className={styles.menServicesPage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Men&apos;s Services</h1>
          <p className={styles.heroDescription}>
            Professional grooming and aesthetic treatments designed specifically for men
          </p>
        </div>
      </div>

      <div className={styles.servicesContainer}>
        <div className={styles.servicesGrid}>
          {services.map((service) => {
            const descriptionPoints = getDescriptionPoints(service.description);
            const rating = getRating(service);
            const estimateTime = getEstimateTime(service);

            return (
              <div key={service._id} className={styles.serviceCard}>
                <div className={styles.cardContent}>
                  <div className={styles.cardLeft}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    
                    {/* <div className={styles.serviceMeta}>
                      <div className={styles.ratingContainer}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={i < Math.floor(rating) ? "#FFD700" : "none"}
                              stroke={i < Math.floor(rating) ? "#FFD700" : "#E0E0E0"}
                              strokeWidth="2"
                              className={styles.star}
                            >
                              <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                            </svg>
                          ))}
                        </div>
                        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                      </div>
                      <div className={styles.duration}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span>{estimateTime}</span>
                      </div>
                    </div> */}

                    {/* {descriptionPoints.length > 0 && (
                      <ul className={styles.descriptionList}>
                        {descriptionPoints.map((point, idx) => (
                          <li key={idx}>{point.trim()}</li>
                        ))}
                      </ul>
                    )} */}

                    <div className={styles.cardActions}>
                      <Link 
                        href={`/services/${service.slug}`}
                        // className={styles.viewDetailsButton}
                        className={`about-btn `}
                      >
                        VIEW DETAILS
                      </Link>
                      {/* <button 
                        className={styles.addButton}
                        onClick={() => handleAddToCart(service._id)}
                      >
                        ADD
                      </button> */}
                    </div>
                  </div>

                  <div className={styles.cardRight}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={service.image || "/img/assts/seo/prp-hair-treatment-min.webp"}
                        alt={service.name}
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
