"use client";

import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

interface ClinicLocation {
  id: number;
  name: string;
  image: string;
  status: "open" | "closed" | "open soon";
  rating: number;
  reviewCount: number;
  address: string;
  hours: string;
  services: string[];
  phone?: string;
}

export default function ExperienceCentres() {
  const clinics: ClinicLocation[] = [
    {
      id: 1,
      name: "Noida - Sector-18",
      image: "/img/assts/siama-banner.jpg",
      status: "open",
      rating: 4.8,
      reviewCount: 734,
      address: "C-129, 1st Floor, Sec-18, Noida, UP-201301",
      hours: "Monday - Sunday: 08:00 AM - 08:00 PM",
      services: ["Aligners", "Braces", "Teeth Whitening"],
      phone: "+91-1234567890",
    },
    {
      id: 2,
      name: "Gurgaon - Sec 67",
      image: "/img/assts/siama-banner2.jpeg",
      status: "open soon",
      rating: 4.8,
      reviewCount: 39,
      address: "Shop No 104, M3M Urbana, Sec67, Gurgaon",
      hours: "Monday - Sunday: 08:00 AM - 08:00 PM",
      services: ["Aligners", "Braces", "Teeth Whitening"],
      phone: "+91-1234567891",
    },
    {
      id: 3,
      name: "Ghaziabad",
      image: "/img/assts/siama-banner3.jpeg",
      status: "open",
      rating: 4.8,
      reviewCount: 540,
      address: "Shop 425, Orbit Plaza, Crossing Republik, Ghaziabad-UP- 201016",
      hours: "Monday - Sunday: 08:00 AM - 08:00 PM",
      services: ["Aligners", "Braces", "Teeth Whitening"],
      phone: "+91-1234567892",
    },
    // {
    //   id: 4,
    //   name: "Delhi - Connaught Place",
    //   image: "/img/assts/siama-banner.jpg",
    //   status: "open",
    //   rating: 4.7,
    //   reviewCount: 120,
    //   address: "Shop No. 12, Block A, Connaught Place, New Delhi",
    //   hours: "Monday - Sunday: 09:00 AM - 09:00 PM",
    //   services: ["HydraFacial", "Laser Hair Reduction", "Skin Treatments"],
    //   phone: "+91-1234567893",
    // },
    // {
    //   id: 5,
    //   name: "Mumbai - Andheri",
    //   image: "/img/assts/siama-banner2.jpeg",
    //   status: "open",
    //   rating: 4.5,
    //   reviewCount: 256,
    //   address: "Shop No. 45, Andheri West, Near Andheri Station, Mumbai",
    //   hours: "Monday - Sunday: 08:00 AM - 08:00 PM",
    //   services: ["PRP Hair Treatment", "HydraFacial", "Skin Rejuvenation"],
    //   phone: "+91-1234567894",
    // },
    // {
    //   id: 6,
    //   name: "Bangalore - Koramangala",
    //   image: "/img/assts/siama-banner3.jpeg",
    //   status: "closed",
    //   rating: 4.7,
    //   reviewCount: 3,
    //   address: "No. 123, 1st Floor, Koramangala 5th Block, Bangalore",
    //   hours: "Monday - Sunday: 10:00 AM - 07:00 PM",
    //   services: ["Aligners", "Braces", "Teeth Whitening"],
    //   phone: "+91-1234567895",
    // },
  ];

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDoctorConsult = (clinicId: number) => {
    // Handle doctor consultation booking
    console.log("Book consultation for clinic:", clinicId);
  };

  const handleChat = (clinicId: number) => {
    // Handle chat functionality
    console.log("Start chat for clinic:", clinicId);
  };

  return (
    <div className={styles.clinicsGrid}>
      {clinics.map((clinic) => (
        <div key={clinic.id} className={styles.clinicCard}>
          <div className={styles.imageContainer}>
            <Image
              src={clinic.image}
              alt={clinic.name}
              fill
              className={styles.clinicImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={styles.statusBadge}>
              <span
                className={`${styles.statusDot} ${
                  clinic.status === "open"
                    ? styles.open
                    : clinic.status === "open soon"
                      ? styles.openSoon
                      : styles.closed
                }`}
              ></span>
              <span className={styles.statusText}>
                {clinic.status === "open"
                  ? "Open"
                  : clinic.status === "open soon"
                    ? "Open soon"
                    : "Closed"}
              </span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill={i < Math.floor(clinic.rating) ? "#FFD700" : "none"}
                    stroke={i < Math.floor(clinic.rating) ? "#FFD700" : "#E0E0E0"}
                    strokeWidth="2"
                    className={styles.star}
                  >
                    <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                  </svg>
                ))}
              </div>
              <span className={styles.ratingText}>
                {clinic.rating} ({clinic.reviewCount} reviews)
              </span>
            </div>

            <h3 className={styles.clinicName}>{clinic.name}</h3>

            <div className={styles.addressSection}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.icon}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p className={styles.address}>{clinic.address}</p>
            </div>

            <div className={styles.hoursSection}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.icon}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <p className={styles.hours}>{clinic.hours}</p>
            </div>

            <div className={styles.servicesSection}>
              <p className={styles.servicesLabel}>Services:</p>
              <div className={styles.servicesList}>
                {clinic.services.map((service, index) => (
                  <span key={index} className={styles.serviceTag}>
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.actionBtn}
                onClick={() => clinic.phone && handleCall(clinic.phone)}
                disabled={!clinic.phone}
              >
                Call
              </button>
              {/* <button
                className={styles.actionBtn}
                onClick={() => handleDoctorConsult(clinic.id)}
              >
                Doctor Consult
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => handleChat(clinic.id)}
              >
                Chat
              </button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

