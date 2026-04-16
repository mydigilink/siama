import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import ContactForm from "@/components/mainwebsite/contact-form";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

export default function ContactPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Contact Us - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/contact`,
    description: "Get in touch with Siama beauty care services. Book an appointment or contact us for more information about our treatments.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <h2 className={styles.title}>
              Contact Us
            </h2>
            <div className={styles.formWrapper}>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

