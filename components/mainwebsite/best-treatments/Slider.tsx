"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type PublicService } from "@/utils/api/public";
import styles from "./slider.module.scss";

type Props = { services: PublicService[] };

const stripHtml = (html?: string) => {
  if (!html) return "";
  
  let cleaned = html
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Decode common HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    // Decode numeric entities
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Remove numbered list patterns at the start of lines (e.g., "1. ", "2. ", etc.)
    .replace(/^\d+\.\s*/gm, "")
    // Replace multiple spaces/newlines with single space
    .replace(/[\s\n\r]+/g, " ")
    .trim();
  
  return cleaned;
};

const getPerPage = (width: number) => {
  if (width < 640) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  if (width < 1500) return 4;
  return 4;
};

export default function BestTreatmentsSlider({ services }: Props) {
  const [perPage, setPerPage] = useState(4);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setPerPage(getPerPage(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(services.length / perPage)),
    [services.length, perPage]
  );

  const maxIndex = totalPages - 1;

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const slideWidth = `${(100 / (totalPages * perPage)).toFixed(4)}%`;
  const translate = `translateX(-${((index * 100) / totalPages).toFixed(4)}%)`;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        <div
          ref={trackRef}
          className={styles.sliderTrack}
          style={{
            width: `${totalPages * 100}%`,
            transform: translate,
          }}
        >
          {services.map((svc) => {
            const rating = svc.ratingAverage ?? 4.6;
            const desc = stripHtml(svc.description || svc.aboutUs);
            const subcat =
              typeof svc.sub_category === "object" && svc.sub_category ? (svc.sub_category as any).name : "Popular";
            const isBest = svc.bestTreatment;
            const isPopular = svc.popularProduct;
            const imageUrl = svc.image || "/img/assts/treatment/treatment1.png";
            
            return (
              <div
                key={svc._id}
                className={styles.slide}
                style={{ width: slideWidth }}
              >
                <Link
                  href={`/services/${svc.slug || svc._id}`}
                  className={styles.cardLink}
                >
                  <div className={styles.serviceCard}>
                    <div className={styles.cardGradient}></div>

                    <div className={styles.imageContainer}>
                      <Image
                        src={imageUrl}
                        alt={svc.name || "Service"}
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, (max-width: 1500px) 25vw, 20vw"
                      />
                      {svc.service_charge && (
                        <div className={styles.priceBadge}>
                          ₹{svc.service_charge}
                        </div>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.serviceHeader}>
                        <h4 className={styles.serviceName}>{svc.name || "Service"}</h4>
                        {typeof svc.category === "object" && svc.category && (
                          <p className={styles.serviceCategory}>
                            {(svc.category as any).name}
                          </p>
                        )}
                      </div>

                      {/* <div className={styles.ratingContainer}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="16"
                              height="16"
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
                      </div> */}

                      {desc && desc.trim().toLowerCase() !== "test" && desc.trim().toLowerCase() !== "test men" && (
                        <p className={styles.serviceDescription}>{desc}</p>
                      )}

                      <div className={styles.serviceDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailDot}></span>
                          <span className={styles.detailLabel}>Duration:</span>
                          <span className={styles.detailValue}>{svc.estimate_time || "—"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailDot}></span>
                          <span className={styles.detailLabel}>Consult:</span>
                          <span className={styles.detailValue}>
                            {svc.consult_charge ? `₹${svc.consult_charge}` : "—"}
                          </span>
                        </div>
                      </div>

                      <div className={styles.tagsContainer}>
                        <span className={styles.tag}>{subcat}</span>
                        {isBest && <span className={`${styles.tag} ${styles.tagBest}`}>Best</span>}
                        {isPopular && <span className={`${styles.tag} ${styles.tagPopular}`}>Popular</span>}
                      </div>

                      <button className={styles.viewButton}>
                        View Service
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {services.length > perPage && (
        <div className={styles.navigation}>
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className={styles.navButton}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Prev
          </button>
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`${styles.dot} ${idx === index ? styles.dotActive : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index === maxIndex}
            className={styles.navButton}
            aria-label="Next"
          >
            Next
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
