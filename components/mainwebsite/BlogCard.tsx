"use client";

import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  createdAt: string;
  author?: {
    name: string;
  };
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const blogUrl = `https://www.indiatellama.com/blogs/${blog.slug}`;

  return (
    <div className="col-md-4 mb-10">
      {/* Image Section */}
      <Link
        href={`/blogs/${blog.slug}`}
        className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <div className="h-48 relative">
          <img
            src={
              blog.featuredImage
                ? `https://api.siama.in${blog.featuredImage}`
                : "https://i.imgur.com/8Km9tLL.jpg"
            }
            alt={blog.title}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-3">
        <Link href={`/blogs/${blog.slug}`}>
          <h4 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-2">
            {blog.title}
          </h4>
        </Link>

        <p className="text-sm text-gray-500 mb-3">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          {blog.author && `By ${blog.author.name}`}
        </p>
      </div>

      {/* Read + Share Section */}
      <div className="flex justify-between items-center px-3 pb-4">
        <a
          href={blogUrl}
          className="text-blue-600 font-medium hover:underline"
        >
          More
        </a>

        <div className="flex gap-3 text-gray-500 text-sm">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`}
            target="_blank"
          >
            FB
          </a>

          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${blogUrl}`}
            target="_blank"
          >
            IN
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${blogUrl}`}
            target="_blank"
          >
            X
          </a>
        </div>
      </div>
    </div>
  );
}