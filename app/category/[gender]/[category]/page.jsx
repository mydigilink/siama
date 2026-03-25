import BreadcrumbSection from "@/components/Breadcrumb";
import TreatmentGridBootstrap from "@/components/TreatmentGridBootstrap";

async function getTreatments(gender, category) {
  // Replace with real API later
  const dummyTreatments = [
    {
      _id: "1",
      title: "Hydra Facial",
      slug: "hydra-facial",
      gender: "women",
      category: "skin-care",
      price: 3500,
      salePrice: 2999,
      duration: "45 mins",
      image: "/images/hydrafacial.jpg",
      shortDescription: "Deep cleansing, hydration and instant glow facial.",
    },
    {
      _id: "2",
      title: "Laser Hair Reduction",
      slug: "laser-hair-reduction",
      gender: "women",
      category: "skin-care",
      price: 5000,
      salePrice: 4500,
      duration: "60 mins",
      image: "/images/laser.jpg",
      shortDescription: "Safe and effective laser hair reduction treatment.",
    },
    {
      _id: "3",
      title: "Anti Acne Peel",
      slug: "anti-acne-peel",
      gender: "women",
      category: "skin-care",
      price: 2500,
      salePrice: 0,
      duration: "30 mins",
      image: "/images/acne-peel.jpg",
      shortDescription: "Medical-grade peel for acne and oil control.",
    },
  ];

  return dummyTreatments.filter(
    (item) => item.gender === gender && item.category === category
  );
}

export default async function CategoryPage({ params }) {
  const { gender, category } = await params;
  const treatments = await getTreatments(gender, category);

  const formattedCategory = category.replace(/-/g, " ");

  return (
    <>
      <BreadcrumbSection
        title={formattedCategory}
        items={[
          {
            label: gender === "men" ? "Men Treatments" : "Women Treatments",
            href: `/${gender}`,
          },
          { label: formattedCategory },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container text-center mb-4">
          <h2 className="fw-bold text-capitalize">{formattedCategory}</h2>
          <p className="text-muted">
            Explore all treatments available under this category
          </p>
        </div>
      </section>

      <TreatmentGridBootstrap treatments={treatments} />
    </>
  );
}