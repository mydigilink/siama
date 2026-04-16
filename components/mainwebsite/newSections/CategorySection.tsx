"use client";

import Link from "next/link";
import Image from "next/image";

type Category = {
  _id?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
};

type CategorySectionProps = {
  title: string;
  gender: string;
  categories?: Category[];
};

export default function CategorySection({
  title,
  gender,
  categories = [],
}: CategorySectionProps) {
  if (!categories.length) return null;

   return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">{title}</h2>
          <p className="text-muted">
            Explore premium {gender} treatments by category
          </p>
        </div>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden category-card">
                <img
                  src={category.image}
                  alt={category.name}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />

                <div className="card-body text-center p-4">
                  <h5 className="fw-bold mb-2">{category.name}</h5>
                  <p className="text-muted small mb-3">
                    {category.description}
                  </p>

                  <Link
                    href={`/category/${gender}/${category.slug}`}
                    className="btn btn-dark rounded-pill px-4"
                  >
                    View Treatments
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}