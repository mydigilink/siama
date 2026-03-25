"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ResultsSection() {
  const results = [
    {
      id: 1,
      image: "/results/Before_After_01_Fillers_F_P.jpg",
      alt: "Before After Result 1",
    },
    {
      id: 2,
      image: "/results/Before_After_02_Fillers_F_P.jpg",
      alt: "Before After Result 2",
    },
    {
      id: 3,
      image: "/results/Before_After_01_Fillers_F_P.jpg",
      alt: "Before After Result 3",
    },
    {
      id: 4,
      image: "/results/Before_After_02_Fillers_F_P.jpg",
      alt: "Before After Result 4",
    },
  ];

  return (
    <section className="results-section py-5">
      <div className="container text-center">
        <h2 className="results-title mb-2">
        See the Transformations You’ll Love

        </h2>
<p className="results-desc mb-4">
          Check out real results from our clients and testimonials– from glowing skin to flawless features.
        </p>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            576: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
          }}
          className="results-swiper"
        >
          {results.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="result-card">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={400}
                  height={400}
                  className="img-fluid rounded-4"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}