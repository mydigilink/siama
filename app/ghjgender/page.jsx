import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getSubCategories(gender) {
  const res = await fetch(
    `${SITE_URL}/api/treatment-categories?type=sub&parentSlug=${gender}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function GenderPage({ params }) {
  const { gender } = await params;

  if (!["women", "men"].includes(gender)) return notFound();

  const categories = await getSubCategories(gender);

  return (
    <section className="py-16">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8 capitalize">{gender} Treatments</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${gender}/${cat.slug}`}
              className="block rounded-2xl border p-6 hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{cat.name}</h2>
              <p className="text-gray-600">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}