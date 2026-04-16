import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import LaserSkinRejuvenationContent from "@/app/services/advanced-laser-facial/laser-skin-rejuvenation";
import { generateStructuredData } from "@/utils/seo";

export default function LaserSkinRejuvenationPage() {
  const structuredData = generateStructuredData({
    type: "Product",
    name: "Laser Skin Rejuvenation Treatment - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/treatments/laser-skin-rejuvenation`,
    description: "Advanced Laser Skin Rejuvenation treatment at Siama. Non-surgical cosmetic procedure to restore youthful, healthy, and radiant skin using state-of-the-art laser technology.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <LaserSkinRejuvenationContent />
      </main>
      <Footer />
    </>
  );
}

