"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "../contact-form";

const services = [
  "Laser Hair Reduction",
  "Skin Rejuvenation",
  "Hair Treatment",
  "Advanced Laser Facial",
];

const serviceLinks: Record<string, string> = {
  "Laser Hair Reduction": "/services/laser-hair-reduction",
  "Skin Rejuvenation": "/services/skin-rejuvenation",
  "Hair Treatment": "/services/hair-treatment",
  "Advanced Laser Facial": "/services/advanced-laser-facial",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [selectedService, setSelectedService] = useState(services[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate through services
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % services.length;
        setSelectedService(services[nextIndex]);
        return nextIndex;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Contact Form Section */}
      {/* <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.contactHeader}>
            <h2 className={styles.contactTitle}>Book Your Consultation</h2>
            <p className={styles.contactSubtitle}>
              Schedule your personalized treatment today
            </p>
          </div>
          <div className={styles.contactGrid}>
            {/--* Left Column: Contact Form *--/}
            <div className={styles.contactFormColumn}>
              <ContactForm footer={true} />
            </div>

            {/--* Right Column: Contact Information *--/}
            <div className={styles.contactInfoColumn}>
              <div className={styles.contactInfoCard}>
                <h3 className={styles.contactInfoTitle}>Contact Information</h3>
                <div className={styles.contactInfoList}>
                  <div className={styles.contactInfoItem}>
                    <div className={styles.contactIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.iconSvg}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className={styles.contactInfoContent}>
                      <h4 className={styles.contactInfoHeading}>Address</h4>
                      <a
                        href="https://maps.google.com/?q=First+Floor,+C-129+Pocket+L,+Noida+sector+18,+Uttar+Pradesh+201301"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.addressLink}
                      >
                        <p className={styles.contactInfoText}>
                          First Floor, C-129 Pocket L
                          <br />
                          Noida sector 18, Uttar Pradesh (201301)
                        </p>
                      </a>
                      <div className={styles.mapContainer}>
                        <iframe
                          src="https://www.google.com/maps?q=First+Floor,+C-129+Pocket+L,+Noida+sector+18,+Uttar+Pradesh+201301&output=embed"
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className={styles.mapIframe}
                          title="Siama Location Map"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div className={styles.contactInfoGrid}>
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={styles.iconSvg}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className={styles.contactInfoContent}>
                        <h4 className={styles.contactInfoHeading}>Phone</h4>
                        <p className={styles.contactInfoText}>
                          <a href="tel:+918287795045" className={styles.contactInfoLink}>
                            8287795045
                          </a>
                          {" / "}
                          <a href="tel:+919220947771" className={styles.contactInfoLink}>
                            9220947771
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={styles.iconSvg}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className={styles.contactInfoContent}>
                        <h4 className={styles.contactInfoHeading}>Email</h4>
                        <p className={styles.contactInfoText}>
                          <a
                            href="mailto:reach.siama@gmail.com"
                            className={styles.contactInfoLink}
                          >
                            reach.siama@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Services Menu Section */}
      {/* <section className={styles.servicesMenuSection}>
        <div className={styles.servicesMenuContainer}>
          <div className={styles.servicesMenu}>
            {services.map((service, index) => (
              <Link
                key={service}
                href={serviceLinks[service]}
                className={`${styles.serviceMenuItem} ${
                  selectedService === service ? styles.serviceMenuItemActive : ""
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedService(service);
                }}
              >
                {service}
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            {/* Brand Section */}
            <div className={styles.brandSection}>
              <div className={styles.logoContainer}>
                <Image
              src="/img/logo-white.png"
                  alt="Siama Logo"
                  width={126}
                  height={50}
                  className={styles.logoImage}
                />
              </div>
              <p className={styles.brandDescription}>
                Let us make you confident by reaching out to you at door step
                and showering the beauty all over. Book your appointment today
                to bring the change.
              </p>
              
               <h4 className={styles.partnerHeading}>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a
                  href="tel:+919217508999"
                  className={`${styles.socialLink} ${styles.phoneLink}`}
                  aria-label="Phone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/siamaskincare/"
                  className={styles.socialLink}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.26 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCzx2IumMFVltYJcqtyPWqNg"
                  className={styles.socialLink}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/siama"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              {/* <h4 className={styles.partnerHeading}>Our Partners</h4>
              <p className={styles.brandDescription}>
              FIBE |
CAREPE |
ZEROPAY |
BAJAJ FINSERV | 
SHOPSE | 
SAVEIN</p>
            */}
  
            </div>
            {/* Services Section */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Services</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link
                    href="/services/laser-hair-reduction"
                    className={styles.footerLink}
                  >
                    Laser Hair Reduction
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/skin-rejuvenation"
                    className={styles.footerLink}
                  >
                    Skin Rejuvenation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/hair-treatment"
                    className={styles.footerLink}
                  >
                    Hair Treatment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/advanced-laser-facial"
                    className={styles.footerLink}
                  >
                    Advanced Laser Facial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/siama-dental"
                    className={styles.footerLink}
                  >
              Siama Dental
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link
                    href="/about"
                    className={styles.footerLink}
                  >
                    About Us
                  </Link>
                </li>
                  <li>
                  <Link
                    href="/clinic"
                    className={styles.footerLink}
                  >
                    Clinic
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/team"
                    className={styles.footerLink}
                  >
                    Our Team
                  </Link>
                </li>
               
                <li>
                  <Link
                    href="/blogs"
                    className={styles.footerLink}
                    target="_blank"
                  >
                    Blog 
                  </Link>
                </li>
              </ul>
            </div>

            {/* Helpful Links Section */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Helpful Links</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link
                    href="/contact"
                    className={styles.footerLink}
                  >
                    Contact Us
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/become-professional"
                    className={styles.footerLink}
                  >
                    Become a Professional
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/sitemap"
                    className={styles.footerLink}
                  >
                    Site Map
                  </Link>
                </li> <li>
                  <Link
                    href="/privacy"
                    className={styles.footerLink}
                  >
                    Privacy and Policies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className={styles.footerLink}
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className={styles.footerLink}>
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-delivery"
                    className={styles.footerLink}
                  >
                    Shipping and Delivery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us Section */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <a
                    href="mailto:reach.siama@gmail.com"
                    className={styles.contactLink}
                  >
                    reach.siama@gmail.com
                  </a>
                </li>
                 <li>
                  <a
                    href="tel:+919217508999"
                    className={styles.contactLink}
                  >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>    (+91) 9217508999
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918287795045"
                    className={styles.contactLink}
                  >
                   <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>   (+91) 8287795045
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919220947771"
                    className={styles.contactLink}
                  >
                   <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>  (+91) 9220947771
                  </a>
                </li>
                
                
              </ul>
           
            </div>
          </div>

          {/* Copyright Section */}
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {currentYear} Siama <b>(Arkab Consumers Pvt Ltd)</b>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {/* <a
        href="https://wa.me/918287795045"
        className={styles.whatsappFloat}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a> */}
    </>
  );
}

