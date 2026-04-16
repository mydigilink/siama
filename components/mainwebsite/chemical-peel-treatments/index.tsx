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

export default function ChemicalPeelTreatments() {
  const treatments: Treatment[] = [
    {
      id: 1,
      title: "Glycolic Acid Peel",
      rating: 4.85,
      duration: "30 mins",
      description: [
        "Deep exfoliation for smoother, brighter skin",
        "Reduces fine lines, acne scars, and hyperpigmentation",
      ],
      image: "/img/assts/chemical-peel/siama-solenfeyissa-1.jpg",
    },
    {
      id: 2,
      title: "Salicylic Acid Peel",
      rating: 4.82,
      duration: "25 mins",
      description: [
        "Ideal for acne-prone and oily skin",
        "Unclogs pores and reduces active breakouts",
      ],
      image: "/img/assts/chemical-peel/siama-robin-kumar-biswal-2.jpg",
    },
    {
      id: 3,
      title: "Lactic Acid Peel",
      rating: 4.86,
      duration: "30 mins",
      description: [
        "Gentle exfoliation for sensitive skin",
        "Improves skin texture and hydration",
      ],
      image: "/img/assts/chemical-peel/siama-ron-lach-3.jpg",
    },
    {
      id: 4,
      title: "TCA Chemical Peel",
      rating: 4.88,
      duration: "45 mins",
      description: [
        "Medium-depth peel for significant results",
        "Treats deep wrinkles, scars, and sun damage",
      ],
      image: "/img/assts/chemical-peel/siama-artempodrez-4.jpg",
    },
    {
      id: 5,
      title: "Phenol Chemical Peel",
      rating: 4.90,
      duration: "60 mins",
      description: [
        "Deep peel for severe skin concerns",
        "Dramatic improvement in skin texture and tone",
      ],
      image: "/img/assts/chemical-peel/siama-ron-lach-5.jpg",
    },
    {
      id: 6,
      title: "Mandelic Acid Peel",
      rating: 4.84,
      duration: "30 mins",
      description: [
        "Suitable for darker skin tones",
        "Reduces acne, hyperpigmentation, and fine lines",
      ],
      image: "/img/assts/chemical-peel/siama-karola-g-6.jpg",
    },
    {
      id: 7,
      title: "Jessner's Peel",
      rating: 4.87,
      duration: "35 mins",
      description: [
        "Combination peel for comprehensive results",
        "Treats acne, melasma, and uneven skin tone",
      ],
      image: "/img/assts/chemical-peel/siama-vovkapanda-7.jpg",
    },
    {
      id: 8,
      title: "Retinol Chemical Peel",
      rating: 4.83,
      duration: "40 mins",
      description: [
        "Anti-aging peel with collagen stimulation",
        "Reduces wrinkles and improves skin elasticity",
      ],
      image: "/img/assts/chemical-peel/siama-mart-production-8.jpg",
    },
    {
      id: 9,
      title: "Vitamin C Chemical Peel",
      rating: 4.85,
      duration: "30 mins",
      description: [
        "Brightening and antioxidant treatment",
        "Reduces dark spots and improves radiance",
      ],
      image: "/img/assts/chemical-peel/siama-cup-of-couple-9.jpg",
    },
    {
      id: 10,
      title: "Kojic Acid Peel",
      rating: 4.81,
      duration: "30 mins",
      description: [
        "Lightening treatment for hyperpigmentation",
        "Safe for sensitive and darker skin types",
      ],
      image: "/img/assts/chemical-peel/siama-chokniti-khongchum-10.jpg",
    },
    {
      id: 11,
      title: "Multi-Acid Peel",
      rating: 4.89,
      duration: "45 mins",
      description: [
        "Customized combination of acids",
        "Targets multiple skin concerns simultaneously",
      ],
      image: "/img/assts/chemical-peel/siama-shiny-diamond-11.jpg",
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

