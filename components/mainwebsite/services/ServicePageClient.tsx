'use client';

import { useState, useEffect } from 'react';
import AddToCartModal from '@/components/mainwebsite/services/AddToCartModal';

interface ServicePageClientProps {
  service: {
    _id: string;
    name: string;
    service_charge?: number;
    consult_charge?: number;
    estimate_time?: string;
    image?: string;
  };
  children: React.ReactNode;
}

export default function ServicePageClient({ service, children }: ServicePageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add click event listener to hero button
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicked element or its parent is the hero add to cart button
      const button = target.closest('.hero-add-to-cart-trigger');
      if (button) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener('click', handleButtonClick);
    return () => document.removeEventListener('click', handleButtonClick);
  }, []);

  return (
    <>
      {children}
      
      {/* Add to Cart Modal */}
      <AddToCartModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
      />
    </>
  );
}
