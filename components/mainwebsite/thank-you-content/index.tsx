"use client";

import React from "react";
import Link from "next/link";
import styles from "./style.module.scss";

export default function ThankYouContent() {
  return (
    <section className={styles.thankYouSection}>
      <div className={styles.container}>
        {/* Success Icon */}
        <div className={styles.successIcon}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="url(#gradient)" />
            <path
              d="M25 40L35 50L55 30"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#FFB6C1" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Thank You Heading */}
        <h1 className={styles.thankYouHeading}>Thank You!</h1>

        {/* Confirmation Message */}
        <p className={styles.confirmationMessage}>
          Your message has been received successfully
        </p>

        {/* Follow-up Information */}
        <p className={styles.followUpText}>
          We truly appreciate you reaching out to us. Our expert team will review your inquiry and get back to you within 24 hours with personalized assistance.
        </p>

        {/* What happens next section */}
        <div className={styles.nextStepsCard}>
          <h2 className={styles.nextStepsTitle}>What happens next?</h2>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepIcon1}`}>
                <span className={styles.stepNumber}>1</span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Review</h3>
                <p className={styles.stepDescription}>
                  Our specialists review your inquiry within 24 hours
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepIcon2}`}>
                <span className={styles.stepNumber}>2</span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Connect</h3>
                <p className={styles.stepDescription}>
                  We contact you to discuss your specific requirements
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={`${styles.stepIcon} ${styles.stepIcon3}`}>
                <span className={styles.stepNumber}>3</span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Schedule</h3>
                <p className={styles.stepDescription}>
                  Book your personalized consultation or treatment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Assistance Section */}
        <div className={styles.immediateAssistance}>
          <h3 className={styles.immediateAssistanceTitle}>
            Need immediate assistance?
          </h3>
          <p className={styles.immediateAssistanceText}>
            For urgent inquiries, our team is here to help you right away
          </p>
          <div className={styles.actionButtons}>
            <a href="tel:8287795045" className={styles.callButton}>
              Call Now
            </a>
            <a
              href="https://wa.me/918287795045"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Back to Home Link */}
        <Link href="/" className={styles.backToHome}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}

