"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./style.module.scss";

interface TreatmentCategory {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function OurTreatments() {
  const categories: TreatmentCategory[] = [
    {
      id: 1,
      title: "Laser Hair Removal",
      image: "/img/assts/skin-rejuvenation/natural-body-woman.jpg",
      link: "/services/laser-hair-reduction",
    },
    {
      id: 2,
      title: "Skin Treatment",
      image: "/img/assts/skin-rejuvenation/new.jpg",
      link: "/services/skin-rejuvenation",
    },
    {
      id: 3,
      title: "Hair Treatment",
      image: "/img/assts/skin-rejuvenation/siama-denys-1_2.jpg",
      link: "/services/hair-treatment",
    },
    {
      id: 4,
      title: "Advanced Laser Facial",
      image: "/img/assts/skin-rejuvenation/rejuvenation_advanced.jpg",
      link: "/services/advanced-laser-facial",
    },
    {
      id: 5,
      title: "PRP Treatment",
      image: "/img/assts/skin-rejuvenation/siama-PRP.jpg",
      link: "/services/prp-treatment",
    },
    {
      id: 6,
      title: "Chemical Peel",
      image: "/img/assts/chemical-peel/siama-artempodrez-4.jpg",
      link: "/services/chemical-peel",
    },
  ];

  const features = [
    {
      id: 1,
      icon: "✨",
      title: "Expert Care",
      description: "Certified dermatologists and beauty specialists",
    },
    {
      id: 2,
      icon: "🔬",
      title: "Advanced Technology",
      description: "State-of-the-art equipment and latest techniques",
    },
    {
      id: 3,
      icon: "💆",
      title: "Personalized Treatment",
      description: "Customized plans tailored to your needs",
    },
    {
      id: 4,
      icon: "🌟",
      title: "Proven Results",
      description: "Thousands of satisfied clients",
    },
  ];

  return (
    <section className={styles.ourTreatmentsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore Our Treatments</h2>
        
        {/* Treatment Categories Slider */}
        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            navigation={{
              nextEl: `.${styles.swiperButtonNext}`,
              prevEl: `.${styles.swiperButtonPrev}`,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className={styles.swiper}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className={styles.slide}>
                <div className={styles.card}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                      priority={category.id === 1}
                    />
                    <div className={styles.overlay}>
                      <h3 className={styles.cardTitle}>{category.title}</h3>
                      <Link href={category.link} className={styles.exploreButton}>
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.navigationButtons}>
            <button
              className={`${styles.swiperButton} ${styles.swiperButtonPrev}`}
              aria-label="Previous slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`${styles.swiperButton} ${styles.swiperButtonNext}`}
              aria-label="Next slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Why Choose Siama?</h3>
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
