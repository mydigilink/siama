import React from "react";
import styles from "./style.module.scss";

export default function ShippingDeliveryContent() {
  return (
    <section className={styles.shippingSection}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Shipping and Delivery - Siama</h1>
        
        <div className={styles.introSection}>
          <h2 className={styles.introTitle}>Our Objectives</h2>
          <ul className={styles.objectivesList}>
            <li>Provide a seamless and convenient experience for customers</li>
            <li>Ensure timely and reliable delivery of beauty services and products</li>
            <li>Maintain high-quality standards of services and products</li>
            <li>Increase customer satisfaction and loyalty</li>
          </ul>
        </div>

        <div className={styles.content}>
          <div className={styles.policySection}>
            <h2 className={styles.sectionTitle}>Shipping and Delivery Policy:</h2>
            <ul className={styles.policyList}>
              <li>
                <strong>Service Area:</strong> Siama will provide its services within a specific geographic area, which will be defined based on demand, logistics, and operational feasibility.
              </li>
              <li>
                <strong>Service Hours:</strong> Siama will operate from Monday to Sunday, from 10:00 AM to 9:00 PM.
              </li>
              <li>
                <strong>Service Schedule:</strong> Customers can book appointments online or by phone at least 24 hours in advance. Siama will provide a 1-hour time window for each appointment.
              </li>
              <li>
                <strong>Product Shipping:</strong> Siama will ship beauty products to customers&apos; homes or offices as part of its services.
              </li>
              <li>
                <strong>Delivery Logistics:</strong> Siama will use a fleet of vehicles equipped with GPS tracking systems to ensure efficient and timely delivery.
              </li>
              <li>
                <strong>Service Professionals:</strong> Siama will employ experienced and trained professionals who are responsible for delivering services and products.
              </li>
            </ul>
          </div>

          <div className={styles.policySection}>
            <h2 className={styles.sectionTitle}>Shipping and Delivery Process:</h2>
            <ul className={styles.policyList}>
              <li>
                <strong>Booking Confirmation:</strong> Once a customer books an appointment online or by phone, Siama will send a confirmation email with the appointment details.
              </li>
              <li>
                <strong>Pre-Appointment Preparation:</strong> Siama&apos;s service professionals will arrive at the customer&apos;s location at least 15 minutes prior to the scheduled appointment time to prepare for the service.
              </li>
              <li>
                <strong>Service Delivery:</strong> The service professional will deliver the scheduled service and product(s) to the customer&apos;s location.
              </li>
              <li>
                <strong>Product Handover:</strong> The service professional will hand over the product(s) to the customer after completing the service.
              </li>
              <li>
                <strong>Feedback Collection:</strong> Siama will collect feedback from customers after each service to ensure quality standards are met and identify areas for improvement.
              </li>
            </ul>
          </div>

          <div className={styles.policySection}>
            <h2 className={styles.sectionTitle}>Challenges and Mitigation Strategies:</h2>
            <ul className={styles.policyList}>
              <li>
                <strong>Traffic Congestion:</strong> Siama will use real-time traffic updates to plan routes and avoid congested areas.
              </li>
              <li>
                <strong>Weather Conditions:</strong> Siama will have a backup plan in place for adverse weather conditions (e.g., rain, extreme temperatures).
              </li>
              <li>
                <strong>Customer No-Shows:</strong> Siama will implement a no-show policy with penalties for repeated occurrences.
              </li>
              <li>
                <strong>Product Damage:</strong> Siama will use sturdy packaging materials and insurance coverage to protect products during shipping.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

