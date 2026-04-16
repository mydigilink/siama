"use client";

import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

interface Treatment {
  id: number;
  title: string;
  rating: number;
  duration: string;
  description: string[];
  image: string;
}

export default function PRPTreatments() {
  const treatments: Treatment[] = [
    {
      id: 1,
      title: "PRP Hair Treatment",
      rating: 4.88,
      duration: "45 mins",
      description: [
        "Stimulates natural hair growth using your own platelets",
        "Effective for male and female pattern baldness",
      ],
      image: "/img/assts/prp-treatment/siama-denys-1.jpg",
    },
    {
      id: 2,
      title: "PRP for Hair Loss",
      rating: 4.85,
      duration: "50 mins",
      description: [
        "Platelet-rich plasma therapy for hair restoration",
        "Reduces hair thinning and promotes new growth",
      ],
      image: "/img/assts/prp-treatment/siama-koolshooters-2.jpg",
    },
    {
      id: 3,
      title: "PRP Skin Rejuvenation",
      rating: 4.82,
      duration: "40 mins",
      description: [
        "Natural skin rejuvenation using growth factors",
        "Improves skin texture, tone, and reduces fine lines",
      ],
      image: "/img/assts/prp-treatment/siama-ivan-s-3.jpg",
    },
    {
      id: 4,
      title: "PRP Facial Treatment",
      rating: 4.86,
      duration: "45 mins",
      description: [
        "Anti-aging facial with platelet-rich plasma",
        "Boosts collagen production and skin elasticity",
      ],
      image: "/img/assts/prp-treatment/siama-gabby-k-4.jpg",
    },
    {
      id: 5,
      title: "PRP for Acne Scars",
      rating: 4.79,
      duration: "40 mins",
      description: [
        "Reduces acne scars and marks naturally",
        "Promotes healing and skin regeneration",
      ],
      image: "/img/assts/prp-treatment/siama-midtrack-5.jpg",
    },
    {
      id: 6,
      title: "PRP Hair Restoration",
      rating: 4.87,
      duration: "50 mins",
      description: [
        "Comprehensive hair restoration therapy",
        "Strengthens existing hair and promotes new growth",
      ],
      image: "/img/assts/prp-treatment/siama-elly-fairytale-6.jpg",
    },
    {
      id: 7,
      title: "PRP Anti-Aging Treatment",
      rating: 4.84,
      duration: "45 mins",
      description: [
        "Natural anti-aging solution using your own blood",
        "Reduces wrinkles and improves skin firmness",
      ],
      image: "/img/assts/prp-treatment/siama-rdne-7.jpg",
    },
    {
      id: 8,
      title: "Combined PRP Therapy",
      rating: 4.90,
      duration: "60 mins",
      description: [
        "Comprehensive PRP treatment for hair and skin",
        "Complete rejuvenation using natural growth factors",
      ],
      image: "/img/assts/prp-treatment/siama-cottonbro-8.jpg",
    },
  ];

  const handleViewDetails = (treatmentId: number) => {
    // Handle view details action
    console.log("View details for treatment:", treatmentId);
  };

  const handleAdd = (treatmentId: number) => {
    // Handle add to cart/appointment action
    console.log("Add treatment:", treatmentId);
  };

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
              {treatment.description.map((point, index) => (
                <p key={index} className={styles.descriptionPoint}>
                  {point}
                </p>
              ))}
            </div>

            {/* <button
              className={styles.viewDetailsButton}
              onClick={() => handleViewDetails(treatment.id)}
            >
              VIEW DETAILS
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
}

