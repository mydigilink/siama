"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";

const teamMembers = [
  {
    name: "Dr Nidhi Khandelwale",
    role: "Founder",
    image: "/img/assts/nidhi.jpeg",
    description:
      "Visionary behind Siama with strong clinical background.",
    details:
      "10+ years experience in dermatology and aesthetics. Leads innovation and treatment planning.",
  },
  {
    name: "Mr. Manoj Srivastava",
    role: "Co-Founder",
    image: "/img/assts/manoj2.jpeg",
    description:
      "Expert in business growth and marketing strategy.",
    details:
      "Specializes in scaling healthcare startups and strategic partnerships.",
  },
];

export default function TeamSection() {
  const [activeMember, setActiveMember] = useState<any | null>(null);

  return (
    <div className={styles.teamSection}>
      {teamMembers.map((member, index) => (
        <div key={index} className={styles.card}>
          
          {/* IMAGE */}
          <div className={styles.imageWrapper}>
            <Image
              src={member.image}
              alt={member.name}
              width={120}
              height={120}
              className={styles.profileImage}
            />
          </div>

          {/* CONTENT */}
          <div className={styles.content}>
            <h3>{member.name}</h3>
            <span className={styles.role}>{member.role}</span>
            <p className={styles.desc}>{member.description}</p>

            {/* BUTTON */}
            <button
              className={styles.btn}
              onClick={() => setActiveMember(member)}
            >
              View More
            </button>
          </div>
        </div>
      ))}

      {/* ✅ MODAL */}
      {activeMember && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveMember(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              className={styles.closeBtn}
              onClick={() => setActiveMember(null)}
            >
              ✕
            </button>

            {/* MODAL CONTENT */}
            <div className={styles.modalContent}>
              <Image
                src={activeMember.image}
                alt={activeMember.name}
                width={140}
                height={140}
                className={styles.modalImage}
              />

              <h2>{activeMember.name}</h2>
              <p className={styles.modalRole}>{activeMember.role}</p>

              <p className={styles.modalDesc}>
                {activeMember.details}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}