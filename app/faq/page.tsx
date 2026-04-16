import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import FAQAccordion from "@/components/mainwebsite/faq-accordion";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function FAQPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "FAQ - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/faq`,
    description: "Frequently Asked Questions about Siama beauty care services and treatments.",
  });

  const faqItems = [
    {
      question: "What Is The Standard Cost of Hydradermabrasion Treatment? test test",
      answer:
        "The Hydra Facial cost varies significantly because every treatment session is tailored to your needs. Your facial complexity and additional skincare solutions may also affect the price. Consult our treatment provider to learn about the HydraFacial price. Calculate the total cost based on the number of Hydra Facial appointments you have considered.",
    },
    {
      question: "Who Are Not the Right Candidates for HydraFacial?",
      answer: (
        <>
          <p className="mb-2">
            Our skincare experts think that the treatment is unsafe for those who have
          </p>
          <ul>
            <li>An active rash</li>
            <li>Sunburn</li>
            <li>Open wounds</li>
            <li>Highly sensitive skin</li>
          </ul>
          <p>
            You can avoid the skincare treatment if you take Accutane and other similar medications.
          </p>
        </>
      ),
    },
    {
      question:
        "When will I see results after having HydraFacial treatment in Delhi NCR?",
      answer:
        "You will notice visible results just after undergoing HydraFacial. Most people who have considered the treatment reported a youthful appearance of their skin. You will have an improved skin texture and tone. The facial treatment will make your skin more radiant after the initial session.",
    },
    {
      question:
        "Is there similarity between Microdermabrasion and Hydradermabrasion?",
      answer:
        "Although both are intended to treat your skin problems, they have some differences. The HydraFacial specialists will infuse your skin with restorative serum. You will have hydrated and replenished skin, as our experts will use pore extraction and chemical peeling techniques. A demerit of microdermabrasion is that it is not much gentle on your skin. So, look for Hydra Facial Treatment Doctors to get the desired solution.",
    },
    {
      question: "Can HydraFacial Make My Skin Tighter?",
      answer:
        "There are mixed views about the effectiveness of HydraFacial for skin tightening purposes. You can speak to our skincare professionals to learn about it in detail.",
    },
    {
      question: "Can I Do HydraFacial at Home?",
      answer:
        "Some people buy HydraFacial kits to get the remedy at their homes. They have to deep cleanse their skin and conduct a chemical exfoliation process. Hydration is essential for a natural glow. But, it is better to have the treatment under the expert's supervision. Call our dermatologists, and we will reach your home today.",
    },
    {
      question: "Where Will I Get The Best HydraFacial Treatment Near Me?",
      answer:
        "Siama has a team of dermatologists to provide services at your home. There is no need to visit a HydraFacial Treatment Clinic to get a personalized solution for your skin issues. Our skincare providers will diagnose your dermal problems before providing the treatment. We ensure affordable Hydra Facial Treatment Cost in Noida without compromising the treatment quality.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.title}>
              Frequently Asked Questions (FAQs)
            </h2>
            <div className={styles.accordionWrapper}>
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

