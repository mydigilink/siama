import BreadcrumbSection from "@/components/Breadcrumb";
import CategorySection from "@/components/CategorySection";

export default function MenPage() {
  const menCategories = [
    {
      name: "Hair Treatments",
      slug: "hair-treatments",
      image: "/images/men-hair.jpg",
      description: "Advanced hair regrowth, PRP, and scalp treatments.",
    },
    {
      name: "Skin Treatments",
      slug: "skin-treatments",
      image: "/images/men-skin.jpg",
      description: "Facials, acne care, pigmentation, and glow treatments.",
    },
    {
      name: "Laser Treatments",
      slug: "laser-treatments",
      image: "/images/men-laser.jpg",
      description: "Laser hair reduction and advanced skin resurfacing.",
    },
    {
      name: "Beard & Grooming",
      slug: "beard-grooming",
      image: "/images/men-beard.jpg",
      description: "Premium grooming and beard enhancement treatments.",
    },
  ];

  return (
    <>
      <BreadcrumbSection
        title="Men Treatments"
        items={[{ label: "Men Treatments" }]}
      />

      <CategorySection
        title="Explore Men Categories"
        gender="men"
        categories={menCategories}
      />
    </>
  );
}