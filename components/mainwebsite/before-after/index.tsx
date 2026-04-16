"use client";

import React, { useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import styles from "./style.module.scss";

export default function BeforeAfter() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const carouselRef = useRef<any>(null);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const results = [
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft1.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft2_up0.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft3.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft4.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft5.jpg",
    },
    {
      name: "before - after treatment",
      image: "/img/assts/before-after_new/bef-aft6.jpg",
    },
  ];

  const handleGoToSlide = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.goToSlide(index);
      setCurrentSlide(index);
    }
  };

  const handleAfterChange = (previousSlide: number, { currentSlide }: { currentSlide: number }) => {
    setCurrentSlide(currentSlide);
  };

  return (
    <div className='container mx-auto px-4 py-12'>
    <div className={styles.beforeAfter}>
      <div className={styles.container}>
        {/* <h3 className={styles.sectionTitle}>Siama Works</h3> */}

        {/* <div className={styles.contentSection}>
          <div 
            className={styles.marqueeWrapper}
            onMouseEnter={() => setIsMarqueeHovered(true)}
            onMouseLeave={() => setIsMarqueeHovered(false)}
          >
            <div className={styles.trackContainer}>
              <div className={`${styles.marqueeTrack} ${isMarqueeHovered ? styles.marqueePaused : ''}`}>
                {[
                  { icon: "/img/assts/SiamaWorks/100-safe.png", label: "Completely Safe & Secure", alt: "Completely Safe & Secure", breakAfter: "Completely Safe " },
                  { icon: "/img/assts/SiamaWorks/Dermatologist-Monitored.png", label: "Expert Dermatologist Care", alt: "Expert Dermatologist Care", breakAfter: "Expert Dermatologist" },
                  { icon: "/img/assts/SiamaWorks/US-FDA-Approved.png", label: "FDA Certified Technology", alt: "FDA Certified Technology", breakAfter: "FDA Certified" },
                  { icon: "/img/assts/SiamaWorks/Quick-Lasting-Results.png", label: "Fast & Lasting Results", alt: "Fast & Lasting Results", breakAfter: "Fast & Lasting" },
                ].map((badge, idx) => {
                  const renderLabel = () => {
                    if (badge.breakAfter) {
                      const parts = badge.label.split(badge.breakAfter);
                      return (
                        <>
                          <span>{badge.breakAfter}&nbsp;</span>
                          <span>{parts[1]?.trim()}</span>
                        </>
                      );
                    }
                    return <span>&nbsp;{badge.label}</span>;
                  };

                  return (
                    <div key={idx} className={styles.badge}>
                      <Image src={badge.icon} alt={badge.alt} width={48} height={48} className={styles.icon} />
                      <p className={styles.label}>
                        {renderLabel()}
                      </p>
                    </div>
                  );
                })}
                {/* Duplicate for seamless loop *--/}
                {[
                  { icon: "/img/assts/SiamaWorks/100-safe.png", label: "Completely Safe & Secure", alt: "Completely Safe & Secure", breakAfter: "Completely Safe " },
                  { icon: "/img/assts/SiamaWorks/US-FDA-Approved.png", label: "FDA Certified Technology", alt: "FDA Certified Technology", breakAfter: "FDA Certified" },
                  { icon: "/img/assts/SiamaWorks/Dermatologist-Monitored.png", label: "Expert Dermatologist Care", alt: "Expert Dermatologist Care", breakAfter: "Expert Dermatologist" },
                  { icon: "/img/assts/SiamaWorks/At-Home-Sessions.png", label: "Convenient At-Home Sessions", alt: "Convenient At-Home Sessions", breakAfter: "Convenient At-Home" },
                  { icon: "/img/assts/SiamaWorks/Quick-Lasting-Results.png", label: "Fast & Lasting Results", alt: "Fast & Lasting Results", breakAfter: "Fast & Lasting" },
                ].map((badge, idx) => {
                  const renderLabel = () => {
                    if (badge.breakAfter) {
                      const parts = badge.label.split(badge.breakAfter);
                      return (
                        <>
                          <span>{badge.breakAfter}&nbsp;</span>
                          <span>{parts[1]?.trim()}</span>
                        </>
                      );
                    }
                    return <span>{badge.label}</span>;
                  };

                  return (
                    <div key={`dup-${idx}`} className={styles.badge}>
                      <Image src={badge.icon} alt={badge.alt} width={48} height={48} className={styles.icon} />
                      <p className={styles.label}>
                        {renderLabel()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div> */}

        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>
            Siama <span className={styles.resultsTitleAccent}>Results</span>
          </h2>

          <div className={styles.carouselWrapper}>
            <Carousel
              ref={carouselRef}
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={6000}
              keyBoardControl={true}
              customTransition="all 1s ease"
              transitionDuration={500}
              slidesToSlide={1}
              containerClass={styles.carouselContainer}
              arrows={true}
              afterChange={handleAfterChange}
              itemClass={styles.carouselItem}
            >
              {results.map((item, index) => (
                <div key={index} className={styles.resultCard}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={250}
                      height={300}
                      className={styles.resultImage}
                    />
                  </div>
                  {/* <p className={styles.resultLabel}>
                    {item.name}
                  </p> */}
                </div>
              ))}
            </Carousel>
          </div>

          {/* Current Slide Indicator */}
          <div className={styles.slideIndicator}>
            <div className={styles.slideDots}>
              {results.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.slideDot} ${
                    index === currentSlide ? styles.slideDotActive : ""
                  }`}
                  onClick={() => handleGoToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

