import type { Metadata } from "next";
import Script from "next/script";

import { Suspense } from "react";
import { generateSEOMetadata } from "@/utils/seo";
import { Marcellus,Overlock } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "./mainwebsite.css";
import { Providers } from "./providers";
import QuickChatButton from "@/components/mainwebsite/QuickChatButton";

const overlock = Overlock({
  weight: "400",
  subsets: ["latin"],
});
const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://siama.in";

export const metadata: Metadata = generateSEOMetadata({
  title: "Siama - Rediscover your natural radiance",
  description: "Begin your journey to radiant and healthy skin today. Expert beauty care services with certified dermatologists and advanced technology.",
  keywords: ["siama", "beauty", "skincare", "laser hair removal", "skin rejuvenation", "hair treatment", "beauty treatments"],
  canonicalUrl: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  siteName: "Siama",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${overlock.className} ${marcellus.className}`}>
    <head>
       {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8N046TDHSZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8N046TDHSZ');
          `}
        </Script></head>
      <body className={overlock.className}>
        <Providers>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-sm text-gray-500">Loading...</p></div>}>
            {children}
          </Suspense>
        </Providers>
        <QuickChatButton />
      </body>
    </html>
  );
}

