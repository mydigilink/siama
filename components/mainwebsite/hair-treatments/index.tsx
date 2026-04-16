import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicServices, type PublicService } from "@/utils/api/public";
import styles from "./style.module.scss";

interface Treatment {
  id: string;
  title: string;
  rating: number;
  duration: string;
  description: string[];
  image: string;
  link?: string;
}

function mapServiceToTreatment(service: PublicService): Treatment {
  // Extract description and limit to 200 characters
  let descriptionText = "";
  if (service.description) {
    // Extract text before "Procedure" section if it exists
    const procedureIndex = service.description.toLowerCase().indexOf("<b> procedure");
    const mainDescription = procedureIndex > 0 
      ? service.description.substring(0, procedureIndex)
      : service.description;
    
    // Remove HTML tags and extract meaningful text
    const textContent = mainDescription
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    // Limit to 200 characters
    if (textContent.length > 200) {
      descriptionText = textContent.substring(0, 200) + "...";
    } else {
      descriptionText = textContent;
    }
  }
  
  // Default description if none extracted
  if (!descriptionText) {
    descriptionText = "Professional hair treatment for optimal results";
  }

  return {
    id: service._id,
    title: service.name,
    rating: service.ratingAverage || 0,
    duration: service.estimate_time || "N/A",
    description: [descriptionText],
    image: service.image || "/img/assts/seo/prp-hair-treatment-min.webp",
    link: service.slug ? `/services/${service.slug}` : undefined,
  };
}

export default async function HairTreatments() {
  const response = await getPublicServices({
    page: 1,
    limit: 20,
    sortBy: "created_at",
    sortOrder: "desc",
    category: "665451b416a3fd61d1e6e104",
    sub_category: "66545f2e0c42d4097a35cea0",
  }).catch(() => ({ status: "error" as const }));

  const services: PublicService[] =
    response.status === "success" && response.data ? response.data : [];

  const treatments: Treatment[] = services.map(mapServiceToTreatment);

  if (treatments.length === 0) {
    return (
      <div className={styles.treatmentsGrid}>
        <div className={styles.emptyState}>
          No hair treatments found.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.treatmentsGrid}>
      {treatments.map((treatment) => (
        <div key={treatment.id} className={styles.treatmentCard}>
          <div className={styles.imageContainer}>
            <Image
              src={treatment.image}
              alt={treatment.title}
              fill
              className={styles.treatmentImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          <div className={styles.cardContent}>
            {treatment.link ? (
              <Link href={treatment.link} className={styles.treatmentTitleLink}>
                <h3 className={styles.treatmentTitle}>{treatment.title}</h3>
              </Link>
            ) : (
              <h3 className={styles.treatmentTitle}>{treatment.title}</h3>
            )}

            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill={i < Math.floor(treatment.rating) ? "#FFD700" : "none"}
                    stroke={i < Math.floor(treatment.rating) ? "#FFD700" : "#E0E0E0"}
                    strokeWidth="2"
                    className={styles.star}
                  >
                    <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                  </svg>
                ))}
              </div>
              <span className={styles.ratingValue}>{treatment.rating.toFixed(2)}</span>
            </div>

            <div className={styles.durationSection}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.durationIcon}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className={styles.duration}>{treatment.duration}</span>
            </div>

            <div className={styles.descriptionSection}>
              {treatment.description.map((point, index) => (
                <p key={index} className={styles.descriptionPoint}>
                  {point}
                </p>
              ))}
            </div>

            {treatment.link ? (
              <Link href={treatment.link} className={styles.viewDetailsButton}>
                VIEW DETAILS
              </Link>
            ) : (
              <div className={styles.viewDetailsButton}>
                VIEW DETAILS
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

