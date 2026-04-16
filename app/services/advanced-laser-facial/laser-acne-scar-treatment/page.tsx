import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import LaserAcneScarTreatmentContent from "./index";
import { generateStructuredData } from "@/utils/seo";

function LaserAcneScarTreatmentPageContent() {
  return (
    <>
      <Header />
      <main className="main-content">
        <LaserAcneScarTreatmentContent />
      </main>
      <Footer />
    </>
  );
}

export default function LaserAcneScarTreatmentPage() {
  const structuredData = generateStructuredData({
    type: "Product",
    name: "Laser Acne & Acne Scar Treatment - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/treatments/advanced-laser-facial/laser-acne-scar-treatment`,
    description: "Advanced Laser Acne & Acne Scar Treatment at Siama. Treat active acne, reduce inflammation, and visibly improve acne scars using medical-grade laser technology.",
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
        <LaserAcneScarTreatmentPageContent />
      </Suspense>
    </>
  );
}
