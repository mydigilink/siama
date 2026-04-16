"use client";
import Image from "next/image";
import styles from "./PartnerLogos.module.css";

type Partner = {
  name: string;
  logo: string;
};

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const partners: Partner[] = [
  { name: "SaveIn", logo: "/img/logos/1.jpeg" },
  { name: "ShopSE", logo: "/img/logos/2.jpeg" },
  { name: "BAJAJ FINSERV", logo: "/img/logos/6.jpeg" },
  { name: "Zero Pay", logo: "/img/logos/4.jpeg" },
  { name: "Fibe", logo: "/img/logos/5.jpeg" },
  { name: "Carepay", logo: "/img/logos/3.jpeg" },
];

export default function PartnerLogos() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className={styles.sectionTitle}>Our Partners</h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          navigation={true}
          breakpoints={{
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 6 },
            1200: { slidesPerView: 6 },
          }}
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="partner-card p-2 border rounded shadow-sm text-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  height={60}
                  width={120}
                  className={styles.partnerLogo}
                  style={{ width: "auto" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Styling */}
      <style jsx>{`
        .partner-card {
          transition: all 0.3s ease;
         
        }

        .partner-card:hover {
          transform: translateY(-5px);
        
        }

        .partner-logo {
          filter: grayscale(100%);
          transition: 0.3s ease;
        }

        .partner-card:hover .partner-logo {
          filter: grayscale(0%);
        }
      `}</style>
    </section>
  );
}