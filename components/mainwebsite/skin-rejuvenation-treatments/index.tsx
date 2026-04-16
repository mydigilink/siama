"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

interface Treatment {
  id: string;
  title: string;
  rating: number;
  duration: string;
  description: string[];
  image: string;
  link?: string;
  price?: string;
}

interface ApiService {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  estimate_time?: string;
  ratingAverage: number;
  service_charge?: string;
  sub_category: {
    slug: string;
  };
}

interface ApiResponse {
  status: string;
  data: ApiService[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function SkinRejuvenationTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const apiUrl = "https://api.siama.in/api/v1/public/services?page=1&limit=20&sortBy=created_at&sortOrder=desc&category=665451b416a3fd61d1e6e104&sub_category=66545f740c42d4097a35e9ee&status=true";
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Failed to fetch treatments");
        }

        const data: ApiResponse = await response.json();

        if (data.status === "success" && data.data.length > 0) {
          const transformedTreatments: Treatment[] = data.data.map((service) => {
            const descriptionText = service.description.replace(/<[^>]*>/g, "").trim();
            const descriptionLines = descriptionText
              ? [descriptionText]
              : ["Professional treatment for your skin"];

            const imageUrl = service.image.startsWith("http") 
              ? service.image 
              : `${service.image}`;

            console.log("Service image:", service.image);
            console.log("Constructed image URL:", imageUrl);

            return {
              id: service._id,
              title: service.name,
              rating: service.ratingAverage || 4.8,
              duration: service.estimate_time || "45 mins",
              description: descriptionLines,
              image: imageUrl,
              link: `/services/${service.slug}`,
              price: service.service_charge,
            };
          });

          setTreatments(transformedTreatments);
        }
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTreatments();
  }, []);

  const handleViewDetails = (treatmentId: string) => {
    console.log("View details for treatment:", treatmentId);
  };

  const handleAdd = (treatmentId: string) => {
    console.log("Add treatment:", treatmentId);
  };

  if (loading) {
    return (
      <div className={styles.treatmentsGrid}>
        <div className={styles.loadingMessage}>Loading treatments...</div>
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
            {/* <button
              className={styles.addButton}
              onClick={() => handleAdd(treatment.id)}
              aria-label={`Add ${treatment.title}`}
            >
              ADD
            </button> */}
          </div>

          <div className={styles.cardContent}>
            <h3 className={styles.treatmentTitle}>{treatment.title}</h3>

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
              <span className={styles.ratingValue}>{treatment.rating}</span>
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
              {treatment.description?.map((point, index) => (
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
              <button
                className={styles.viewDetailsButton}
                onClick={() => handleViewDetails(treatment.id)}
              >
                VIEW DETAILS
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

