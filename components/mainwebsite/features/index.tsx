"use client";

import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

// Simple Flower Icon Component
const FlowerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.flowerSvg}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.88-1.19 3.51-3 4.18V16h-4v-2.82c-1.81-.67-3-2.3-3-4.18 0-2.76 2.24-5 5-5z" />
    <circle cx="12" cy="9" r="1.5" />
    <circle cx="9" cy="7" r="1" />
    <circle cx="15" cy="7" r="1" />
    <circle cx="9" cy="11" r="1" />
    <circle cx="15" cy="11" r="1" />
  </svg>
);

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Targeted Treatments for Anti-Aging, Acne",
      description:
        "Natural aging can have an impact on your skin in different ways. We have the best treatment to combat aging problems and acne. Our dermatologists identify the problematic spots on your skin to provide targeted treatment.",
    },
    {
      id: 2,
      title: "Personalized Skincare Consultations",
      description:
        "Our experts provide personalized skin consultations to help understand your unique skin type and concerns. Get a tailored skincare plan to match your beauty goals.",
    },
    {
      id: 3,
      title: "Deep Cleansing and Exfoliation for Clearer Complexion",
      description:
        "We provide deep cleansing solutions that exfoliate and rejuvenate your skin, leaving it fresh, smooth, and healthy-looking.",
    },
    {
      id: 4,
      title: "Customized Masks and Serums for Nourished Skin",
      description:
        "Our dermatologists prepare customized face masks and serums using quality ingredients to nourish and protect your skin effectively.",
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src="/img/assts/siama-ban.jpg"
                alt="Siama Beauty Treatment"
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          {/* Text Section */}
          <div className={styles.textSection}>
            <h2 className={styles.mainTitle}>
              &quot;Siama&quot; – A step towards bringing confidence with
              beauty.
            </h2>
            <p className={styles.mainDescription}>
              Siama is a premier beauty care service provider with a range of
              specialized treatments. We think real beauty emanates from your
              confident look. If you like to indulge in self-care activities,
              our cosmetic solution is the best. With quality products and the
              latest techniques, we provide exceptional care. Siama offers a
              cost-effective solution without feeling less beautiful inside and
              out. Start your beauty journey with every session. Book a
              consultation with our experts and have the best services from us.
            </p>

            {/* Features Grid */}
            {/* <div className={styles.featuresGrid}>
              {features.map((feature) => (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FlowerIcon />
                  </div>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>{feature.title}</h4>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

