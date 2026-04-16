import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import ShippingDeliveryContent from "@/components/mainwebsite/shipping-delivery-content";
import { generateStructuredData } from "@/utils/seo";

export default function ShippingDeliveryPage() {
  const structuredData = generateStructuredData({
    type: "Organization",
    name: "Shipping and Delivery Policy - Siama",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://siama.com"}/shipping-delivery`,
    description: "Shipping and Delivery Policy for Siama beauty care services and products.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Header />
      <main className="main-content">
        <ShippingDeliveryContent />
      </main>
      <Footer />
    </>
  );
}

