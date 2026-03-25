import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getTreatments(gender, category) {
  const res = await fetch(
    `${SITE_URL}/api/treatments?gender=${gender}&category=${category}&limit=50`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function CategoryPage({ params }) {
  const { gender, category } = await params;

  const treatments = await getTreatments(gender, category);

  if (!treatments.length) return notFound();

  return (
    <section className="py-16">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {category.replace(/-/g, " ")} for {gender}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {treatments.map((item) => (
            <Link
              key={item._id}
              href={`/${gender}/${category}/${item.slug}`}
              className="block rounded-2xl border overflow-hidden hover:shadow-xl transition"
            >
              {item.featuredImage && (
                <img
                  src={item.featuredImage}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600">{item.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}