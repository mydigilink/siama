"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./ConcernsServicesWidget.module.scss";
const PUBLIC_API_BASE_URL = 
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || 
  process.env.PUBLIC_API_BASE_URL;// || 
//  'https://api.siama.in/api/v1/public';
const API_BASE =
 PUBLIC_API_BASE_URL + "/services?page=1&limit=6&sortBy=created_at&sortOrder=desc&category=665451b416a3fd61d1e6e104";
  //"https://api.siama.in/api/v1/public/services?page=1&limit=6&sortBy=created_at&sortOrder=desc&category=665451b416a3fd61d1e6e104";

export const CONCERNS_SUB_CATEGORIES = [
  { label: "Laser Hair Reduction", id: "66545d890c42d4097a3533f1" },
  { label: "Hair Treatment", id: "66545f2e0c42d4097a35cea0" },
  { label: "Skin Rejuvenation", id: "66545f740c42d4097a35e9ee" },
  { label: "Advance Laser Facial", id: "66545fb40c42d4097a36035b" },
  { label: "Dental Sathi", id: "681e29785ccfa5802f5195b3" },
  { label: "Chemical Peel", id: "681f7c575ccfa5802f52d47e" },
  { label: "Glutathione", id: "6820cf635ccfa5802f535d3f" },
  { label: "Body Slimming", id: "6820cf835ccfa5802f5361c0" },
];

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

export default function ConcernsServicesWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subCategoryFromUrl = searchParams.get("subCategory");

  const [activeTabId, setActiveTabId] = useState<string>(
    subCategoryFromUrl && CONCERNS_SUB_CATEGORIES.some((t) => t.id === subCategoryFromUrl)
      ? subCategoryFromUrl
      : CONCERNS_SUB_CATEGORIES[0].id
  );
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync tab with URL when subCategory query changes
  useEffect(() => {
    if (
      subCategoryFromUrl &&
      CONCERNS_SUB_CATEGORIES.some((t) => t.id === subCategoryFromUrl)
    ) {
      setActiveTabId(subCategoryFromUrl);
    }
  }, [subCategoryFromUrl]);

  // Fetch services when active tab changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${API_BASE}&sub_category=${activeTabId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === "success" && Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Unable to load services.");
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTabId]);

  function getEstimateTime(service: Service): string {
    if (service.estimate_time && service.estimate_time !== "undefined") {
      return service.estimate_time;
    }
    const charge = parseInt(service.service_charge, 10) || 0;
    if (charge >= 10000) return "180 mins";
    if (charge >= 7000) return "90 mins";
    return "60 mins";
  }

  function getDescriptionPoints(description: string): string[] {
    if (!description) return [];
    const clean = description.replace(/<[^>]*>/g, "").trim();
    if (!clean) return [];
    const points = clean.split(/[.\n]/).filter((p) => p.trim().length > 0);
    return points.slice(0, 4);
  }

  function getRating(service: Service): number {
    return Number(service.ratingAverage) || 0;
  }

  function getImageSrc(imagePath: string): string {
    if (!imagePath) return "/img/assts/seo/prp-hair-treatment-min.webp";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) {
      return `https://api.siama.in${imagePath}`;  // Change to https://api.siama.in/api/v1/public 
    }
    return `https://api.siama.in/${imagePath}`;
  }

  function handleAdd(serviceId: string) {
    console.log("Add service:", serviceId);
  }

  return (
    <section className={styles.widget}>
      <div className={styles.container}>
        <h2 className={styles.widgetTitle}>Services by concern</h2>

        {/* <div className={styles.tabs}>
          {CONCERNS_SUB_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTabId === tab.id ? styles.tabActive : ""}`}
              onClick={() => {
                setActiveTabId(tab.id);
                router.replace(`/concerns?subCategory=${tab.id}`, { scroll: false });
              }}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

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
                        src={service.image || "/img/assts/seo/prp-hair-treatment-min.webp"}
                        alt={service.name}
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>  <h3 className={styles.cardTitle}>{service.name}</h3>
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
                                fill={i < Math.floor(rating) ? "#FFD700" : "#FFD700"}
                                stroke={i < Math.floor(rating) ? "#FFD700" : "#E0E0E0"}
                                strokeWidth="2"
                                className={styles.star}
                              >
                                <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                              </svg>
                            ))}
                          </div>
                          {/* <span className={styles.ratingValue}>{rating.toFixed(1)}</span> */}
                          <span className={styles.ratingValue}>4.8</span>
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
                        {/* <button
                          type="button"
                          className={styles.addBtn}
                          onClick={() => handleAdd(service._id)}
                        >
                          ADD
                        </button> */}
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
