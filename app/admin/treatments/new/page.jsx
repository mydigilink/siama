"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTreatmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    gender: "women",
    category: "",
    price: "",
    salePrice: "",
    duration: "",
    image: "",
    shortDescription: "",
    description: "",
    sessions: 1,
    active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm({ ...form, title, slug });
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          salePrice: Number(form.salePrice || 0),
          sessions: Number(form.sessions),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/treatments");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Add New Treatment</h1>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <form onSubmit={submit}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input
                  className="form-control rounded-3"
                  placeholder="e.g. Skin Hydration Therapy"
                  value={form.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              {/* Slug */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Slug</label>
                <input
                  className="form-control rounded-3"
                  placeholder="skin-hydration-therapy"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>

              {/* Gender */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Gender</label>
                <select
                  className="form-select rounded-3"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>

              {/* Category */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Category</label>
                <input
                  className="form-control rounded-3"
                  placeholder="e.g. Skin Care"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>

              {/* Duration */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Duration</label>
                <input
                  className="form-control rounded-3"
                  placeholder="e.g. 45 mins"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>

              {/* Price */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Base Price (₹)</label>
                <input
                  className="form-control rounded-3"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              {/* Sale Price */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Sale Price (₹)</label>
                <input
                  className="form-control rounded-3"
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                />
              </div>

              {/* Sessions */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Sessions</label>
                <input
                  className="form-control rounded-3"
                  type="number"
                  value={form.sessions}
                  onChange={(e) => setForm({ ...form, sessions: e.target.value })}
                />
              </div>

              {/* Image URL */}
              <div className="col-12">
                <label className="form-label fw-semibold">Image URL</label>
                <input
                  className="form-control rounded-3"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              {/* Short Description */}
              <div className="col-12">
                <label className="form-label fw-semibold">Short Description</label>
                <input
                  className="form-control rounded-3"
                  placeholder="Brief summary for list view..."
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </div>

              {/* Full Description */}
              <div className="col-12">
                <label className="form-label fw-semibold">Full Description</label>
                <textarea
                  className="form-control rounded-3"
                  rows={4}
                  placeholder="Detailed treatment information..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Status</label>
                <select
                  className="form-select rounded-3"
                  value={String(form.active)}
                  onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="col-12 mt-4">
                <button
                  className="btn btn-dark btn-lg w-100 rounded-pill shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-cloud-arrow-up me-2"></i>
                  )}
                  Save Treatment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}