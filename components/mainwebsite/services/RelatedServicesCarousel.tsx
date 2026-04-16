'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { PublicService } from '@/utils/api/public';

interface Props {
  services: PublicService[];
}

export default function RelatedServicesCarousel({ services }: Props) {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  useEffect(() => {
    const onResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1280) setItemsPerSlide(3);
      else if (window.innerWidth >= 768) setItemsPerSlide(2);
      else setItemsPerSlide(1);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const slides = useMemo(() => {
    const chunks: PublicService[][] = [];
    for (let i = 0; i < services.length; i += itemsPerSlide) {
      chunks.push(services.slice(i, i + itemsPerSlide));
    }
    return chunks;
  }, [services, itemsPerSlide]);

  // Clamp index when slides change
  useEffect(() => {
    if (slides.length === 0) return;
    setIndex((i) => Math.min(i, slides.length - 1));
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // Get color for icon based on service name
  const getIconColor = (name: string) => {
    const firstChar = name?.charAt(0)?.toUpperCase() || 'S';
    const colors = [
      { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
      { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
      { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700' },
      { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
      { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700' },
      { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
    ];
    const index = firstChar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!services.length || slides.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((group, slideIdx) => (
            <div
              key={slideIdx}
              className="w-full flex-shrink-0 grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-5 p-5"
            >
              {group.map((svc) => {
                const iconColor = getIconColor(svc.name || '');
                return (
                  <Link
                    key={svc._id}
                    href={`/services/${svc.slug || svc._id}`}
                    className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
                  >
                    <div className="relative space-y-4">
                      {/* Header: Icon, Title, Price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`h-14 w-14 rounded-full ${iconColor.bg} ${iconColor.border} border-2 flex items-center justify-center ${iconColor.text} font-bold text-lg shadow-sm flex-shrink-0`}>
                            {svc.name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-bold text-gray-900 leading-tight truncate group-hover:text-amber-600 transition-colors">
                              {svc.name}
                            </h4>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-md flex flex-col items-center justify-center text-white">
                            <span className="text-sm font-bold leading-tight">
                              {svc.service_charge ? `₹${svc.service_charge}` : '—'}
                            </span>
                            <span className="text-[9px] font-semibold leading-tight opacity-95">package</span>
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="font-semibold text-gray-600">Sub-Category</span>
                          <span className="text-gray-900 font-medium text-right">
                            {typeof svc.sub_category === 'object' ? (svc.sub_category as any)?.name || '—' : '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="font-semibold text-gray-600">Duration</span>
                          <span className="text-gray-900 font-medium text-right">{svc.estimate_time || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="font-semibold text-gray-600">Consult</span>
                          <span className="text-gray-900 font-medium text-right">
                            {svc.consult_charge ? `₹${svc.consult_charge}` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Badges: Best, Popular */}
                      {(svc.bestTreatment || svc.popularProduct) && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {svc.bestTreatment && (
                            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                              Best Treatment
                            </span>
                          )}
                          {svc.popularProduct && (
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                              Popular
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {svc.tags && svc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {svc.tags.slice(0, 2).map((t, idx) => {
                            const name = typeof t === 'string' ? t : (t as any)?.name || (t as any)?._id || '';
                            if (!name) return null;
                            return (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium"
                              >
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-gray-300 shadow-lg flex items-center justify-center hover:bg-white hover:border-amber-400 hover:shadow-xl transition-all z-10 group"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-gray-300 shadow-lg flex items-center justify-center hover:bg-white hover:border-amber-400 hover:shadow-xl transition-all z-10 group"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index 
                  ? 'bg-blue-600 w-8 shadow-md' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


