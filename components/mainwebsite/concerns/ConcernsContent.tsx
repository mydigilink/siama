"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ConcernsServicesWidget, { CONCERNS_SUB_CATEGORIES } from "./ConcernsServicesWidget";
import styles from "./style.module.scss";

export default function ConcernsContent() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: "1",
      title: "Preparation",
      description: "The treatment area is cleaned, marked, and shaved to prepare the skin.",
    },
    {
      number: "2",
      title: "Protection",
      description: "A cooling or ECG gel is applied to protect the skin and enhance comfort.",
    },
    {
      number: "3",
      title: "Treatment",
      description: "Controlled laser energy targets the hair follicles, reducing future hair growth.",
    },
    {
      number: "4",
      title: "Aftercare",
      description: "A soothing sunscreen or post-laser calming product is applied to protect the skin.",
    },
  ];

  const benefits = [
    "Managing unwanted facial and body hair",
    "Reducing ingrown hair and razor bumps",
    "Minimising skin irritation caused by shaving or waxing",
    "Addressing hormonal hair growth, including PCOS-related concerns",
    "Treating tanned or pigmented skin with advanced, new-age laser technology",
    "Supporting brides and individuals seeking long-term grooming solutions",
    "Offering a time-saving, low-maintenance alternative to traditional hair removal methods",
  ];

  const avoidReasons = [
    "Grey or white hair, as laser technology requires pigment to effectively target hair follicles",
    "Pregnancy or breastfeeding, as a precautionary safety measure",
    "Active skin conditions such as eczema or psoriasis in the treatment area",
    "Use of photosensitive medications, including isotretinoin (Accutane), which can increase skin sensitivity",
  ];

  const preTreatment = [
    "Keep the skin hydrated in the days before treatment",
    "Avoid sun exposure, tanning beds, or self-tanning products for at least 7 days",
    "Inform your dermatologist about medications or existing skin conditions",
    "Do not apply makeup, lotions, deodorants, or creams on the treatment area on the day of the session",
  ];

  const postTreatment = [
    "Apply a cold compress or ice wrapped in a dry cloth for 5–10 minutes to soothe discomfort and reduce swelling; repeat as needed",
    "Use lukewarm water only while bathing or washing the face; avoid hot water to prevent irritation",
    "Apply a gentle, fragrance-free, hydrating moisturiser to keep the skin calm",
    "Use a broad-spectrum SPF 30+ sunscreen daily to protect treated skin",
    "Avoid direct sun exposure, saunas, steam rooms, hot baths, and hot showers for at least 24–48 hours",
    "Refrain from intense workouts or activities that cause sweating for a minimum of 24 hours",
    "Avoid tanning lotions or self-tanning products for several days",
    "Do not use perfumed or fragranced lotions on the treated area for 48 hours",
    "Avoid body scrubs, exfoliants, or loofahs for at least 48 hours",
    "Do not scratch, pick, or apply pressure to the treated area while healing",
    "Avoid swimming (pools, sea, or hot tubs) for 48 hours",
    "Postpone cosmetic or aesthetic treatments on the treated area for up to two weeks",
    "Avoid waxing, plucking, threading, or depilatory creams between sessions; shaving is permitted",
    "Follow the recommended session schedule, usually spaced 4–6 weeks apart, for best long-term results",
  ];

  const whyChoose = [
    "US FDA-approved laser technology",
    "Safe and effective for all skin types",
    "Experienced skincare professionals",
    "Personalised treatment plans",
    "Hygienic, clinic-grade environment",
  ];

  const faqs = [
    {
      question: "Is laser hair removal safe for all skin types?",
      answer: "Yes. At Siama, we use US FDA-approved laser technology that is designed to be safe and effective for all skin types, including pigmented and sensitive skin, when performed by trained professionals.",
    },
    {
      question: "Is laser hair removal painful?",
      answer: "Laser hair removal is generally well tolerated. You may feel a mild warmth or tingling sensation during the procedure. Cooling gels and advanced laser systems help minimise discomfort, making the treatment comfortable for most patients.",
    },
    {
      question: "How many laser hair removal sessions are needed to see results?",
      answer: "Most individuals start noticing visible hair reduction after 6–8 sessions. For best results, sessions are spaced 4–6 weeks apart to align with the natural hair growth cycle. Up to 80%–90% long-term hair reduction can be achieved over time.",
    },
    {
      question: "Who should avoid laser hair removal?",
      answer: "Laser hair removal may not be suitable if you have grey or white hair, are pregnant or breastfeeding, have active skin conditions like eczema or psoriasis in the treatment area, or are taking photosensitive medications such as isotretinoin (Accutane).",
    },
    {
      question: "What precautions should I take before and after laser hair removal?",
      answer: "Before treatment, avoid sun exposure, keep the skin hydrated, and do not apply creams or makeup on the treatment area. After treatment, protect the skin with SPF 30+ sunscreen, avoid heat, sweating, swimming, and exfoliation for 24–48 hours, and follow the recommended aftercare guidelines for optimal results.",
    },
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const subCategoryId = searchParams.get("subCategory");
  const activeTab = CONCERNS_SUB_CATEGORIES.find((t) => t.id === subCategoryId);
  const heroTitle = activeTab
    ? `Concern/Issues - ${activeTab.label}`
    : "Concern/Issues - Unwanted Body Hair";

  return (
    <div className={styles.concernsPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroDescription}>
            Advanced laser hair removal solutions for smooth, hair-free skin
          </p>
        </div>
      </section>
      {/* Main Content */}
      <div className={styles.contentWrapper}>
        {/* Introduction */}
        <section className={styles.section}>
          <div className={styles.container}>
            <p className={styles.text}>
              Unwanted body hair on the face, arms, legs, underarms, or intimate areas is a common concern for both men and women. Traditional hair removal methods such as shaving, waxing, and threading provide temporary results and often lead to skin irritation, razor bumps, or ingrown hair. Laser hair removal is a clinically proven solution that offers long-term hair reduction with smoother, healthier-looking skin. You can opt for laser hair removal based on your needs—whether full body hair removal or treatment for specific areas such as Full Face Laser Hair Reduction, Upper Body Laser Hair Reduction, Lower Body Laser Hair Reduction, Underarms Laser Hair Reduction, and Bikini Area Laser Hair Reduction, among others.
            </p>
            <p className={styles.text}>
              At Siama, we provide advanced laser hair reduction treatments using US FDA-approved laser technology. Our procedures are safe, comfortable, and suitable for all skin types, including pigmented and sensitive skin.
            </p>
          </div>
        </section>

        {/* What is Laser Hair Removal */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What is Laser hair removal?</h2>
            <p className={styles.text}>
              Laser hair reduction is an advanced cosmetic treatment that uses focused beams of light to weaken and disable hair follicles. By targeting the pigment in the hair, the laser damages the follicle at its root, slowing down future growth and making hair progressively finer and lighter over time.
            </p>
            <p className={styles.text}>
              Hair grows in three stages — growth, transition, and resting. The laser works only when the hair is in the active growth phase, which is why the treatment is done in multiple sessions. After each session, treated hair sheds naturally, and with every visit, fewer follicles remain active, leading to smoother, clearer skin.
            </p>
          </div>
        </section>
        {/* Services by concern widget - data changes when tabs change */}
        <Suspense fallback={<div className={styles.widgetFallback}>Loading services...</div>}>
          <ConcernsServicesWidget />
        </Suspense>
        {/* How It Works */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How Laser Hair Removal Works</h2>
            <div className={styles.stepsGrid}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`${styles.stepCard} ${activeStep === index ? styles.stepCardActive : ""}`}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={styles.stepNumber}>{step.number}</div>
                  <h3 className={styles.stepTitle}>Step {step.number}:</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results & Sessions */}
        <section className={styles.sectionGray}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Laser Hair Removal Results & Sessions</h2>
            <div className={styles.resultsList}>
              <div className={styles.resultItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Noticeable hair reduction after 6–8 sessions</span>
              </div>
              <div className={styles.resultItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Up to 80%–90% permanent hair reduction over time</span>
              </div>
              <div className={styles.resultItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Sessions are spaced according to the natural hair growth cycle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Opt */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Opt for Laser Hair Removal?</h2>
            <p className={styles.text}>
              Laser hair removal is an effective solution for individuals looking for long-term hair reduction and smoother skin. It is especially beneficial for:
            </p>
            <ul className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <li key={index} className={styles.benefitItem}>
                  <svg className={styles.bulletIcon} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* When to Avoid */}
        <section className={styles.sectionWarning}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>When to Avoid Laser Hair Removal</h2>
            <p className={styles.text}>
              Laser hair removal may not be suitable in the following situations:
            </p>
            <ul className={styles.warningList}>
              {avoidReasons.map((reason, index) => (
                <li key={index} className={styles.warningItem}>
                  <svg className={styles.warningIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pre-Treatment Care */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Pre-Treatment Care for Laser Hair Removal</h2>
            <ul className={styles.careList}>
              {preTreatment.map((item, index) => (
                <li key={index} className={styles.careItem}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Post-Treatment Care */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Post-Treatment Care After Laser Hair Removal</h2>
            <ul className={styles.careList}>
              {postTreatment.map((item, index) => (
                <li key={index} className={styles.careItem}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why Choose Siama */}
        <section className={styles.sectionHighlight}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose Siama for Laser Hair Removal?</h2>
            <div className={styles.chooseGrid}>
              {whyChoose.map((item, index) => (
                <div key={index} className={styles.chooseCard}>
                  <svg className={styles.chooseIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>FAQs</h2>
            <div className={styles.faqContainer}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button
                    className={`${styles.faqQuestion} ${openFaqIndex === index ? styles.faqQuestionOpen : ""}`}
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span>{index + 1}. {faq.question}</span>
                    <svg
                      className={`${styles.faqIcon} ${openFaqIndex === index ? styles.faqIconOpen : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaqIndex === index && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
