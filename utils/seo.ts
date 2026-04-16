import { Metadata } from "next";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
}

/**
 * Generate comprehensive SEO metadata for Next.js pages
 * @param props - SEO configuration options
 * @returns Metadata object for Next.js
 */
export function generateSEOMetadata(props: SEOProps = {}): Metadata {
  const {
    title = "Siama - Main Website",
    description = "Welcome to Siama - Your trusted platform",
    keywords = [],
    canonicalUrl,
    ogImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    noindex = false,
    nofollow = false,
    author,
    publishedTime,
    modifiedTime,
    siteName = "Siama",
    locale = "en_US",
  } = props;

  const fullTitle = title.includes("Siama") ? title : `${title} | Siama`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://siama.in";
  const imageUrl = ogImage || `${siteUrl}/opengraph-image`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: siteName,
    icons: {
      icon: "https://www.siama.in/favicon.ico",
      shortcut: "https://www.siama.in/favicon.ico",
      apple: "https://www.siama.in/favicon.ico",
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: ogType as any,
      locale,
      url: canonicalUrl || siteUrl,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl || siteUrl,
    },
    metadataBase: new URL(siteUrl),
  };

  return metadata;
}

/**
 * Generate structured data (JSON-LD) for better SEO
 * @param props - Structured data configuration
 * @returns JSON-LD script content
 */
export function generateStructuredData(props: {
  type?: "WebSite" | "Organization" | "Article" | "Product";
  name?: string;
  url?: string;
  description?: string;
  logo?: string;
  [key: string]: any;
}): string {
  const {
    type = "WebSite",
    name = "Siama",
    url = process.env.NEXT_PUBLIC_SITE_URL || "https://siama.in",
    description = "Welcome to Siama",
    logo = `${url}/logo.png`,
    ...rest
  } = props;

  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    url,
    description,
    logo,
    ...rest,
  };

  return JSON.stringify(baseStructure);
}

