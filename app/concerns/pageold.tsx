import { Suspense } from 'react';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import type { Metadata } from 'next';
import ConcernsContent from '@/components/mainwebsite/concerns/ConcernsContentold';

const SUB_CATEGORY_METADATA: Record<string, { title: string; description: string; keywords: string[] }> = {
  '66545d890c42d4097a3533f1': {
    title: 'Laser Hair Reduction - Concerns & Solutions | SIAMA',
    description: 'Expert laser hair reduction treatments. US FDA-approved technology, safe for all skin types. Long-term hair reduction with minimal discomfort.',
    keywords: ['laser hair reduction', 'laser hair removal', 'hair removal', 'SIAMA', 'skin care', 'unwanted hair'],
  },
  '66545f2e0c42d4097a35cea0': {
    title: 'Hair Treatment - Concerns & Solutions | SIAMA',
    description: 'Professional hair treatments for growth, thinning, and scalp health. PRP, mesotherapy, and advanced therapies at SIAMA.',
    keywords: ['hair treatment', 'hair fall', 'PRP hair', 'hair growth', 'SIAMA', 'scalp treatment'],
  },
  '66545f740c42d4097a35e9ee': {
    title: 'Skin Rejuvenation - Concerns & Solutions | SIAMA',
    description: 'Revitalise your skin with our rejuvenation treatments. Advanced facials, polishing, and glow treatments for all skin types.',
    keywords: ['skin rejuvenation', 'skin glow', 'facial', 'body polishing', 'SIAMA', 'skin care'],
  },
  '66545fb40c42d4097a36035b': {
    title: 'Advance Laser Facial - Concerns & Solutions | SIAMA',
    description: 'Advanced laser facials for acne, pigmentation, and anti-ageing. Hydraboost, collagen infusion, and FDA-approved technology.',
    keywords: ['laser facial', 'hydraboost', 'collagen facial', 'acne treatment', 'SIAMA', 'skin rejuvenation'],
  },
  '681e29785ccfa5802f5195b3': {
    title: 'Dental Sathi - Concerns & Solutions | SIAMA',
    description: 'Dental care and aesthetic solutions. Teeth veneers, aligners, and expert dental treatments at SIAMA.',
    keywords: ['dental', 'teeth veneers', 'teeth aligner', 'Dental Sathi', 'SIAMA', 'dental care'],
  },
  '681f7c575ccfa5802f52d47e': {
    title: 'Chemical Peel - Concerns & Solutions | SIAMA',
    description: 'Chemical peel treatments for clearer, smoother skin. Glycolic peel and professional peels for pigmentation and texture.',
    keywords: ['chemical peel', 'glycolic peel', 'skin peel', 'pigmentation', 'SIAMA', 'skin treatment'],
  },
  '6820cf635ccfa5802f535d3f': {
    title: 'Glutathione - Concerns & Solutions | SIAMA',
    description: 'Glutathione treatments for skin brightening and even tone. Safe, professional treatments at SIAMA.',
    keywords: ['glutathione', 'skin brightening', 'glow', 'SIAMA', 'skin care', 'fairness'],
  },
  '6820cf835ccfa5802f5361c0': {
    title: 'Body Slimming - Concerns & Solutions | SIAMA',
    description: 'Body slimming and contouring treatments. Non-invasive solutions for a toned, slimmer appearance at SIAMA.',
    keywords: ['body slimming', 'weight loss', 'body contouring', 'SIAMA', 'slimming treatment'],
  },
};

const DEFAULT_METADATA = {
  title: 'Concerns & Solutions - Unwanted Body Hair | SIAMA',
  description: 'Expert laser hair removal solutions for unwanted body hair. US FDA-approved technology, safe for all skin types. Learn about treatments, results, and aftercare.',
  keywords: ['concerns', 'laser hair removal', 'unwanted body hair', 'SIAMA', 'skin care', 'hair reduction'],
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ subCategory?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const subCategory = params?.subCategory;
  const meta = subCategory && SUB_CATEGORY_METADATA[subCategory]
    ? SUB_CATEGORY_METADATA[subCategory]
    : DEFAULT_METADATA;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default function ConcernsPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading...</div>}>
        <ConcernsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
