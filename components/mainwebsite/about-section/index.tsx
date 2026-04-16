import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src="/img/assts/WbQnbas.png"
                alt="About Siama"
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
          <div className={styles.textSection}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>
                About <span className={styles.highlight}>Siama</span>
              </h2>
              <p className={styles.paragraph}>
                At Siama, we devote ourselves to deliver best quality services at
                your home with top notch professionals and high-quality products.
                Siama is founded by Dr Nidhi Khandelwal and Co-founded by Mr.
                Manoj Srivastava. Our products carry nature&apos;s essence that assure
                quality and are skin friendly with long lasting and effective
                formulas.
              </p>
              <p className={styles.paragraph}>
                SIAMA is a symbiotic platform for therapist, doctors & consumers,
                it is creating an entire ecosystem where skilled & experienced
                therapist along with doctors are getting job opportunities &
                consumers are taking door step delivery for their well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

