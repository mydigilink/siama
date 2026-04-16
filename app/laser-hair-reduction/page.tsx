import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import PrivacyContent from "@/components/mainwebsite/privacy-content";
import { generateStructuredData } from "@/utils/seo";

export default function PrivacyPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Privacy Policy - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/privacy`,
    description: "Privacy Policy and Terms of Service for Siama beauty care services.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}

