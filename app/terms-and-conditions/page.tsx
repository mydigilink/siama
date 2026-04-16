import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import TermsContent from "@/components/mainwebsite/terms-content";
import { generateStructuredData } from "@/utils/seo";

export default function TermsAndConditionsPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Terms and Conditions - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/terms-and-conditions`,
    description: "Terms and Conditions for Siama beauty care services. Read our booking, payment, and service terms.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}

