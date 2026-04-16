import { Suspense } from 'react';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import type { Metadata } from 'next';
import ConcernsContent from '@/components/mainwebsite/concerns/ConcernsContentold';

const SLUG_METADATA: Record<string, any> = {
  acne: {
    title: 'Acne Treatment - Concerns & Solutions | SIAMA',
    description: 'Best acne and pimple treatment with advanced dermatology solutions.',
    keywords: ['acne', 'pimples', 'skin treatment'],
  },
  'laser-hair': {
    title: 'Laser Hair Reduction - Concerns & Solutions | SIAMA',
    description: 'Safe laser hair removal for long-term results.',
    keywords: ['laser hair removal', 'hair reduction'],
  },
  'hair-treatment': {
    title: 'Hair Treatment - Concerns & Solutions | SIAMA',
    description: 'Hair fall and growth treatment with PRP and advanced solutions.',
    keywords: ['hair fall', 'PRP hair'],
  },
};

const DEFAULT_METADATA = {
  title: 'Concerns & Solutions | SIAMA',
  description: 'Explore skin, hair, and aesthetic treatments.',
  keywords: ['skin care', 'hair treatment'],
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}): Promise<Metadata> {
  const params = await searchParams; // ✅ important

  const slug = params?.slug;

  const meta =
    slug && SLUG_METADATA[slug]
      ? SLUG_METADATA[slug]
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

      <Suspense
        fallback={
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            Loading...
          </div>
        }
      >
        <ConcernsContent />
      </Suspense>

      <Footer />
    </div>
  );
}