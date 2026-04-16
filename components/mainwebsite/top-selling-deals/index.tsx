import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicServices, type PublicService } from "@/utils/api/public";
import styles from "./style.module.scss";

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

export default async function TopSellingDeals() {
  const response = await getPublicServices({
    page: 1,
    limit: 12,
    bestTreatment: 'true',
    sortBy: "created_at",
    sortOrder: "desc",
  }).catch(() => ({ status: "error" as const }));

  const services: PublicService[] =
    response.status === "success" && response.data ? response.data : [];

  // Take only the first 4 services for display
  const bestsellers = services.slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Link href="/services" className={styles.title}>
          <h2>Our Bestsellers</h2>
        </Link>
        {bestsellers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No bestsellers available at the moment.</p>
          </div>
        ) : (
          <div className={styles.bestsellersGrid}>
            {bestsellers.map((service) => {
              const description = stripHtml(service.description || service.aboutUs || "");
              const imageUrl = service.image || "/img/assts/treatment/treatment1.png";
              const serviceUrl = `/services/${service.slug || service._id}`;
              
              return (
                <Link key={service._id} href={serviceUrl} className={styles.bestsellerCard}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={imageUrl}
                      alt={service.name || "Treatment"}
                      fill
                      className={styles.bestsellerImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{service.name || "Treatment"}</h3>
                      {description && 
                       description.trim().toLowerCase() !== "test" && 
                       description.trim().toLowerCase() !== "test men" && (
                        <p className={styles.cardDescription}>
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
