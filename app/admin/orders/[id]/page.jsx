"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const updateStatus = async (payload) => {
    try {
      setUpdating(true);

      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        alert("Order updated successfully");
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">Loading order...</div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="py-5">
        <div className="container">Order not found.</div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <button
              className="btn btn-outline-dark rounded-pill mb-3"
              onClick={() => router.back()}
            >
              ← Back
            </button>
            <h2 className="fw-bold mb-1">Order Details</h2>
            <p className="text-muted mb-0">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Customer Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Customer Details</h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Name:</strong>
                    <div>{order.customerName}</div>
                  </div>

                  <div className="col-md-6">
                    <strong>Phone:</strong>
                    <div>{order.phone}</div>
                  </div>

                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <div>{order.email || "-"}</div>
                  </div>

                  <div className="col-md-6">
                    <strong>Gender:</strong>
                    <div className="text-capitalize">{order.gender}</div>
                  </div>

                  <div className="col-md-6">
                    <strong>Appointment Date:</strong>
                    <div>{order.appointmentDate}</div>
                  </div>

                  <div className="col-md-6">
                    <strong>Time Slot:</strong>
                    <div>{order.timeSlot}</div>
                  </div>

                  <div className="col-12">
                    <strong>Concern:</strong>
                    <div>{order.concern || "-"}</div>
                  </div>

                  <div className="col-12">
                    <strong>Address:</strong>
                    <div>{order.address || "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatments */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Booked Treatments</h4>

                <div className="d-flex flex-column gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex justify-content-between align-items-center border rounded-4 p-3 flex-wrap gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={
                            item.image ||
                            item.treatmentId?.image ||
                            "/images/treatment-placeholder.jpg"
                          }
                          alt={item.title}
                          width="70"
                          height="70"
                          className="rounded-3"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <h6 className="mb-1 fw-bold">{item.title}</h6>
                          <small className="text-muted">
                            Qty: {item.quantity}
                          </small>
                        </div>
                      </div>

                      <div className="fw-bold fs-5">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary / Status */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Discount</span>
                  <span className="text-success">- ₹{order.discount}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Consultation Fee</span>
                  <span>₹{order.consultationFee}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold fs-4">₹{order.total}</span>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Order Status</label>
                  <select
                    className="form-select rounded-4"
                    value={order.status}
                    onChange={(e) => updateStatus({ status: e.target.value })}
                    disabled={updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Payment Status</label>
                  <select
                    className="form-select rounded-4"
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updateStatus({ paymentStatus: e.target.value })
                    }
                    disabled={updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="small text-muted">
                  Created: {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}