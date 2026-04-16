"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/siama/BlogForm";

import { createBlog } from "@/lib/blogService";

export default function CreateBlog() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createBlog(data);
    router.push("/admin/blogs");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Create Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}