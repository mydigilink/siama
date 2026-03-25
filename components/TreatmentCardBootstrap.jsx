"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function TreatmentCardBootstrap({ treatment }) {
  // const addToCart = useCartStore((state) => state.addToCart);

  // const finalPrice =
  //   treatment.salePrice > 0 ? treatment.salePrice : treatment.price;
 const addToCart = useCartStore((state) => state.addToCart);

  const finalPrice =
    treatment.salePrice > 0 ? treatment.salePrice : treatment.price;

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden treatment-card">
        <img
          src={treatment.image || "/images/treatment-placeholder.jpg"}
          alt={treatment.title}
          className="card-img-top"
          style={{ height: "260px", objectFit: "cover" }}
        />

        <div className="card-body p-4 d-flex flex-column">
          <div className="mb-2">
            <span className="badge bg-light text-dark border">
              {treatment.category}
            </span>
          </div>

          <h5 className="fw-bold">{treatment.title}</h5>
          <p className="text-muted small">{treatment.shortDescription}</p>

          <div className="mb-3">
            <small className="text-secondary d-block">
              <i className="bi bi-clock me-2"></i>
              {treatment.duration}
            </small>
            <small className="text-secondary d-block">
              <i className="bi bi-person-badge me-2"></i>
              {treatment.gender}
            </small>
          </div>

          <div className="mb-3">
            {treatment.salePrice > 0 ? (
              <>
                <span className="fw-bold fs-5 text-danger">₹{treatment.salePrice}</span>
                <span className="text-muted text-decoration-line-through ms-2">
                  ₹{treatment.price}
                </span>
              </>
            ) : (
              <span className="fw-bold fs-5">₹{treatment.price}</span>
            )}
          </div>

          <div className="mt-auto d-flex gap-2">
            <button
              className="btn btn-dark flex-fill rounded-pill"
              onClick={() =>
                addToCart({
          treatmentId: treatment._id, // MUST be real MongoDB id
          title: treatment.title,
          price: finalPrice,
          image: treatment.image,
        })
      }        >
              Add to Cart
            </button>

            <Link
              href={`/treatments/${treatment.slug}`}
              className="btn btn-outline-dark flex-fill rounded-pill"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}