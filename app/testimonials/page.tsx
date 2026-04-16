import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import TestimonialsSection from "@/components/mainwebsite/testimonials-section";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function TestimonialsPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Customer Reviews - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/testimonials`,
    description: "Read what our customers say about Siama beauty care services. Real reviews and testimonials from satisfied clients.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <section className={styles.testimonialsSection}>
          <div className={styles.container}>
            <h2 className={styles.title}>
              Customer Reviews
            </h2>
            <TestimonialsSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

