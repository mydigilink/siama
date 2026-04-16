'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/services/[slug]/style.module.scss';
import ContactForm from '@/components/mainwebsite/contact-form';

export default function ServiceHeroActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={styles.heroActions}>
        <button className={`${styles.heroAddToCartButton} hero-add-to-cart-trigger`} type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 3.33334H4.16667L6.40001 13.9917C6.47637 14.3753 6.68509 14.72 6.98975 14.9653C7.29441 15.2105 7.6752 15.3408 8.06667 15.3333H15.5C15.8915 15.3408 16.2723 15.2105 16.5769 14.9653C16.8816 14.72 17.0903 14.3753 17.1667 13.9917L18.3333 7.50001H5M8.33334 18.3333C8.33334 18.7936 7.96024 19.1667 7.50001 19.1667C7.03977 19.1667 6.66667 18.7936 6.66667 18.3333C6.66667 17.8731 7.03977 17.5 7.50001 17.5C7.96024 17.5 8.33334 17.8731 8.33334 18.3333ZM16.6667 18.3333C16.6667 18.7936 16.2936 19.1667 15.8333 19.1667C15.3731 19.1667 15 18.7936 15 18.3333C15 17.8731 15.3731 17.5 15.8333 17.5C16.2936 17.5 16.6667 17.8731 16.6667 18.3333Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add to Cart
        </button>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`about-btn btn-outline ${styles.heroSecondaryButton}`}
        >
          Book Consultation
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
          >
            <button
              className={styles.modalCloseButton}
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.modalHeader}>
              <h2 id="consultation-modal-title" className={styles.modalTitle}>
                Book Your Consultation
              </h2>
              <p className={styles.modalSubtitle}>
                Schedule your personalized treatment today
              </p>
            </div>

            <div className={styles.modalBody}>
              <ContactForm onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}