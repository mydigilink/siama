import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import PRPTreatments from "@/components/mainwebsite/prp-treatments";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function PRPTreatmentPage() {
  const structuredData = generateStructuredData({
    type: "Product",
    name: "PRP Treatment - Platelet-Rich Plasma Therapy - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/treatments/prp-treatment`,
    description: "Professional PRP (Platelet-Rich Plasma) treatments at Siama for hair restoration and skin rejuvenation. Natural, safe, and effective therapy using your body's own healing power.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <section className={styles.treatmentsSection}>
          <div className={styles.container}>
            <h1 className={styles.title}>PRP Treatment</h1>
            <p className={styles.subtitle}>
              Platelet-Rich Plasma therapy for hair restoration and skin rejuvenation. 
              Natural, safe, and effective treatments using your body&apos;s own healing power.
            </p>
            <PRPTreatments />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

