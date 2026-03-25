"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./JoditEditor";

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function BlogForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categories: [],
    tags: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
    author: {
      name: "Admin",
      avatar: "",
      bio: "",
    },
    faqSchema: [{ question: "", answer: "" }],
    readingTime: 5,
    isFeatured: false,
    isSticky: false,
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        faqSchema:
          initialData.faqSchema?.length > 0
            ? initialData.faqSchema
            : [{ question: "", answer: "" }],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "title" && !isEdit) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleSEOChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  const handleAuthorChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleSEOArrayChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  };

  const handleFAQChange = (index, key, value) => {
    const updated = [...form.faqSchema];
    updated[index][key] = value;

    setForm((prev) => ({
      ...prev,
      faqSchema: updated,
    }));
  };

  const addFAQ = () => {
    setForm((prev) => ({
      ...prev,
      faqSchema: [...prev.faqSchema, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index) => {
    const updated = form.faqSchema.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      faqSchema: updated.length ? updated : [{ question: "", answer: "" }],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        setForm((prev) => ({
          ...prev,
          featuredImage: result.url,
        }));
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (error) {
      alert("Upload failed");
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/blogs/${initialData._id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message);
        router.push("/admin/blogs");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Basic Info</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="border rounded-lg px-4 py-3"
            required
          />
        </div>

        <textarea
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full mt-4"
          rows={4}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Featured Image</h2>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p className="mt-3 text-blue-600">Uploading image...</p>}

        {form.featuredImage && (
          <div className="mt-4">
            <img
              src={form.featuredImage}
              alt="Featured"
              className="w-48 h-32 object-cover rounded-lg border"
            />
            <input
              type="text"
              value={form.featuredImage}
              onChange={(e) => handleChange("featuredImage", e.target.value)}
              className="border rounded-lg px-4 py-3 w-full mt-3"
            />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Content</h2>

        <RichTextEditor
          value={form.content}
          onChange={(val) => handleChange("content", val)}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Categories & Tags</h2>

        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={form.categories.join(", ")}
          onChange={(e) => handleArrayChange("categories", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full mb-4"
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags.join(", ")}
          onChange={(e) => handleArrayChange("tags", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">SEO</h2>

        <input
          type="text"
          placeholder="Meta Title"
          value={form.seo.metaTitle}
          onChange={(e) => handleSEOChange("metaTitle", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full mb-4"
        />

        <textarea
          placeholder="Meta Description"
          value={form.seo.metaDescription}
          onChange={(e) => handleSEOChange("metaDescription", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full mb-4"
          rows={4}
        />

        <input
          type="text"
          placeholder="SEO Keywords (comma separated)"
          value={form.seo.keywords.join(", ")}
          onChange={(e) => handleSEOArrayChange("keywords", e.target.value)}
          className="border rounded-lg px-4 py-3 w-full"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Author</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Author Name"
            value={form.author.name}
            onChange={(e) => handleAuthorChange("name", e.target.value)}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Author Avatar URL"
            value={form.author.avatar}
            onChange={(e) => handleAuthorChange("avatar", e.target.value)}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Author Bio"
            value={form.author.bio}
            onChange={(e) => handleAuthorChange("bio", e.target.value)}
            className="border rounded-lg px-4 py-3"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">FAQs</h2>

        {form.faqSchema.map((faq, index) => (
          <div key={index} className="border rounded-xl p-4 mb-4">
            <input
              type="text"
              placeholder="Question"
              value={faq.question}
              onChange={(e) => handleFAQChange(index, "question", e.target.value)}
              className="border rounded-lg px-4 py-3 w-full mb-3"
            />

            <textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
              className="border rounded-lg px-4 py-3 w-full"
              rows={3}
            />

            <button
              type="button"
              onClick={() => removeFAQ(index)}
              className="mt-3 text-red-500"
            >
              Remove FAQ
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFAQ}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add FAQ
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Publish Settings</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <input
            type="number"
            value={form.readingTime}
            onChange={(e) => handleChange("readingTime", Number(e.target.value))}
            className="border rounded-lg px-4 py-3"
            placeholder="Reading Time"
          />
        </div>

        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => handleChange("isFeatured", e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isSticky}
              onChange={(e) => handleChange("isSticky", e.target.checked)}
            />
            Sticky
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}