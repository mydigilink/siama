import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import HeroSlider from "@/components/mainwebsite/hero-slider";
import BadgeMarquee from "@/components/mainwebsite/BadgeMarquee";
import StatsStrip from "@/components/mainwebsite/StatsStrip";
import PersonalizedTreatments from "@/components/mainwebsite/personalized-treatments";
import BeautyTreatments from "@/components/mainwebsite/beauty-treatments";
import TopSellingDeals from "@/components/mainwebsite/top-selling-deals";
import BestTreatments from "@/components/mainwebsite/best-treatments";
import BeforeAfter from "@/components/mainwebsite/before-after";
import TestimonialVideo from "@/components/mainwebsite/testimonial-video";
import Testimonials from "@/components/mainwebsite/testimonials";
import Features from "@/components/mainwebsite/features";
import { generateStructuredData } from "@/utils/seo";
import OurTreatments from "@/components/mainwebsite/our-treatments";
import HotSellingProducts from "@/components/mainwebsite/newSections/HotSellingProducts";
import AboutSection from "@/components/mainwebsite/about-section";
import AboutSiama from "@/components/mainwebsite/newSections/AboutSiama";
import TestimonialSection from "@/components/mainwebsite/newSections/TestimonialSection";
import TestimonialVideoSection from "@/components/mainwebsite/newSections/TestimonialVideoSection";
import PartnerLogos from "@/components/mainwebsite/PartnerLogos";

export default function Home() {
  const structuredData = generateStructuredData({
    type: "WebSite",
    name: "Siama",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com",
    description: "Welcome to Siama - Your trusted platform",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <HeroSlider />
      
         <StatsStrip />  
            <HotSellingProducts />
            <AboutSiama  />
         <BadgeMarquee />  
         <PersonalizedTreatments />
        {/* <OurTreatments /> */}
        {/* <Features /> */}
        {/* <BeautyTreatments /> */}
        {/* <TopSellingDeals /> */}
       
        <BestTreatments />
        <BeforeAfter />
        {/* <TestimonialVideo /> */}
        <TestimonialVideoSection />
        <Testimonials />
        <PartnerLogos />
      </main>
      <Footer />
    </>
  );
}
