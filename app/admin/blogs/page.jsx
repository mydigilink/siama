"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;

    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      fetchBlogs();
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Blogs</h2>

        <Link
          href="/admin/blogs/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Create Blog
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-zinc-100">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Featured</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t">
                <td className="px-4 py-3">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">{blog.title}</td>
                <td className="px-4 py-3">{blog.slug}</td>
                <td className="px-4 py-3">{blog.status}</td>
                <td className="px-4 py-3">{blog.isFeatured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 flex gap-3">
                  <Link
                    href={`/admin/blogs/edit/${blog._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {blogs.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}