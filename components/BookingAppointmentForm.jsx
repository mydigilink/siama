"use client";

import { useState } from "react";

export default function BookingAppointmentForm() {
  const [formData, setFormData] = useState({
    category: "dentist",
    concern: "",
    name: "",
    mobile: "",
    date: "",
    timeSlot: "",
  });

  const [message, setMessage] = useState("");

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 10),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!formData.name.trim()) {
    setMessage("Please enter your name.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
    setMessage("Please enter a valid 10 digit mobile number.");
    return;
  }

  if (!formData.date) {
    setMessage("Please select appointment date.");
    return;
  }

  if (!formData.timeSlot) {
    setMessage("Please select a time slot.");
    return;
  }

  try {
    const res = await fetch("/api/appointment-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!data.success) {
      setMessage(data.message || "Failed to book appointment.");
      return;
    }

    setMessage("Appointment request submitted successfully!");

    setFormData({
      category: "dentist",
      concern: "",
      name: "",
      mobile: "",
      date: "",
      timeSlot: "",
    });
  } catch (error) {
    setMessage("Something went wrong. Please try again.");
  }
};
  const handleSubmit__ = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setMessage("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!formData.date) {
      setMessage("Please select appointment date.");
      return;
    }

    if (!formData.timeSlot) {
      setMessage("Please select a time slot.");
      return;
    }

    try {
      // Replace with your API
      // const res = await fetch("/api/appointment-booking", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();

      console.log("Appointment Data:", formData);

      setMessage("Appointment request submitted successfully!");

      setFormData({
        category: "dentist",
        concern: "",
        name: "",
        mobile: "",
        date: "",
        timeSlot: "",
      });
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="booking-section">
      <div className="container">
        <div className="booking-form-wrap">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="booking-card">
                <h2 className="booking-title text-center mb-4">
                  Book an Appointment
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Category */}
                    <div className="col-md-4">
                      <label className="form-label booking-label">
                        Select Category
                      </label>
                      <select
                        className="form-control booking-input"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="dentist">Dentist</option>
                        <option value="dermat">Dermat</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div className="col-md-8">
                      <label className="form-label booking-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control booking-input"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Mobile */}
                    <div className="col-md-4">
                      <label className="form-label booking-label">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control booking-input"
                        name="mobile"
                        placeholder="Enter 10 digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>

                    {/* Date */}
                    <div className="col-md-4">
                      <label className="form-label booking-label">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        className="form-control booking-input"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    {/* Time Slot */}
                    <div className="col-md-4">
                      <label className="form-label booking-label">
                        Select Time Slot
                      </label>
                      <select
                        className="form-control booking-input"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                      >
                        <option value="">Choose time slot</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Concern */}
                    <div className="col-12">
                      <label className="form-label booking-label">
                        Concern Message <span className="text-muted">(Optional)</span>
                      </label>
                      <textarea
                        className="form-control booking-textarea"
                        name="concern"
                        rows="4"
                        placeholder="Write your concern here..."
                        value={formData.concern}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    {/* Button */}
                    <div className="col-12">
                      <button type="submit" className=" booking-btn w-100">
                        Book Appointment
                      </button>
                    </div>

                    {/* Message */}
                    {message && (
                      <div className="col-12">
                        <p
                          className={`mb-0 mt-2 text-center ${
                            message.toLowerCase().includes("success")
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {message}
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}