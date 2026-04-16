import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import Link from "next/link";
import { generateStructuredData } from "@/utils/seo";
import styles from "./style.module.scss";

interface SitemapSection {
  title: string;
  links: {
    name: string;
    url: string;
  }[];
}

const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    title: "Main Pages",
    links: [
      { name: "Home", url: "/" },
      { name: "About Us", url: "/about" },
      { name: "Contact Us", url: "/contact" },
      { name: "Experience Centres", url: "/experience-centre" },
      { name: "Our Team", url: "/team" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "All Services", url: "/services" },
      { name: "Laser Hair Reduction", url: "/services/laser-hair-reduction" },
      { name: "Skin Rejuvenation", url: "/services/skin-rejuvenation" },
      { name: "Hair Treatment", url: "/services/hair-treatment" },
      { name: "Advanced Laser Facial", url: "/services/advanced-laser-facial" },
      { name: "PRP Treatment", url: "/services/prp-treatment" },
      { name: "Chemical Peel", url: "/services/chemical-peel" },
    ],
  },
  {
    title: "Advanced Laser Facial Treatments",
    links: [
      { name: "Laser Skin Rejuvenation", url: "/services/advanced-laser-facial/laser-skin-rejuvenation" },
      { name: "Laser Pigmentation Removal", url: "/services/advanced-laser-facial/laser-pigmentation-removal" },
      { name: "Laser Acne & Acne Scar Treatment", url: "/services/advanced-laser-facial/laser-acne-scar-treatment" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { name: "Terms and Conditions", url: "/terms-and-conditions" },
      { name: "Privacy Policy", url: "/privacypolicy" },
      { name: "Shipping & Delivery", url: "/shipping-delivery" },
    ],
  },
  {
    title: "Other Pages",
    links: [
      { name: "FAQ", url: "/faq" },
      { name: "Thank You", url: "/thankyou" },
    ],
  },
];

function SitemapPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <section className={styles.sitemapSection}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>Sitemap</h1>
              <p className={styles.subtitle}>
                Navigate through all pages and services available on Siama. Find everything you need in one place.
              </p>
            </div>

            <div className={styles.sitemapGrid}>
              {SITEMAP_SECTIONS.map((section, index) => (
                <div key={index} className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <ul className={styles.linkList}>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className={styles.linkItem}>
                        <Link href={link.url} className={styles.link}>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function SitemapPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Sitemap - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/sitemap`,
    description: "Complete sitemap of Siama beauty care services website. Find all pages, treatments, and services.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Suspense
        fallback={
          <div className="main-content">
            <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-center min-h-[50vh]">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        }
      >
        <SitemapPageContent />
      </Suspense>
    </>
  );
}
