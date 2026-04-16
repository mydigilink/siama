"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export default function PersonalizedTreatments() {
  const steps: ProcessStep[] = [
    {
      number: 1,
      title: "Book Virtual Consultation",
      description: "Virtual access to top Dermats & receive expert guidance, personalized treatment plans",
      image: "/img/assts/process/consult_2.jpg",
      link: "https://wa.me/918287795045",
    },
    {
      number: 2,
      title: "Book your Treatment",
      description: "Dermatologist-designed regimens powered by your skin profile",
      image: "/img/assts/process/analysis_2.jpg",
      link: "https://wa.me/918287795045",
    },
    {
      number: 3,
      title: "Meet Your Doctors",
      description: "Certified therapists deliver treatments that are safe, effective and results driven",
      image: "/img/assts/process/therapist_3.png",
      link: "/team",
    },
    {
      number: 4,
      title: "Book Your Appointment",
      description: "Book your appointment with the therapist",
      image: "/img/assts/process/appointment_2.jpg",
      link: "/contact",
    },
  ];

  return (
    <section className="container">
      <div className={styles.section}>
      <div className={styles.container}>
        {/* <div className={styles.header}>
          <h2 className={styles.title}>Personalized Treatments</h2>
          <p className={styles.description}>
            Every individual has a different skin profile. So, generic beauty care
            products cannot provide the ultimate solution. Get the custom remedy
            with our hair care and skin care treatment in Delhi NCR. We want to
            know your beauty goals to tailor our services for a holistic approach.
          </p>
        </div> */}

        <div className={styles.processSteps}>
          {steps.map((step) => {
            const CardContent = (
              <div className={styles.stepCard}>
                <div className={styles.stepImageWrapper}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className={styles.stepImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 300px"
                  />
                  <div className={styles.stepOverlay}></div>
                  <div className={styles.stepContent}>
                    {/* <div className={styles.stepNumber}>{step.number}</div> */}
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              </div>
            );

            // Check if link is external (starts with http)
            const isExternalLink = step.link?.startsWith('http');
            
            return step.link ? (
              isExternalLink ? (
                <a
                  key={step.number}
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stepLink}
                >
                  {CardContent}
                </a>
              ) : (
                <Link key={step.number} href={step.link} className={styles.stepLink}>
                  {CardContent}
                </Link>
              )
            ) : (
              <div key={step.number}>{CardContent}</div>
            );
          })}
        </div>
      </div></div>
    </section>
  );
}
