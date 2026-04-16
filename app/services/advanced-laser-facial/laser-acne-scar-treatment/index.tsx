"use client";

import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

export default function LaserAcneScarTreatmentContent() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image
            src="/img/assts/advanced-laser-facial/siama-photo-3.jpeg"
            alt="Laser Acne & Acne Scar Treatment"
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
              <h1 className={styles.heroTitle}>Laser Acne & Acne Scar Treatment</h1>
              <p className={styles.heroSubtitle}>
                Advanced dermatological solution to treat active acne, reduce inflammation, and visibly improve acne scars using medical-grade laser technology
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
              Laser Acne & Acne Scar Treatment is an advanced dermatological solution designed to treat active acne, reduce inflammation, and visibly improve acne scars using medical-grade laser technology. Acne is a common skin condition affecting adolescents and adults alike, and when left untreated or improperly managed, it often leads to permanent scarring and pigmentation issues. Laser treatment addresses acne at its root while stimulating natural skin repair for long-term improvement.
            </p>
            <p className={styles.paragraph}>
              This treatment is especially effective for individuals who have not responded well to topical medications, oral treatments, or chemical peels, and is safe for Indian and darker skin types when performed under expert supervision.
            </p>
          </div>

          {/* Understanding Acne and Acne Scars */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Understanding Acne and Acne Scars</h2>
            
            <div className={styles.subSection}>
              <h3 className={styles.subSectionTitle}>What Causes Acne?</h3>
              <p className={styles.paragraph}>
                Acne develops due to a combination of:
              </p>
              <ul className={styles.acneCausesList}>
                <li>Excess oil (sebum) production</li>
                <li>Clogged pores</li>
                <li>Acne-causing bacteria</li>
                <li>Inflammation</li>
                <li>Hormonal imbalance</li>
              </ul>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subSectionTitle}>Types of Acne Scars</h3>
              <ul className={styles.scarTypesList}>
                <li>Atrophic scars (depressed scars)</li>
                <li>Ice-pick scars</li>
                <li>Boxcar scars</li>
                <li>Rolling scars</li>
                <li>Post-inflammatory hyperpigmentation (PIH)</li>
                <li>Redness or marks after acne</li>
              </ul>
            </div>
          </div>

          {/* What Is Laser Acne & Acne Scar Treatment */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What Is Laser Acne & Acne Scar Treatment?</h2>
            <p className={styles.paragraph}>
              Laser Acne & Acne Scar Treatment uses targeted laser energy to:
            </p>
            <ul className={styles.treatmentGoalsList}>
              <li>Destroy acne-causing bacteria</li>
              <li>Reduce oil gland activity</li>
              <li>Control inflammation</li>
              <li>Stimulate collagen regeneration to repair scarred skin</li>
            </ul>
            <p className={styles.paragraph}>
              Different laser technologies are used based on whether the concern is active acne, scarring, or both.
            </p>
          </div>

          {/* How It Works */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How Laser Acne & Acne Scar Treatment Works</h2>
            <div className={styles.stepsList}>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Bacterial Destruction:</h3>
                <p className={styles.stepDescription}>
                  Laser energy targets Propionibacterium acnes, reducing breakouts.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Sebum Control:</h3>
                <p className={styles.stepDescription}>
                  Laser heat reduces overactive oil glands.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Collagen Stimulation:</h3>
                <p className={styles.stepDescription}>
                  Laser penetration activates fibroblasts to rebuild damaged skin.
                </p>
              </div>
              <div className={styles.stepItem}>
                <h3 className={styles.stepTitle}>Skin Remodeling:</h3>
                <p className={styles.stepDescription}>
                  Gradual smoothing of scars and improved texture over time.
                </p>
              </div>
            </div>
          </div>

          {/* Skin Concerns Treated */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skin Concerns Treated</h2>
            <p className={styles.paragraph}>
              This treatment effectively addresses:
            </p>
            <ul className={styles.concernsList}>
              <li>Active acne (mild to severe)</li>
              <li>Inflammatory acne</li>
              <li>Cystic acne (select cases)</li>
              <li>Acne scars</li>
              <li>Post-acne marks</li>
              <li>Enlarged pores</li>
              <li>Uneven skin texture</li>
            </ul>
          </div>

          {/* Types of Lasers */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Types of Lasers Used</h2>
            <div className={styles.typesGrid}>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Blue Light / Laser Therapy</h3>
                <ul className={styles.typeFeatures}>
                  <li>Targets acne-causing bacteria</li>
                  <li>Ideal for active acne</li>
                </ul>
              </div>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Q-Switched Nd:YAG Laser</h3>
                <ul className={styles.typeFeatures}>
                  <li>Treats acne marks and pigmentation</li>
                  <li>Safe for darker skin tones</li>
                </ul>
              </div>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Fractional Laser</h3>
                <ul className={styles.typeFeatures}>
                  <li>Treats deep acne scars</li>
                  <li>Stimulates collagen regeneration</li>
                </ul>
              </div>
              <div className={styles.typeCard}>
                <div className={styles.typeIcon}>🔹</div>
                <h3 className={styles.typeTitle}>Combination Laser Protocols</h3>
                <ul className={styles.typeFeatures}>
                  <li>Used for both acne control and scar reduction</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benefits of Laser Acne & Acne Scar Treatment</h2>
            <ul className={styles.benefitsList}>
              <li>Reduces active acne and future breakouts</li>
              <li>Improves acne scars and marks</li>
              <li>Shrinks enlarged pores</li>
              <li>Improves skin texture and smoothness</li>
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
              <li>Have persistent or recurring acne</li>
              <li>Suffer from acne scars or marks</li>
              <li>Want non-surgical skin correction</li>
              <li>Have uneven or rough skin texture</li>
            </ul>
            <div className={styles.notRecommended}>
              <strong>❌ Not suitable for:</strong>
              <ul>
                <li>Active skin infections</li>
                <li>Pregnancy (depending on laser type)</li>
                <li>Certain medical conditions (to be evaluated)</li>
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
                  <h3 className={styles.stepTitle}>Consultation & Skin Analysis</h3>
                  <p>Identification of acne type and scar depth.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Skin Preparation</h3>
                  <p>Cleansing and application of numbing cream if required.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Laser Application</h3>
                  <p>Laser energy delivered in controlled pulses.</p>
                </div>
              </div>
              <div className={styles.procedureStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Post-Treatment Care</h3>
                  <p>Application of soothing creams and sunscreen.</p>
                </div>
              </div>
            </div>
            <div className={styles.procedureTime}>
              <strong>⏱ Duration:</strong> 30–60 minutes
            </div>
          </div>

          {/* Pain & Comfort */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pain & Comfort Level</h2>
            <ul className={styles.comfortList}>
              <li>Mild heat or tingling sensation</li>
              <li>Well-tolerated by most patients</li>
              <li>Cooling systems ensure comfort</li>
            </ul>
          </div>

          {/* Recovery & Downtime */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recovery & Downtime</h2>
            <ul className={styles.recoveryList}>
              <li>Mild redness for 1–2 days</li>
              <li>Slight swelling in treated areas</li>
              <li>Skin may feel warm or tight</li>
              <li>Fractional laser may cause mild peeling</li>
            </ul>
          </div>

          {/* Sessions Required */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Number of Sessions Required</h2>
            <ul className={styles.sessionsList}>
              <li><strong>Active Acne:</strong> 4–6 sessions</li>
              <li><strong>Acne Scars:</strong> 4–8 sessions</li>
              <li><strong>Interval:</strong> 3–4 weeks</li>
              <li>Combination therapy may require additional sessions.</li>
            </ul>
          </div>

          {/* Results & Longevity */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Results & Longevity</h2>
            <ul className={styles.resultsList}>
              <li>Reduced acne breakouts within few sessions</li>
              <li>Progressive scar improvement over months</li>
              <li>Final results visible after collagen remodeling</li>
              <li>Long-term results with maintenance skincare</li>
            </ul>
          </div>

          {/* Pre & Post Treatment Care */}
          <div className={styles.careSection}>
            <div className={styles.careCard}>
              <h2 className={styles.careTitle}>Pre-Treatment Care</h2>
              <ul className={styles.careList}>
                <li>Avoid sun exposure</li>
                <li>Stop active skincare products (retinol, acids)</li>
                <li>Avoid waxing or threading before treatment</li>
                <li>Inform doctor of medications</li>
              </ul>
            </div>
            <div className={styles.careCard}>
              <h2 className={styles.careTitle}>Post-Treatment Care</h2>
              <ul className={styles.careList}>
                <li>Apply sunscreen daily</li>
                <li>Avoid heat, steam, and heavy workouts for 48 hours</li>
                <li>Use gentle skincare products</li>
                <li>Follow prescribed topical medications</li>
              </ul>
            </div>
          </div>

          {/* Safety & Side Effects */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Safety & Side Effects</h2>
            <p className={styles.paragraph}>
              Laser Acne & Acne Scar Treatment is FDA-approved and safe when performed by trained dermatologists.
            </p>
            <div className={styles.sideEffects}>
              <h3 className={styles.sideEffectsTitle}>Temporary Side Effects:</h3>
              <ul className={styles.sideEffectsList}>
                <li>Redness</li>
                <li>Mild swelling</li>
                <li>Sensitivity</li>
              </ul>
              <p className={styles.sideEffectsNote}>
                Severe side effects are rare.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Laser Acne Treatment vs Traditional Methods
            </h2>
            <div className={styles.comparisonTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Laser Treatment</div>
                <div className={styles.tableCell}>Creams & Medicines</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Targets bacteria directly</div>
                <div className={styles.tableCell}>Limited action</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Controls oil production</div>
                <div className={styles.tableCell}>Temporary relief</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Improves scars</div>
                <div className={styles.tableCell}>Scars remain</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Long-term results</div>
                <div className={styles.tableCell}>Recurrence common</div>
              </div>
            </div>
          </div>

          {/* Why Choose */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Why Choose Laser Acne & Acne Scar Treatment?</h2>
            <ul className={styles.whyChooseList}>
              <li>Advanced medical-grade technology</li>
              <li>Customized treatment protocols</li>
              <li>Safe for Indian skin types</li>
              <li>Clinically proven results</li>
            </ul>
          </div>

          {/* Conclusion */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Conclusion</h2>
            <p className={styles.paragraph}>
              Laser Acne & Acne Scar Treatment offers a comprehensive solution for individuals struggling with acne and its long-term effects. By addressing both active acne and underlying scarring, this advanced laser treatment delivers clearer, smoother, and healthier skin. With expert evaluation and consistent care, patients can achieve long-lasting results and renewed confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
