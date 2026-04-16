import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import ThankYouContent from "@/components/mainwebsite/thank-you-content";
import { generateStructuredData } from "@/utils/seo";

function ThankYouPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <ThankYouContent />
      </main>
      <Footer />
    </>
  );
}

export default function ThankYouPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Thank You - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/thankyou`,
    description: "Thank you for contacting Siama. We have received your message and will get back to you within 24 hours.",
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
        <ThankYouPageContent />
      </Suspense>
    </>
  );
}

