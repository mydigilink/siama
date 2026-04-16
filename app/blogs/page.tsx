import Link from "next/link";

import Image from 'next/image';
import Header from '@/components/mainwebsite/header';
import Footer from '@/components/mainwebsite/footer';
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
  };
}

interface BlogResponse {
  status: string;
  results?: number;
  total?: number;
  data: Blog[];
}

async function getBlogs(): Promise<BlogResponse> {
  const res = await fetch(
    "https://api.siama.in/api/v1/blogs",
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch blogs");

  return res.json();
}

export async function generateMetadata() {
  return {
    title: "Travel Blogs | India Tell A Ma",
    description:
      "Explore latest travel guides, tips and stories across India and beyond.",
  };
}

export default async function BlogsPage() {
  const response = await getBlogs();
  const blogs = response.data || [];

  return (
    <>
      <Header />
    <div className="container mt-10 mx-auto px-4 py-10">

      {/* ================= Breadcrumb ================= */}
      <nav className="text-sm text-gray-500 mt-5 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>{" "}
        / <span className="text-gray-800 font-medium">Blogs</span>
      </nav>

      {/* ================= Page Title ================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
           Blogs
        </h1>

        <p className="text-gray-600">
          Showing {blogs.length} posts
        </p>
      </div>

      {/* ================= Blog Grid ================= */}
      <div className="row g-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
          <div
            key={blog._id}
            className=" bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 "
          >
            <Link href={`/blogs/${blog.slug}`}>
              <div className="h-48 overflow-hidden">
                <img
                  src={
                    blog.featuredImage
                      ? `${blog.featuredImage}`
                      : "https://i.imgur.com/8Km9tLL.jpg"
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="p-5">

              {/* Category */}
              {blog.category && (
                <p className="text-xs text-blue-600 font-medium uppercase mb-2">
                  {blog.category}
                </p>
              )}

              <Link href={`/blogs/${blog.slug}`}>
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {blog.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {blog.excerpt ||
                  blog.content?.replace(/<[^>]*>/g, "").slice(0, 120)}...
              </p>

              {/* Meta */}
              <div className="text-xs text-gray-500 mb-3">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {blog.author && ` • By ${blog.author.name}`}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/blogs/${blog.slug}`}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                Read More →
              </Link>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= Empty State ================= */}
      {blogs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No blogs found.
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}