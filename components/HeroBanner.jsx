"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HeroBanner() {
  const swiperRef = useRef(null);

  const slides = [
    {
      image: "/img/hero1.png",
      subtitle: "SIAMA",
      title: "Full Body Polishing",
      desc: "Body polishing is a skincare treatment that helps exfoliate and rejuvenate the skin, leaving it smooth, soft, and radiant. It involves the use of exfoliating scrubs or polishes to remove dead skin cells, dirt, and impurities from the surface of the skin.",
    },
    {
      image: "/img/hero2.png",
      subtitle: "SIAMA",
      title: "Laser Hair Reduction",
      desc: "Achieve smooth and hair-free skin with advanced laser hair reduction treatments designed for long-lasting results and minimal discomfort.",
    },
    // {
    //   image: "/img/hero-3.jpg",
    //   subtitle: "SIAMA",
    //   title: "Hydra Facial",
    //   desc: "Deep cleansing, exfoliation, and hydration in one luxurious facial treatment that leaves your skin glowing, refreshed, and youthful.",
    // },
    
    // {
    //   image: "/img/hero-4.jpg",
    //   subtitle: "SIAMA",
    //   title: "Hydra Facial",
    //   desc: "Deep cleansing, exfoliation, and hydration in one luxurious facial treatment that leaves your skin glowing, refreshed, and youthful.",
    // },
    
    // {
    //   image: "/img/hero-5.jpg",
    //   subtitle: "SIAMA",
    //   title: "Hydra Facial",
    //   desc: "Deep cleansing, exfoliation, and hydration in one luxurious facial treatment that leaves your skin glowing, refreshed, and youthful.",
    // },
    
    // {
    //   image: "/img/hero-6.jpg",
    //   subtitle: "SIAMA",
    //   title: "Hydra Facial",
    //   desc: "Deep cleansing, exfoliation, and hydration in one luxurious facial treatment that leaves your skin glowing, refreshed, and youthful.",
    // },
    
    // {
    //   image: "/img/hero-7.jpg",
    //   subtitle: "SIAMA",
    //   title: "Hydra Facial",
    //   desc: "Deep cleansing, exfoliation, and hydration in one luxurious facial treatment that leaves your skin glowing, refreshed, and youthful.",
    // },
  ];

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // Auto scroll after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollDown();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-banner-wrapper position-relative">
    <Swiper
  modules={[Autoplay, EffectFade, Pagination]}
  effect="fade"
  loop={true}
  speed={1000}
  autoplay={{
    delay: 5000,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  onSwiper={(swiper) => {
    swiperRef.current = swiper;
  }}
  className="hero-swiper"
>
  {slides.map((slide, index) => (
    <SwiperSlide key={index}>
      <section className="hero-section">
        <img
          src={slide.image}
          alt={slide.title || `Slide ${index + 1}`}
          className="hero-image"
        />
      </section>
    </SwiperSlide>
  ))}
</Swiper>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={scrollDown}>
        <span>SCROLL</span>
      </div>
    </section>
  );
}