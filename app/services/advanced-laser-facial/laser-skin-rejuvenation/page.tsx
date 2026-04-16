import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import LaserSkinRejuvenationContent from "./index";
import { generateStructuredData } from "@/utils/seo";

function LaserSkinRejuvenationPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <LaserSkinRejuvenationContent />
      </main>
      <Footer />
    </>
  );
}

export default function LaserSkinRejuvenationPage() {
  const structuredData = generateStructuredData({
    type: "Product",
    name: "Laser Skin Rejuvenation Treatment - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/treatments/advanced-laser-facial/laser-skin-rejuvenation`,
    description: "Advanced Laser Skin Rejuvenation treatment at Siama. Non-surgical cosmetic procedure to restore youthful, healthy, and radiant skin using state-of-the-art laser technology.",
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
        <LaserSkinRejuvenationPageContent />
      </Suspense>
    </>
  );
}

