"use client";

import { useEffect, useState, use } from "react"; // Added use
import { useRouter } from "next/navigation";

export default function EditTreatmentPage({ params: paramsPromise }) {
  const router = useRouter();
  
  // 1. Unwrap params (Next.js 15 requirement)
  const params = use(paramsPromise);
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const res = await fetch(`/api/treatments/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setForm(data.treatment);
        } else {
          alert("Could not load treatment");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchTreatment();
  }, [params.id]);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/treatments/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          salePrice: Number(form.salePrice || 0),
          sessions: Number(form.sessions || 1),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/treatments");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error updating treatment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }

  if (!form) return <div className="container py-5 text-center">Treatment not found.</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Edit Treatment</h1>
        <button onClick={() => router.back()} className="btn btn-outline-secondary rounded-pill">
          Cancel
        </button>
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
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Slug */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Slug</label>
                <input
                  className="form-control rounded-3"
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
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>

              {/* Duration */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Duration</label>
                <input
                  className="form-control rounded-3"
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
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              {/* Short Description */}
              <div className="col-12">
                <label className="form-label fw-semibold">Short Description</label>
                <input
                  className="form-control rounded-3"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control rounded-3"
                  rows={5}
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

              <div className="col-12 mt-4">
                <button
                  className="btn btn-dark btn-lg w-100 rounded-pill"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-check-circle me-2"></i>
                  )}
                  Update Treatment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}