"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/admin/siama/BlogForm";
import { getBlog, updateBlog } from "@/lib/blogService";

export default function EditBlog() {
  const { id }: any = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    getBlog(id).then((res) => setBlog(res.data));
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updateBlog(id, data);
    router.push("/admin/blogs");
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Edit Blog</h1>
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}