import Link from "next/link";
import { notFound } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  createdAt: string;
  excerpt?: string;
  tags?: string[];
  author?: {
    name: string;
  };
}

async function getBlogsByTag(tag: string): Promise<Blog[]> {
  const res = await fetch(
    `https://api.siama.in/api/v1/blogs?tag=${tag}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || json;
}

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  return {
    title: `Blogs tagged with "${tag}" | India Tell A Ma`,
    description: `Explore all blogs related to ${tag}.`,
  };
}

/* ================= Tag Page ================= */

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const blogs = await getBlogsByTag(tag);

  if (!blogs || blogs.length === 0) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/blogs" className="hover:text-blue-600">
          Blogs
        </Link>{" "}
        / <span className="text-gray-800 font-medium">Tag: {tag}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-2">
        Tag: {tag}
      </h1>

      <p className="text-gray-600 mb-10">
        Showing {blogs.length} posts
      </p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <Link href={`/blogs/${blog.slug}`}>
              <img
                src={
                  blog.featuredImage
                    ? `${blog.featuredImage}`
                    : "https://i.imgur.com/8Km9tLL.jpg"
                }
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            </Link>

            <div className="p-5">
              <Link href={`/blogs/${blog.slug}`}>
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {blog.title}
                </h2>
              </Link>

              <p className="text-sm text-gray-500 mb-3">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {blog.author && ` • By ${blog.author.name}`}
              </p>

              <Link
                href={`/blogs/${blog.slug}`}
                className="text-gray-600 font-medium text-sm hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}