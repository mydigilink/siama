"use client";
import Image from "next/image";
import styles from "./page.module.css";
import HeroBanner from "@/components/HeroBanner";
import FeatureMarquee from "@/components/FeatureMarquee";
import AboutSiama from "@/components/AboutSiama";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import HelpContact from "@/components/HelpContact";
import ResultsSection from "@/components/ResultsSection";
import WhyChoose from "@/components/WhyChoose";
import TestimonialSection from "@/components/TestimonialSection";
import BadgeMarquee from "@/components/BadgeMarquee";
import HotSellingProducts from "@/components/HotSellingProducts";
import dynamic from "next/dynamic";
import StatsStrip from "@/components/StatsStrip";
import TestimonialVideoSection from "@/components/TestimonialVideoSection";
import ExitIntentOfferPopup from "@/components/ExitIntentOfferPopup";

const FWPlayerEmbed = dynamic(() => import("@/components/FWPlayerEmbed"), {
  ssr: false,
});


export default function Home() {
  return (
    <div >
      <main>
        <HeroBanner />
   
      <FeatureMarquee />
           <StatsStrip />  
      <HotSellingProducts />
      <AboutSiama />
      <BadgeMarquee />
      <ServicesSection />
        <ResultsSection />
        {/* <WhyChoose /> */}
         <TestimonialSection />
         <TestimonialVideoSection />
<HelpContact />

    <ExitIntentOfferPopup />
      </main>
      {/* <FWPlayerEmbed /> */}
    </div>
  );
}
