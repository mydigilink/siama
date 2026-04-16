"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { useAuth } from "@/contexts/AuthContext";

type LeadStatus = "idle" | "loading" | "success" | "error";

const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || "";

export default function LeadCaptureForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      name: prev.name || user.name || "",
      phone: prev.phone || user.phone || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(`${PUBLIC_API_BASE}/lead-captures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setStatus("success");
      setFormData({ name: "", phone: "", email: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Unable to submit right now. Please try again.");
    }
  };

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        className={styles.formInput}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Mobile No"
        className={styles.formInput}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email (optional)"
        className={styles.formInput}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button
        type="submit"
        className={styles.bookButton}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Book Appointment"}
      </button>
      {status === "success" && (
        <p className={styles.successText}>Thank you! We will contact you soon.</p>
      )}
      {status === "error" && error && (
        <p className={styles.errorText}>{error}</p>
      )}
    </form>
  );
}

