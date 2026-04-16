import Link from "next/link";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Script from "next/script";
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
import FBComments from "@/components/mainwebsite/FBComments";
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  createdAt: string;
  category?: string;
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  faqSchema?: {
    question: string;
    answer: string;
  }[];
}

async function getBlog(slug: string): Promise<Blog | null> {
  const res = await fetch(
    `https://api.siama.in/api/v1/blogs/slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data || json;
}

/* ================= SEO Metadata ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};

  return {
    title: blog.title,
    description:
      blog.excerpt ||
      blog.content?.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage
        ? [`https://api.siama.in${blog.featuredImage}`]
        : [],
    },
  };
}

/* ================= Detail Page ================= */

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();

  const blogUrl = `https://www.indiatellama.com/blogs/${blog.slug}`;
const faqStructuredData =
  blog.faqSchema && blog.faqSchema.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faqSchema.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (<>
  <Header /> 
  <Script
    strategy="lazyOnload"
    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0"
    crossOrigin="anonymous"
  /><div className="max-w-7xl mx-auto px-4 py-10">
      {/* ================= Breadcrumb ================= */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/blogs" className="hover:text-blue-600">
          Blogs
        </Link>{" "}
        / <span className="text-gray-800 font-medium">{blog.title}</span>
      </nav>

      {/* ================= Category ================= */}
      {blog.category && (
        <p className="text-sm text-blue-600 font-medium uppercase mb-3">
          {blog.category}
        </p>
      )}

      {/* ================= Title ================= */}
      <h1 className="text-4xl font-bold mb-4 leading-tight">
        {blog.title}
      </h1>

      {/* ================= Meta Info ================= */}
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>

        {blog.author && (
          <>
            <span>•</span>
            <span>By {blog.author.name}</span>
          </>
        )}
      </div>

      {/* ================= Featured Image ================= */}
      {blog.featuredImage && (
        <img
          src={`${blog.featuredImage}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-xl mb-8"
        />
      )}

      {/* ================= Blog Content ================= */}
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{
          __html: blog.content || "",
        }}
      />
{/* ================= FAQs ================= */}

{blog.faqSchema && blog.faqSchema.length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

    <div className="space-y-4">
      {blog.faqSchema.map((faq, i) => (
        <details
          key={i}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <summary className="cursor-pointer font-semibold text-lg">
            {faq.question}
          </summary>

          <p className="mt-3 text-gray-700">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  </div>
)}
<div id="fb-root"></div><div className="mt-12">
  <div
    className="fb-comments"
    data-href={blogUrl}
    data-width="100%"
    data-numposts="5"
  ></div>
</div>
<FBComments url={blogUrl} />
{}
      {/* ================= Tags ================= */}
     {/* ================= Tags ================= */}
{blog.tags && blog.tags.length > 0 && (
  <div className="mb-8">
    <h4 className="font-semibold mb-3">Tags:</h4>

    <div className="flex flex-wrap gap-2">
      {blog.tags.map((tag, i) => (
        <Link
          key={i}
          href={`/blogs/tag/${encodeURIComponent(tag)}`}
          className="text-xs bg-gray-100 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-full"
        >
          #{tag}
        </Link>
      ))}
    </div>
  </div>
)}

      {/* ================= Share Section ================= */}
     {/* ================= Share Section ================= */}
<div className="border-t pt-8 mt-12">
  <h4 className="font-semibold mb-4">Share this article</h4>

  <div className="flex gap-4">

    {/* Facebook */}
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-5 h-5"
      >
        <path d="M22 12a10 10 0 10-11.5 9.95v-7.05h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.4 2.9h-2.3v7.05A10 10 0 0022 12z"/>
      </svg>
    </a>

    {/* LinkedIn */}
    <a
      href={`https://www.linkedin.com/shareArticle?mini=true&url=${blogUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-blue-700 hover:bg-blue-800 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-5 h-5"
      >
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v15H.2V8zM8.4 8h4.4v2.1h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.3 3 5.3 6.8V23h-4.6v-7.4c0-1.8 0-4-2.4-4-2.4 0-2.8 1.8-2.8 3.8V23H8.4V8z"/>
      </svg>
    </a>

    {/* Twitter / X */}
    <a
      href={`https://twitter.com/intent/tweet?url=${blogUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-black hover:bg-gray-800 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-5 h-5"
      >
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.5 8.5 0 01-2.72 1.04A4.25 4.25 0 0016 4a4.26 4.26 0 00-4.25 4.25c0 .33.04.65.1.95A12.1 12.1 0 013 5.1a4.25 4.25 0 001.32 5.67 4.2 4.2 0 01-1.92-.53v.05a4.26 4.26 0 003.41 4.17 4.3 4.3 0 01-1.9.07 4.27 4.27 0 003.98 2.96A8.52 8.52 0 012 19.54a12.03 12.03 0 006.52 1.91c7.82 0 12.1-6.48 12.1-12.1v-.55A8.6 8.6 0 0022.46 6z"/>
      </svg>
    </a>

  </div>
</div>
{/* ================= Facebook Comments ================= */}
<div className="mt-12">
  <div
    className="fb-comments"
    data-href={blogUrl}
    data-width="100%"
    data-numposts="5"
  ></div>
</div>
{faqStructuredData && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqStructuredData),
    }}
  />
)}
    </div>
    <Footer />
    </>
  

  );
}