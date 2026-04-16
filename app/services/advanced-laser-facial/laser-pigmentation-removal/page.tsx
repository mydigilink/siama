import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import LaserPigmentationRemovalContent from "./index";
import { generateStructuredData } from "@/utils/seo";

function LaserPigmentationRemovalPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <LaserPigmentationRemovalContent />
      </main>
      <Footer />
    </>
  );
}

export default function LaserPigmentationRemovalPage() {
  const structuredData = generateStructuredData({
    type: "Product",
    name: "Laser Pigmentation Removal Treatment - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/treatments/advanced-laser-facial/laser-pigmentation-removal`,
    description: "Advanced Laser Pigmentation Removal treatment at Siama. Safely and effectively reduce unwanted pigmentation, dark spots, and uneven skin tone using precise laser technology.",
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
        <LaserPigmentationRemovalPageContent />
      </Suspense>
    </>
  );
}

