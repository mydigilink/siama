import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

const SITE_URL = process.env.HOST_URL || "http://localhost:3000/";

async function getBlog(slug) {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("BLOG FETCH ERROR:", error);
    return null;
  }
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
}

function getImageUrl(image) {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return image; // local image path already fine
}

/* ================= SEO Metadata ================= */

export async function generateMetadata({ params }) {
      const { slug } = await params; // ✅ await the params
   
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog could not be found.",
    };
  }

  const description =
    blog.excerpt || stripHtml(blog.content).slice(0, 160) || "Read our latest blog.";

  const imageUrl = getImageUrl(blog.featuredImage);
  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      type: "article",
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/* ================= Detail Page ================= */

export default async function BlogDetailPage({ params }) {
 const { slug } = await params; 
   const blog = await getBlog(slug);
const cleanHtml = (html) => {
  return html;
    // ?.replace(/ style="[^"]*"/g, "")
    // ?.replace(/ class="[^"]*"/g, "");
};
  if (!blog) return notFound();

  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const encodedBlogUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(blog.title);
  const imageUrl = getImageUrl(blog.featuredImage);

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

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || stripHtml(blog.content).slice(0, 160),
    image: imageUrl ? [imageUrl] : [],
    author: {
      "@type": "Person",
      name: blog.author?.name || "Admin",
    },
    publisher: {
      "@type": "Organization",
      name: "Siama",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    mainEntityOfPage: blogUrl,
  };

  return (
    <>
      {/* Facebook SDK */}
      <Script
        id="facebook-sdk"
        strategy="lazyOnload"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0"
        crossOrigin="anonymous"
      />

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
            <Breadcrumb />
        {/* <nav className="text-sm text-gray-500 mt-5 mb-2">
          <Link href="/" className=" text-gray-500 hover:text-blue-600">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blogs" className="text-gray-500 hover:text-blue-600">
            Blogs
          </Link>{" "}
          / <span className="text-gray-800 font-medium">{blog.title}</span>
        </nav> */}

        {/* Category */}
        {blog.category && (
          <p className="text-sm text-blue-600 font-medium uppercase mb-3">
            {blog.category}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight text-gray-900">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex  mb-4 flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>

          {blog.author?.name && (
            <>
              <span> - </span>
              <span>By {blog.author.name}</span>
            </>
          )}
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={blog.title}
            className=" w-full h-[260px] md:h-[500px] object-cover rounded-2xl mb-8"
          />
        )}

        {/* Blog Content */}
        <div
          className=" font-inherit text-inherit prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl mb-8"
          dangerouslySetInnerHTML={{
    __html: cleanHtml(blog.content || ""),
  }}
        />

        {/* FAQs */}
        {blog.faqSchema && blog.faqSchema.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {blog.faqSchema.map((faq, i) => (
                <details key={i} className="border rounded-xl p-4 bg-gray-50">
                  <summary className="cursor-pointer font-semibold text-lg">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-gray-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8 mt-10">
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

        {/* Share Section */}
        <div className="border-t pt-8 mt-12">
          <h4 className="font-semibold mb-4">Share this article</h4>

          <div className="flex gap-4 flex-wrap">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedBlogUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
              aria-label="Share on Facebook"
            >
              FB
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedBlogUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-700 hover:bg-blue-800 transition text-white rounded-full"
              aria-label="Share on LinkedIn"
            >
              IN
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedBlogUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-black hover:bg-gray-800 transition text-white rounded-full"
              aria-label="Share on X"
            >
              X
            </a>
          </div>
        </div>

        {/* Facebook Comments */}
        <div className="mt-12">
          <div
            className="fb-comments"
            data-href={blogUrl}
            data-width="100%"
            data-numposts="5"
          ></div>
        </div>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />

        {faqStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData),
            }}
          />
        )}
      </div>
    </>
  );
}