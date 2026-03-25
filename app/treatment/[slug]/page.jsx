"use client";

import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useParams } from "next/navigation";
import BreadcrumbSection from "@/components/Breadcrumb";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import TreatmentFAQ from "@/components/TreatmentFAQ";

export default function TreatmentDetailsPage() {
  const params = useParams();
  // Ensure slug is handled safely as a string
  const slug = params?.slug;

  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Prevent fetching if slug isn't available yet
    if (!slug) return;

    const fetchTreatment = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/treatments/slug/${slug}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch treatment");
        }

        setTreatment(data.treatment);
      } catch (err) {
        console.error("Treatment fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [slug]);

  // Memoize price calculation to avoid re-calculating on every render
  const finalPrice = useMemo(() => {
    if (!treatment) return 0;
    return treatment.salePrice > 0 ? treatment.salePrice : treatment.price;
  }, [treatment]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 mb-0">Loading treatment...</p>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4">
          {error || "Treatment not found"}
        </div>
        <Link href="/" className="btn btn-dark rounded-pill px-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <BreadcrumbSection
        title={treatment.title}
        items={[
          {
            label: treatment.gender === "men" ? "Men Treatments" : "Women Treatments",
            href: `/${treatment.gender}`,
          },
          {
            label: treatment.category?.replace(/-/g, " ") || "Category",
            href: `/category/${treatment.gender}/${treatment.category}`,
          },
          { label: treatment.title },
        ]}
      />

      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <img
                src={treatment.image || "/images/placeholder.jpg"}
                alt={treatment.title}
                className="img-fluid rounded-4 shadow-sm w-100"
                style={{ maxHeight: "550px", objectFit: "cover" }}
              />
            </div>

            <div className="col-lg-6">
              <span className="badge bg-light text-dark border mb-3 text-capitalize">
                {treatment.category?.replace(/-/g, " ")}
              </span>

              <h1 className="fw-bold mb-3">{treatment.title}</h1>
                <div className="mb-4">
                {treatment.salePrice > 0 ? (
                  <>
                    <span className="fs-2 fw-bold text-danger">₹{treatment.salePrice}</span>
                    <span className="text-muted text-decoration-line-through ms-2 fs-5">
                      ₹{treatment.price}
                    </span>
                  </>
                ) : (
                  <span className="fs-2 fw-bold">₹{treatment.price}</span>
                )}
              </div><p className="text-muted">{treatment.shortDescription}</p>

            

              <div className="row g-3 mb-4">
                <div className="col-sm-2">
                  <div className="border rounded-4 p-3">
                    <small className="text-muted d-block">Duration</small>
                    <strong>{treatment.duration || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="border rounded-4 p-3">
                    <small className="text-muted d-block">Sessions</small>
                    <strong>{treatment.sessions || 1}</strong>
                  </div>
                </div>
              </div>

           

              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-dark btn-lg rounded-pill px-4"
                  onClick={() =>
                    addToCart({
                      _id: treatment._id,
                      treatmentId: treatment._id,
                      title: treatment.title,
                      price: finalPrice,
                      image: treatment.image,
                      quantity: 1,
                    })
                  }
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
                <Link href="/cart" className="btn btn-outline-dark btn-lg rounded-pill px-4">
                  Go to Cart
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="mt-5">
                <h3 className="fw-bold mb-3">Treatment Details</h3>
                 
             <div dangerouslySetInnerHTML={{ __html: treatment.description }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-stars fs-2 mb-3 d-block"></i>
                <h5 className="fw-bold">Instant Glow</h5>
                <p className="text-muted mb-0">
                  Improves hydration and skin radiance instantly.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-shield-check fs-2 mb-3 d-block"></i>
                <h5 className="fw-bold">Safe Procedure</h5>
                <p className="text-muted mb-0">
                  Clinically safe and suitable for most skin types.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-clock-history fs-2 mb-3 d-block"></i>
                <h5 className="fw-bold">Quick Recovery</h5>
                <p className="text-muted mb-0">
                  Minimal downtime and quick return to routine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
         
          <div className="row g-4">
          <TreatmentFAQ />
          </div>
        </div>
      </section>
                  
    </>
  );
}