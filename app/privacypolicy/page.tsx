import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import PrivacyPolicyContent from "@/components/mainwebsite/privacy-policy-content";
import { generateStructuredData } from "@/utils/seo";

function PrivacyPolicyPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </>
  );
}

export default function PrivacyPolicyPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Privacy Policy - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/privacypolicy`,
    description: "Privacy Policy and Terms of Service for Siama beauty care services. Read our policies on data collection, usage, and refunds.",
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
        <PrivacyPolicyPageContent />
      </Suspense>
    </>
  );
}

