import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import TeamSection from "@/components/mainwebsite/team-section";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function TeamPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Our Team - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/team`,
    description: "Meet the talented team behind Siama - Dr. Nidhi Khandelwale and Mr. Manoj Srivastava, dedicated to bringing beauty care services to your doorstep.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="container main-content">
        <section className={styles.teamPageSection}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>Know Our Team</h1>
              <p className={styles.subtitle}>
                Meet the passionate individuals behind Siama who are dedicated to bringing you the best beauty care services
              </p>
            </div>
            <TeamSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

