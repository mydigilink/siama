import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import AboutSection from "@/components/mainwebsite/about-section";
import Features from "@/components/mainwebsite/features";
import Testimonials from "@/components/mainwebsite/testimonials";
import BeforeAfter from "@/components/mainwebsite/before-after";
import { generateStructuredData } from "@/utils/seo";

export default function AboutPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "About Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/about`,
    description: "Learn about Siama - A premier beauty care service provider delivering quality services at your doorstep.",
  });

  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <AboutSection />
        <Features />
      </main>
      <Footer />
    </>
  );
}

