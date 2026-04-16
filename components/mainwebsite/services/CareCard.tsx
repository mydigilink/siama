'use client';

import { useState } from 'react';
import styles from '@/app/services/[slug]/style.module.scss';

interface CareCardProps {
  title: string;
  items: Array<{ benefits?: string; tips?: string }>;
  itemKey: 'benefits' | 'tips';
  emptyMessage: string;
}

export default function CareCard({ title, items, itemKey, emptyMessage }: CareCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleItems = 3;
  const hasMoreItems = items.length > maxVisibleItems;
  const visibleItems = isExpanded ? items : items.slice(0, maxVisibleItems);

  if (items.length === 0) {
    return (
      <div className={styles.careCard}>
        <h3 className={styles.careCardTitle}>{title}</h3>
        <ul className={styles.careCardList}>
          <li className={styles.emptyList}>{emptyMessage}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={`col-md-6`}>
      <div className={styles.careCard}>
      <h3 className={styles.careCardTitle}>{title}</h3>
      <ul className={styles.careCardList}>
        {visibleItems.map((item, idx) => (
          <li key={idx} className={styles.careCardItem}>
            <span className={styles.careCardBullet}></span>
            <span>{item[itemKey]}</span>
          </li>
        ))}
        {hasMoreItems && (
          <li className={styles.readMoreItem}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.readMoreButton}
            >
              {isExpanded ? (
                <>
                  Read Less <span className={`${styles.dblArw} ${styles.dblArwLeft}`}></span>
                </>
              ) : (
                <>
                  Read More <span className={styles.dblArw}></span>
                </>
              )}
            </button>
          </li>
        )}
      </ul>
    </div>
    </div>
  );
}
