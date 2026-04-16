"use client";

import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

export default function LaserPigmentationRemovalContent() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image
            src="/img/assts/advanced-laser-facial/siama-photo-2.jpeg"
            alt="Laser Pigmentation Removal Treatment"
            fill
            className={styles.heroImage}
            priority
            sizes="100vw"
            quality={100}
            unoptimized={false}
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Laser Pigmentation Removal</h1>
              <p className={styles.heroSubtitle}>
                Advanced dermatological treatment to safely and effectively reduce unwanted pigmentation, dark spots, and uneven skin tone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          {/* Introduction */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            <p className={styles.paragraph}>
              Laser Pigmentation Removal is an advanced dermatological treatment designed to safely and effectively reduce unwanted pigmentation, dark spots, and uneven skin tone. Pigmentation issues are one of the most common skin concerns, especially in Indian skin types, due to sun exposure, hormonal changes, genetics, acne, and aging. This treatment uses precise laser technology to target excess melanin deposits in the skin without harming the surrounding tissue.
            </p>
            <p className={styles.paragraph}>
              Unlike creams or chemical peels that offer slow or temporary improvement, Laser Pigmentation Removal provides deeper correction, long-lasting results, and improved skin clarity by addressing pigmentation at its source.
            </p>
          </div>

          {/* What Is Pigmentation */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What Is Pigmentation?</h2>
            <p className={styles.paragraph}>
              Pigmentation occurs when melanin—the natural pigment responsible for skin color—is produced unevenly or in excess. This leads to visible dark patches or spots on the skin.
            </p>
            <div className={styles.pigmentationTypes}>
              <h3 className={styles.subSectionTitle}>Common Types of Pigmentation:</h3>
              <ul className={styles.pigmentationList}>
                <li>Melasma (hormonal pigmentation)</li>
                <li>Sun spots / Age spots</li>
                <li>Freckles</li>
                <li>Post-inflammatory hyperpigmentation (PIH) from acne or injuries</li>
                <li>Uneven skin tone</li>
              </ul>
            </div>
          </div>

          {/* What Is Laser Pigmentation Removal */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What Is Laser Pigmentation Removal?</h2>
            <p className={styles.paragraph}>
              Laser Pigmentation Removal uses specific wavelengths of light to selectively target melanin deposits in the skin. The laser energy breaks down the pigment into microscopic particles, which are then naturally eliminated by the body&apos;s immune system over time.
            </p>
            <p className={styles.paragraph}>
              This method allows precise treatment of pigmentation without damaging the surrounding healthy skin, making it one of the safest and most effective solutions for pigmentation correction.
            </p>
          </div>

          {/* How It Works */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How Laser Pigmentation Removal Works</h2>
            <div className={styles.stepsList}>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Targeted Laser Energy:</h3>
                <p className={styles.stepDescription}>
                  The laser identifies melanin and delivers controlled energy to pigment-rich areas.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Pigment Breakdown:</h3>
                <p className={styles.stepDescription}>
                  The melanin absorbs the laser energy and shatters into tiny fragments.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Natural Elimination:</h3>
                <p className={styles.stepDescription}>
                  The body&apos;s lymphatic system gradually removes these fragments.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Skin Renewal:</h3>
                <p className={styles.stepDescription}>
                  Clearer, brighter skin emerges as new cells regenerate.
                </p>
              </div>
            </div>
          </div>

          {/* Skin Concerns Treated */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skin Concerns Treated</h2>
            <p className={styles.paragraph}>
              Laser Pigmentation Removal effectively treats:
            </p>
            <ul className={styles.concernsList}>
              <li>Dark spots and sun spots</li>
              <li>Melasma and hormonal pigmentation</li>
              <li>Acne marks and post-acne pigmentation</li>
              <li>Uneven skin tone</li>
              <li>Freckles</li>
              <li>Patchy discoloration</li>
            </ul>
          </div>

          {/* Types of Lasers */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Types of Lasers Used for Pigmentation</h2>
            <p className={styles.paragraph}>
              Dermatologists may use different laser technologies depending on pigmentation depth and skin type:
            </p>
            <div className={styles.typesGrid}>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Q-Switched Nd:YAG Laser</h3>
                <ul className={styles.typeFeatures}>
                  <li>Most commonly used for Indian skin</li>
                  <li>Targets deep and superficial pigmentation</li>
                  <li>Safe and effective with minimal risk</li>
                </ul>
              </div>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Pico Laser</h3>
                <ul className={styles.typeFeatures}>
                  <li>Ultra-short pulse laser</li>
                  <li>Faster pigment clearance</li>
                  <li>Fewer sessions required</li>
                </ul>
              </div>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Fractional Laser (Selective Use)</h3>
                <ul className={styles.typeFeatures}>
                  <li>Used when pigmentation is associated with texture issues</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benefits of Laser Pigmentation Removal</h2>
            <ul className={styles.benefitsList}>
              <li>Visible reduction in pigmentation</li>
              <li>Brighter, more even skin tone</li>
              <li>Targets pigment without skin damage</li>
              <li>Safe for darker skin tones when performed correctly</li>
              <li>Minimal downtime</li>
              <li>Long-lasting results</li>
            </ul>
          </div>

          {/* Ideal Candidates */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ideal Candidates</h2>
            <p className={styles.paragraph}>
              This treatment is suitable for individuals who:
            </p>
            <ul className={styles.candidatesList}>
              <li>Have stubborn pigmentation unresponsive to creams</li>
              <li>Suffer from sun damage or acne marks</li>
              <li>Want even-toned, brighter skin</li>
              <li>Prefer non-surgical solutions</li>
            </ul>
            <div className={styles.notRecommended}>
              <strong>❌ Not suitable for:</strong>
              <ul>
                <li>Active skin infections</li>
                <li>Recent tanning</li>
                <li>Certain medical conditions (to be assessed by dermatologist)</li>
              </ul>
            </div>
          </div>

          {/* Treatment Procedure */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Treatment Procedure</h2>
            <p className={styles.paragraph}>Step-by-Step:</p>
            <div className={styles.procedureSteps}>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Skin Evaluation & Diagnosis</h3>
                  <p>Pigmentation type and depth assessment.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Pre-Treatment Preparation</h3>
                  <p>Cleansing and application of cooling gel or numbing cream.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Laser Application</h3>
                  <p>Short pulses of laser energy are delivered to pigmented areas.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Post-Treatment Soothing</h3>
                  <p>Calming creams and sunscreen are applied.</p>
                </div>
              </div>
            </div>
            <div className={styles.procedureTime}>
              <strong>⏱ Duration:</strong> 20–40 minutes
            </div>
          </div>

          {/* Pain & Comfort */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pain & Comfort</h2>
            <ul className={styles.comfortList}>
              <li>Mild tingling or snapping sensation</li>
              <li>Generally well-tolerated</li>
              <li>Cooling systems minimize discomfort</li>
            </ul>
          </div>

          {/* Recovery & Downtime */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recovery & Downtime</h2>
            <ul className={styles.recoveryList}>
              <li>Mild redness for a few hours</li>
              <li>Darkening of spots initially (normal)</li>
              <li>Pigment flakes off gradually over days</li>
              <li>No major downtime</li>
            </ul>
          </div>

          {/* Sessions Required */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Number of Sessions Required</h2>
            <ul className={styles.sessionsList}>
              <li><strong>Average:</strong> 4–6 sessions</li>
              <li><strong>Interval:</strong> 3–4 weeks</li>
              <li>Deep pigmentation may require more sessions</li>
            </ul>
          </div>

          {/* Results & Longevity */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Results & Longevity</h2>
            <ul className={styles.resultsList}>
              <li>Gradual lightening after each session</li>
              <li>Noticeable improvement within 3–4 sessions</li>
              <li>Results can last long-term with sun protection and maintenance</li>
            </ul>
          </div>

          {/* Pre & Post Treatment Care */}
          <div className={styles.careSection}>
            <div className={styles.careCard}>
              <h2 className={styles.careTitle}>Pre-Treatment Care</h2>
              <ul className={styles.careList}>
                <li>Avoid sun exposure for at least 1 week</li>
                <li>Stop bleaching creams and active ingredients</li>
                <li>Avoid waxing or threading on treated area</li>
                <li>Use sunscreen daily</li>
              </ul>
            </div>
            <div className={styles.careCard}>
              <h2 className={styles.careTitle}>Post-Treatment Care</h2>
              <ul className={styles.careList}>
                <li>Strict sun protection (SPF 30–50)</li>
                <li>Avoid heat, steam, and sweating for 24–48 hours</li>
                <li>Use gentle skincare products</li>
                <li>Follow dermatologist-prescribed creams</li>
              </ul>
            </div>
          </div>

          {/* Safety & Side Effects */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Safety & Side Effects</h2>
            <p className={styles.paragraph}>
              Laser Pigmentation Removal is safe and FDA-approved when performed by trained professionals.
            </p>
            <div className={styles.sideEffects}>
              <h3 className={styles.sideEffectsTitle}>Temporary Side Effects:</h3>
              <ul className={styles.sideEffectsList}>
                <li>Redness</li>
                <li>Mild swelling</li>
                <li>Temporary darkening of spots</li>
              </ul>
              <p className={styles.sideEffectsNote}>
                Serious complications are rare.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Laser Pigmentation Removal vs Topical Treatments
            </h2>
            <div className={styles.comparisonTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Laser Treatment</div>
                <div className={styles.tableCell}>Creams & Peels</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Targets deep pigment</div>
                <div className={styles.tableCell}>Surface-level action</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Faster results</div>
                <div className={styles.tableCell}>Slow improvement</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Long-lasting</div>
                <div className={styles.tableCell}>Recurrence common</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Controlled & precise</div>
                <div className={styles.tableCell}>Variable effectiveness</div>
              </div>
            </div>
          </div>

          {/* Why Choose */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Why Choose Laser Pigmentation Removal?</h2>
            <ul className={styles.whyChooseList}>
              <li>Advanced medical-grade technology</li>
              <li>Customized for individual skin type</li>
              <li>Safe for Indian and darker skin tones</li>
              <li>Clinically proven results</li>
            </ul>
          </div>

          {/* Conclusion */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Conclusion</h2>
            <p className={styles.paragraph}>
              Laser Pigmentation Removal is a highly effective solution for achieving clear, even-toned, and radiant skin. By targeting melanin at its source, this treatment delivers superior and longer-lasting results compared to conventional methods. With expert care and proper post-treatment maintenance, individuals can enjoy brighter, healthier skin with confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

