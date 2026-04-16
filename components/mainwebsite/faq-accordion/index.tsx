"use client";

import { useState } from "react";
import styles from "./style.module.scss";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${
            openIndex === index ? styles.accordionItemOpen : ""
          }`}
        >
          <button
            className={styles.accordionTitle}
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <svg
              className={styles.accordionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className={styles.accordionContent}>
            <div className={styles.accordionContentInner}>
              {typeof item.answer === "string" ? (
                <p>{item.answer}</p>
              ) : (
                item.answer
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

