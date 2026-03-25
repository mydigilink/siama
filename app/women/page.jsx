import BreadcrumbSection from "@/components/BreadcrumbSection";
import CategorySection from "@/components/CategorySection";

export default function WomenPage() {
  const womenCategories = [
    {
      name: "Skin Care",
      slug: "skin-care",
      image: "/images/women-skin.jpg",
      description: "Hydrafacial, anti-aging, pigmentation, and glow care.",
    },
    {
      name: "Hair Care",
      slug: "hair-care",
      image: "/images/women-hair.jpg",
      description: "Hair fall control, PRP, keratin, and scalp care.",
    },
    {
      name: "Laser Treatments",
      slug: "laser-treatments",
      image: "/images/women-laser.jpg",
      description: "Laser hair reduction and advanced skin laser solutions.",
    },
    {
      name: "Slimming & Wellness",
      slug: "slimming-wellness",
      image: "/images/women-slimming.jpg",
      description: "Body contouring, slimming packages, and wellness care.",
    },
  ];

  return (
    <>
      <BreadcrumbSection
        title="Women Treatments"
        items={[{ label: "Women Treatments" }]}
      />

      <CategorySection
        title="Explore Women Categories"
        gender="women"
        categories={womenCategories}
      />
    </>
  );
}