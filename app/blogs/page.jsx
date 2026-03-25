"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

function formatDate(dateString) {
  if (!dateString) return "March 14, 2026";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState("");

  // Prevent duplicate first fetch in React Strict Mode (dev)
  const initialFetched = useRef(false);

  const fetchBlogs = async (pageNumber = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await fetch(`/api/blogs?page=${pageNumber}&limit=${limit}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();

      const newBlogs = data.data || [];

      setBlogs((prev) => (append ? [...prev, ...newBlogs] : newBlogs));
      setHasNextPage(data.hasNextPage ?? false);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (initialFetched.current) return;
    initialFetched.current = true;

    fetchBlogs(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!hasNextPage || loadingMore) return;
    fetchBlogs(page + 1, true);
  };

  return (
    <section className="blog-page">
      <div className="container px-3 px-md-4">
        <div className="blog-header text-center mt-2 mb-5">
          <span className="blog-subtitle">OUR BLOG</span>
          <h1 className="page-title">Latest Beauty & Skincare Insights</h1>
          <p className="page-desc">
            Discover expert skincare tips, treatment guides, beauty trends, and
            everything you need to glow with confidence.
          </p>
        </div>
    <Breadcrumb />
        {loading && blogs.length === 0 ? (
          <div className="text-center py-5">
            <p className="loading-text">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="error-text">{error}</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {blogs.map((blog) => {
                const excerpt =
                  blog.excerpt?.trim() ||
                  stripHtml(blog.content).slice(0, 115) + "...";

                const tags =
                  blog.tags?.length > 0
                    ? blog.tags
                    : ["PRP therapy for face", "PRP treatment", "PRP injection"];

                return (
                  <div className="col-md-6 col-lg-4 d-flex" key={blog._id}>
                    <article className="blog-card w-100">
                      <Link
                        href={`/blogs/${blog.slug || blog._id}`}
                        className="blog-image-wrap"
                      >
                        <Image
                          src={blog.featuredImage || "/placeholder.jpg"}
                          alt={blog.title}
                          width={700}
                          height={420}
                          className="blog-image"
                        />
                      </Link>

                      <div className="blog-content">
                        <h2 className="blog-title">
                          <Link href={`/blogs/${blog.slug || blog._id}`}>
                            {blog.title}
                          </Link>
                        </h2>

                        <p className="blog-excerpt">{excerpt}</p>

                        <div className="blog-meta">
                          {formatDate(blog.createdAt)} · By{" "}
                          {blog.author?.name || "Admin"}
                        </div>

                        <div className="blog-tags">
                          {tags.slice(0, 3).map((tag, index) => (
                            <span className="tag" key={index}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/blogs/${blog.slug || blog._id}`}
                          className="read-more"
                        >
                          Read More <span>→</span>
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            {hasNextPage && (
              <div className="load-more-wrap text-center mt-5">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {!hasNextPage && blogs.length > 0 && (
              <div className="text-center mt-4">
                <p className="end-text">You’ve reached the end.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
       
      `}</style>
    </section>
  );
}