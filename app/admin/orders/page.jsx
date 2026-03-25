"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "warning";
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Admin Orders</h2>
            <p className="text-muted mb-0">Manage all treatment bookings</p>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">No orders found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Slot</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <small className="fw-semibold">
                            #{order._id.slice(-6).toUpperCase()}
                          </small>
                        </td>
                        <td>{order.customerName}</td>
                        <td>{order.phone}</td>
                        <td>{order.appointmentDate}</td>
                        <td>{order.timeSlot}</td>
                        <td className="fw-bold">₹{order.total}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${getPaymentBadge(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="btn btn-sm btn-dark rounded-pill"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}