import React from "react";
import styles from "./style.module.scss";

export default function TermsContent() {
  return (
    <section className={styles.termsSection}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Terms and Conditions</h1>
        
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <p className={styles.paragraph}>
            Welcome to Siama, a professional beauty services provider. Throughout the site, the term &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to Siama.
          </p>

          <h2 className={styles.sectionTitle}>2. Definitions</h2>
          <ul className={styles.definitionList}>
            <li className={styles.definitionItem}>
              <strong>Company</strong> means Siama
            </li>
            <li className={styles.definitionItem}>
              <strong>Client</strong> means the individual or entity who has booked and paid for a beauty service.
            </li>
            <li className={styles.definitionItem}>
              <strong>Service</strong> means any beauty service provided by the Company, including but not limited to haircuts, color treatments, waxing, makeup applications, and nail enhancements.
            </li>
            <li className={styles.definitionItem}>
              <strong>Treatment</strong> means any specific beauty treatment or procedure performed by the Company, including but not limited to facials, massages, and chemical peels.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>3. Booking and Payment Terms</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              All bookings must be made in advance through our website or phone number.
            </li>
            <li className={styles.listItem}>
              A deposit is required to secure a booking, which will be deducted from the total cost of the service.
            </li>
            <li className={styles.listItem}>
              The balance of the payment must be made on the day of the service.
            </li>
            <li className={styles.listItem}>
              We accept all major credit cards and cash payments.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>5. Service Terms</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              The Company reserves the right to refuse any client whose behavior is deemed inappropriate or disruptive.
            </li>
            <li className={styles.listItem}>
              The Company reserves the right to modify or cancel any service at any time due to unforeseen circumstances.
            </li>
            <li className={styles.listItem}>
              Clients are responsible for providing accurate information about their medical history, allergies, and any sensitivities before receiving a treatment.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>6. Client Conduct</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              Clients are expected to arrive on time for their scheduled appointment.
            </li>
            <li className={styles.listItem}>
              Clients are expected to behave in a respectful manner towards our staff and other clients.
            </li>
            <li className={styles.listItem}>
              Clients are expected to follow all instructions provided by our staff during the service.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>7. Intellectual Property</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              All content on our website is owned by the Company and is protected by copyright laws.
            </li>
            <li className={styles.listItem}>
              Any unauthorized use of our content is strictly prohibited.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>8. Dispute Resolution</h2>
          <p className={styles.paragraph}>
            Any disputes arising from these Terms will be resolved through arbitration in accordance with the laws of [State/Country].
          </p>

          <h2 className={styles.sectionTitle}>9. Governing Law</h2>
          <p className={styles.paragraph}>
            These Terms will be governed by and construed in accordance with the laws of [State/Country].
          </p>

          <h2 className={styles.sectionTitle}>10. Entire Agreement</h2>
          <p className={styles.paragraph}>
            These Terms constitute the entire agreement between the parties and supersede all prior or contemporaneous agreements or understandings.
          </p>

          <h2 className={styles.sectionTitle}>11. Amendments</h2>
          <p className={styles.paragraph}>
            The Company reserves the right to modify these Terms at any time without notice.
          </p>

          <p className={styles.acknowledgment}>
            By booking a service with us, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>

          <p className={styles.footerNote}>
            Note: These terms and conditions should be reviewed and updated regularly to ensure compliance with changing laws and regulations.
          </p>
        </div>
      </div>
    </section>
  );
}

