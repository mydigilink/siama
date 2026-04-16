import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import ExperienceCentres from "@/components/mainwebsite/experience-centres";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function ExperienceCentrePage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Experience Centres - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/experience-centre`,
    description: "Visit our Siama experience centres across India. Find locations, ratings, services, and book appointments at our beauty care clinics.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <section className={styles.experienceSection}>
          <div className={styles.container}>
            <h2 className={styles.title}>
              Our Experience Centres
            </h2>
            <ExperienceCentres />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

