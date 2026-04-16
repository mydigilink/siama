"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import styles from "./style.module.scss";
import LeadCaptureForm from "./LeadCaptureForm";

interface Slide {
  id: number;
  title: string;
  image?: string;
  video?: string;
  buttonLink: string;
  subtitle: string;
}

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  // 8 Derma Facial Related Banners
  const slides: Slide[] = [
    {
      id: 1,
      title: "Laser Hair Reduction",
      image: "/img/assts/banners/banner1_2.jpg",
      buttonLink: "/services/laser-hair-reduction",
      subtitle: "Smooth, hair-free skin with painless, FDA-approved technology",
    },
    {
      id: 2,
      title: "Skin Rejuvenation",
      image: "/img/assts/banners/banner_2.jpg",
      buttonLink: "/services/skin-rejuvenation",
      subtitle: "Rediscover your natural glow with advanced skin renewal treatments",
    },
    {
      id: 3,
      title: "Hair Treatment",
      image: "/img/assts/banners/banner3_2.jpg",
      buttonLink: "/services/hair-treatment",
      subtitle: "Restore your hair's natural beauty with PRP and mesotherapy",
    },
    {
      id: 4,
      title: "Advanced Laser Facial",
      image: "/img/assts/banners/banner4_2.jpg",
      buttonLink: "/services/advanced-laser-facial",
      subtitle: "Transform your skin with precision multi-laser technology",
    },
    {
      id: 5,
      title: "PRP Treatment",
      video: "/img/assts/banners/banner5.mp4",
      buttonLink: "/services/prp-treatment",
      subtitle: "Natural healing with your own blood for visible results",
    },
    {
      id: 6,
      title: "Chemical Peel",
      video: "/img/assts/banners/banner6.mp4",
      buttonLink: "/services/chemical-peel",
      subtitle: "Reveal fresh, radiant skin with deep exfoliation",
    },
    {
      id: 7,
      title: "HydraFacial",
      image: "/img/assts/banners/banner7_2.jpg",
      buttonLink: "/services/advanced-laser-facial",
      subtitle: "Deep cleansing and hydration for instant glow",
    },
    {
      id: 8,
      title: "Mesotherapy",
      image: "/img/assts/banners/banner8_2.jpg",
      buttonLink: "/services/skin-rejuvenation",
      subtitle: "Targeted micro-injections for perfect, rejuvenated skin",
    },
  ];

  // Hide form after 15 seconds on mount
  useEffect(() => {
    hideTimerRef.current = setTimeout(() => {
      setIsFormVisible(false);
    }, 15000); // 15 seconds

    // Cleanup on unmount
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleFormMouseEnter = () => {
    // Show form and clear timer when mouse enters
    setIsFormVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleFormMouseLeave = () => {
    // Start timer when mouse leaves - hide after 15 seconds
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsFormVisible(false);
    }, 15000);
  };

  return (
    <section className={styles.heroSlider}>
       {/* Single persistent overlay so form/text don't reset on slide change */}
      <div className={styles.heroContent}>
        <div>
          <h1 className={styles.heroTitle}>
            {slides[activeIndex]?.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {slides[activeIndex]?.subtitle}
          </p>
          <a href={slides[activeIndex]?.buttonLink} className={`about-btn  ${styles.bookingButton}`  }>
            Book Now
          </a>
        </div>
        {/* <div 
          ref={formCardRef}
          className={`${styles.formCard} ${!isFormVisible ? styles.formCardHidden : ''}`}
          onMouseEnter={handleFormMouseEnter}
          onMouseLeave={handleFormMouseLeave}
        >
          <LeadCaptureForm />
        </div> */}
      </div>
      <Swiper
        modules={[Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        effect="fade"
        loop={true}
        className={styles.swiper}
        onSlideChange={(swiper: SwiperType) => {
          setActiveIndex(swiper.realIndex);
        }}
        onInit={(swiper: SwiperType) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides?.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.slide}>
            <div className={styles.slideContent}>
              {slide.video ? (
                <div className={styles.slideVideo}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.video}
                  >
                    <source src={slide.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : slide.image ? (
                <div className={styles.slideImage}>
                  <Image
                    src={slide.image}
                    alt={`Siama ${slide.title} Banner`}
                    fill
                    priority={slide.id === 1}
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              ) : null}
              {/* <div className={styles.slideOverlay}></div> */}
              
              {/* Hero Content Overlay */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     
    </section>
  );
}

