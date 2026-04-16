"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

interface Treatment {
  id: number;
  title: string;
  bestFor: string;
  description: string;
  benefits: string[];
  sessionsRequired: string;
  downtime: string;
  image: string;
  url: string;
}

export default function AdvancedLaserFacialTreatments() {
  const treatments: Treatment[] = [
    {
      id: 1,
      title: "Laser Skin Rejuvenation",
      bestFor: "Dull skin, fine lines, early aging",
      description:
        "Laser Skin Rejuvenation works by delivering controlled laser energy into the deeper layers of the skin to boost collagen and elastin production. It improves skin texture, tone, and radiance while reducing early signs of aging.",
      benefits: [
        "Improves skin brightness and glow",
        "Reduces fine lines and wrinkles",
        "Enhances skin texture",
        "Non-invasive with minimal downtime",
      ],
      sessionsRequired: "3–6 sessions",
      downtime: "Mild redness for a few hours",
      image: "/img/assts/advanced-laser-facial/siama-photo-1.jpeg",
      url: "/services/advanced-laser-facial/laser-skin-rejuvenation",
    },
    {
      id: 2,
      title: "Laser Pigmentation Removal",
      bestFor: "Melasma, sun spots, age spots, uneven skin tone",
      description:
        "This treatment targets excess melanin deposits in the skin using advanced laser beams that break down pigmentation without damaging surrounding tissue.",
      benefits: [
        "Reduces dark spots and pigmentation",
        "Evens out skin tone",
        "Improves clarity and brightness",
        "Safe for most skin types",
      ],
      sessionsRequired: "4–6 sessions",
      downtime: "Minimal",
      image: "/img/assts/advanced-laser-facial/siama-photo-2.jpeg",
      url: "/services/advanced-laser-facial/laser-pigmentation-removal",
    },
    {
      id: 3,
      title: "Laser Acne & Acne Scar Treatment",
      bestFor: "Active acne, acne scars, enlarged pores",
      description:
        "Laser energy penetrates the skin to destroy acne-causing bacteria, reduce inflammation, and stimulate collagen regeneration to heal acne scars.",
      benefits: [
        "Controls active acne",
        "Reduces acne scars and marks",
        "Shrinks enlarged pores",
        "Improves overall skin texture",
      ],
      sessionsRequired: "4–8 sessions",
      downtime: "1–2 days mild redness",
      image: "/img/assts/advanced-laser-facial/siama-photo-3.jpeg",
      url: "/services/advanced-laser-facial/laser-acne-scar-treatment",
    },
    {
      id: 4,
      title: "Fractional Laser Facial",
      bestFor: "Deep scars, wrinkles, skin resurfacing",
      description:
        "Fractional lasers treat only a fraction of skin at a time, creating micro-injuries that trigger natural healing and collagen formation while leaving surrounding skin intact.",
      benefits: [
        "Reduces deep acne scars",
        "Improves wrinkles and fine lines",
        "Tightens skin",
        "Enhances skin smoothness",
      ],
      sessionsRequired: "1–3 sessions",
      downtime: "3–7 days",
      image: "/img/assts/advanced-laser-facial/siama-photo-5.jpeg",
      url: "/services/advanced-laser-facial/fractional-laser-facial",
    },
    {
      id: 5,
      title: "Laser Skin Tightening",
      bestFor: "Sagging skin, loss of firmness",
      description:
        "Laser Skin Tightening heats deeper skin layers to stimulate collagen remodeling, resulting in firmer, lifted skin without surgery.",
      benefits: [
        "Tightens loose skin",
        "Lifts face and jawline",
        "Improves elasticity",
        "Non-surgical alternative to facelift",
      ],
      sessionsRequired: "3–5 sessions",
      downtime: "None to minimal",
      image: "/img/assts/advanced-laser-facial/siama-photo-6.jpeg",
      url: "/services/advanced-laser-facial/laser-skin-tightening",
    },
    {
      id: 6,
      title: "Carbon Laser Facial (Hollywood Peel)",
      bestFor: "Oily skin, blackheads, dull complexion",
      description:
        "A carbon solution is applied to the face and then targeted with a laser. The laser vaporizes the carbon, exfoliating dead skin, unclogging pores, and reducing oil.",
      benefits: [
        "Deep pore cleansing",
        "Controls excess oil",
        "Brightens complexion",
        "Instant glow",
      ],
      sessionsRequired: "3–6 sessions",
      downtime: "None",
      image: "/img/assts/advanced-laser-facial/siama-photo-7.jpeg",
      url: "/services/advanced-laser-facial/carbon-laser-facial",
    },
    {
      id: 7,
      title: "Laser Anti-Aging Facial",
      bestFor: "Wrinkles, fine lines, age spots",
      description:
        "This facial uses advanced laser technology to stimulate collagen, smooth wrinkles, and reverse visible signs of aging.",
      benefits: [
        "Reduces wrinkles and fine lines",
        "Improves skin firmness",
        "Restores youthful glow",
        "Improves skin tone",
      ],
      sessionsRequired: "3–6 sessions",
      downtime: "Minimal",
      image: "/img/assts/advanced-laser-facial/siama-photo-8.jpeg",
      url: "/services/advanced-laser-facial/laser-anti-aging-facial",
    },
    {
      id: 8,
      title: "Laser Skin Resurfacing",
      bestFor: "Rough skin texture, scars, sun damage",
      description:
        "Laser Skin Resurfacing removes damaged outer skin layers and promotes the growth of fresh, healthy skin with improved texture and tone.",
      benefits: [
        "Smoothens rough skin",
        "Reduces scars and sun damage",
        "Improves skin tone and clarity",
        "Long-lasting results",
      ],
      sessionsRequired: "1–2 sessions",
      downtime: "5–10 days",
      image: "/img/assts/advanced-laser-facial/siama-photo-1.jpeg",
      url: "/services/advanced-laser-facial/laser-skin-resurfacing",
    },
  ];

  const handleAdd = (treatmentId: number) => {
    console.log("Add treatment:", treatmentId);
  };

  return (
    <div className={styles.treatmentsWrapper}>
      <div className={styles.introSection}>
        <p className={styles.introText}>
          Advanced Laser Facial treatments use cutting-edge laser technology to
          rejuvenate skin, correct imperfections, and stimulate natural collagen
          production. These treatments are safe, non-surgical, and deliver
          visible, long-lasting results.
        </p>
      </div>

      <div className={styles.treatmentsGrid}>
        {treatments.map((treatment) => (
          <div key={treatment.id} className={styles.treatmentCard}>
            <div className={styles.imageContainer}>
              <Image
                src={treatment.image}
                alt={treatment.title}
                fill
                className={styles.treatmentImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              {/* <div className={styles.treatmentNumber}>
                {treatment.id}️⃣
              </div> */}
              <h3 className={styles.treatmentTitle}>{treatment.title}</h3>

              <div className={styles.bestForSection}>
                <span className={styles.bestForLabel}>Best for:</span>
                <span className={styles.bestForText}>{treatment.bestFor}</span>
              </div>

              <p className={styles.description}>{treatment.description}</p>

              <div className={styles.benefitsSection}>
                <h4 className={styles.benefitsTitle}>Benefits:</h4>
                <ul className={styles.benefitsList}>
                  {treatment.benefits.map((benefit, index) => (
                    <li key={index} className={styles.benefitItem}>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.detailsSection}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sessions Required:</span>
                  <span className={styles.detailValue}>
                    {treatment.sessionsRequired}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Downtime:</span>
                  <span className={styles.detailValue}>
                    {treatment.downtime}
                  </span>
                </div>
              </div>

              <Link
                href={treatment.url}
                className={styles.viewDetailsButton}
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.whyChooseSection}>
        <h3 className={styles.whyChooseTitle}>
          🌟 Why Choose Advanced Laser Facial Treatments?
        </h3>
        <ul className={styles.whyChooseList}>
          <li>FDA-approved technology</li>
          <li>Safe & effective for Indian skin types</li>
          <li>Non-surgical & minimally invasive</li>
          <li>Visible results with minimal downtime</li>
        </ul>
      </div>
    </div>
  );
}

