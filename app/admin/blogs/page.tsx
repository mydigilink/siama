"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "@/lib/blogService";
import { useRouter } from "next/navigation";

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await getBlogs();
    setBlogs(res.data || []);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);

      // remove deleted blog from UI
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>

        <Link
          href="/admin/blogs/new"
          className="bg-black text-white px-4 py-2"
        >
          Create Blog
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.map((blog: any) => (
          <div
            key={blog._id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500">{blog.status}</p>
            </div>

            <div className="space-x-4">
              <Link
                href={`/admin/blogs/${blog._id}`}
                className="text-blue-600"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(blog._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}