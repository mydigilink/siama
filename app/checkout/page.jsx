"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BreadcrumbSection from "@/components/BreadcrumbSection";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getSubtotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    gender: "women",
    appointmentDate: "",
    timeSlot: "",
    concern: "",
    address: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = getSubtotal();
  const discount = subtotal > 10000 ? 1000 : 0;
  const consultationFee = cart.length > 0 ? 199 : 0;
  const total = subtotal - discount + consultationFee;

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage("Cart is empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: cart,
          subtotal,
          discount,
          consultationFee,
          total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        alert("Booking placed successfully!");
        router.push(`/admin/orders/${data.order._id}`);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to place booking");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <BreadcrumbSection title="Checkout" items={[{ label: "Checkout" }]} />
        <section className="py-5">
          <div className="container text-center">
            <h2 className="fw-bold mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Please add treatments before checkout.
            </p>
            <Link href="/women" className="btn btn-dark rounded-pill px-4">
              Explore Treatments
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BreadcrumbSection title="Checkout" items={[{ label: "Checkout" }]} />

      <section className="py-5 bg-light">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Form */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="fw-bold mb-4">Patient Details</h3>

                    {message && (
                      <div className="alert alert-danger rounded-4">
                        {message}
                      </div>
                    )}

                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Full Name</label>
                        <input
                          type="text"
                          name="customerName"
                          className="form-control form-control-lg rounded-4"
                          value={formData.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control form-control-lg rounded-4"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg rounded-4"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Gender</label>
                        <select
                          name="gender"
                          className="form-select form-select-lg rounded-4"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="women">Women</option>
                          <option value="men">Men</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Appointment Date</label>
                        <input
                          type="date"
                          name="appointmentDate"
                          className="form-control form-control-lg rounded-4"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Time Slot</label>
                        <select
                          name="timeSlot"
                          className="form-select form-select-lg rounded-4"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Concern / Message (Optional)
                        </label>
                        <textarea
                          name="concern"
                          rows="4"
                          className="form-control rounded-4"
                          value={formData.concern}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address (Optional)
                        </label>
                        <textarea
                          name="address"
                          rows="3"
                          className="form-control rounded-4"
                          value={formData.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold d-block mb-3">
                          Payment Method
                        </label>

                        <div className="d-flex flex-wrap gap-3">
                          <div className="form-check border rounded-4 px-4 py-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="cod"
                              value="cod"
                              checked={formData.paymentMethod === "cod"}
                              onChange={handleChange}
                            />
                            <label className="form-check-label ms-2" htmlFor="cod">
                              Pay at Clinic
                            </label>
                          </div>

                          <div className="form-check border rounded-4 px-4 py-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="online"
                              value="online"
                              checked={formData.paymentMethod === "online"}
                              onChange={handleChange}
                            />
                            <label className="form-check-label ms-2" htmlFor="online">
                              Online Payment
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Summary */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-4">Order Summary</h4>

                    <div className="d-flex flex-column gap-3 mb-4">
                      {cart.map((item) => (
                        <div
                          key={item.treatmentId}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="me-3">
                            <h6 className="mb-1 fw-semibold">{item.title}</h6>
                            <small className="text-muted">
                              Qty: {item.quantity}
                            </small>
                          </div>
                          <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Discount</span>
                      <span className="text-success">- ₹{discount}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Consultation Fee</span>
                      <span>₹{consultationFee}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold fs-5">Total</span>
                      <span className="fw-bold fs-4">₹{total}</span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 rounded-pill py-3 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? "Placing Booking..." : "Place Booking"}
                    </button>

                    <p className="text-muted small text-center mt-3 mb-0">
                      Your appointment will be confirmed by our clinic team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}