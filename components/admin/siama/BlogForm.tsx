"use client";

import { useState } from "react";
import JoditCDNEditor from "./JoditCDNEditor";

export default function BlogForm({ initialData, onSubmit }: any) {

  const [form, setForm] = useState(
    initialData || {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categories: [],
      tags: [],
      readingTime: 5,
      commentsCount: 0,
      isFeatured: false,
      isSticky: false,
      status: "draft",

      author: {
        name: "",
        avatar: "",
        bio: "",
      },

      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },

      faqSchema: [{ question: "", answer: "" }]
    }
  );

  /* =========================
     HANDLE BASIC CHANGE
  ========================= */

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("author.")) {
      const key = name.split(".")[1];

      setForm((prev:any) => ({
        ...prev,
        author: { ...prev.author, [key]: value }
      }));

    } else if (name.startsWith("seo.")) {

      const key = name.split(".")[1];

      setForm((prev:any) => ({
        ...prev,
        seo: { ...prev.seo, [key]: value }
      }));

    } else if (type === "checkbox") {

      setForm((prev:any) => ({
        ...prev,
        [name]: checked
      }));

    } else {

      setForm((prev:any) => ({
        ...prev,
        [name]: value
      }));

    }
  };

  /* =========================
     ARRAY CHANGE
  ========================= */

  const handleArrayChange = (name: string, value: string) => {

    const arr = value.split(",").map((v) => v.trim());

    if (name.startsWith("seo.")) {

      const key = name.split(".")[1];

      setForm((prev:any) => ({
        ...prev,
        seo: { ...prev.seo, [key]: arr }
      }));

    } else {

      setForm((prev:any) => ({
        ...prev,
        [name]: arr
      }));

    }
  };

  /* =========================
     FAQ FUNCTIONS
  ========================= */

  const addFaq = () => {
    setForm((prev:any) => ({
      ...prev,
      faqSchema: [...prev.faqSchema, { question: "", answer: "" }]
    }));
  };

  const removeFaq = (index:number) => {

    setForm((prev:any) => {

      const updated = [...prev.faqSchema];
      updated.splice(index, 1);

      return { ...prev, faqSchema: updated };
    });
  };

  const updateFaq = (index:number, field:string, value:string) => {

    setForm((prev:any) => {

      const updated = [...prev.faqSchema];
      updated[index][field] = value;

      return { ...prev, faqSchema: updated };
    });
  };

  /* =========================
     FORM SUBMIT
  ========================= */

  const submitForm = (e:any) => {
    e.preventDefault();
    onSubmit(form);
  };

  /* =========================
     FORM UI
  ========================= */

  return (
    <form onSubmit={submitForm} className="space-y-6">

      {/* TITLE */}

      <div>
        <label className="font-semibold">Title</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>


      {/* FEATURED IMAGE */}

      <div>
        <label className="font-semibold">Featured Image URL</label>

        <input
          name="featuredImage"
          value={form.featuredImage}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>


      {/* EXCERPT */}

      <div>
        <label className="font-semibold">Excerpt</label>

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>


      {/* CONTENT EDITOR */}

      <div>

        <label className="font-semibold">Content</label>

        <JoditCDNEditor
          value={form.content}
          onChange={(value:string) =>
            setForm((prev:any) => ({
              ...prev,
              content: value
            }))
          }
        />

      </div>


      {/* AUTHOR */}

      <div className="border p-4 space-y-2">

        <h3 className="font-semibold">Author</h3>

        <input
          name="author.name"
          value={form.author.name}
          onChange={handleChange}
          placeholder="Author Name"
          className="w-full border p-2"
        />

        <input
          name="author.avatar"
          value={form.author.avatar}
          onChange={handleChange}
          placeholder="Author Avatar"
          className="w-full border p-2"
        />

        <textarea
          name="author.bio"
          value={form.author.bio}
          onChange={handleChange}
          placeholder="Author Bio"
          className="w-full border p-2"
        />

      </div>


      {/* CATEGORIES */}

      <div>

        <label className="font-semibold">Categories</label>

        <input
          value={form.categories.join(",")}
          onChange={(e) =>
            handleArrayChange("categories", e.target.value)
          }
          className="w-full border p-2"
        />

      </div>


      {/* TAGS */}

      <div>

        <label className="font-semibold">Tags</label>

        <input
          value={form.tags.join(",")}
          onChange={(e) =>
            handleArrayChange("tags", e.target.value)
          }
          className="w-full border p-2"
        />

      </div>


      {/* SEO */}

      <div className="border p-4 space-y-2">

        <h3 className="font-semibold">SEO</h3>

        <input
          name="seo.metaTitle"
          value={form.seo.metaTitle}
          onChange={handleChange}
          placeholder="Meta Title"
          className="w-full border p-2"
        />

        <textarea
          name="seo.metaDescription"
          value={form.seo.metaDescription}
          onChange={handleChange}
          placeholder="Meta Description"
          className="w-full border p-2"
        />

        <input
          value={form.seo.keywords.join(",")}
          onChange={(e) =>
            handleArrayChange("seo.keywords", e.target.value)
          }
          placeholder="SEO Keywords"
          className="w-full border p-2"
        />

      </div>


      {/* EXTRA */}

      <input
        type="number"
        name="readingTime"
        value={form.readingTime}
        onChange={handleChange}
        placeholder="Reading Time"
        className="w-full border p-2"
      />

      <input
        type="number"
        name="commentsCount"
        value={form.commentsCount}
        onChange={handleChange}
        placeholder="Comments Count"
        className="w-full border p-2"
      />


      {/* FAQ */}

      <div className="border p-4 space-y-4">

        <h3 className="font-semibold">FAQs</h3>

        {form.faqSchema.map((faq:any, i:number) => (

          <div key={i} className="border p-3 space-y-2">

            <input
              value={faq.question}
              placeholder="Question"
              onChange={(e) =>
                updateFaq(i,"question",e.target.value)
              }
              className="w-full border p-2"
            />

            <textarea
              value={faq.answer}
              placeholder="Answer"
              onChange={(e) =>
                updateFaq(i,"answer",e.target.value)
              }
              className="w-full border p-2"
            />

            <button
              type="button"
              onClick={() => removeFaq(i)}
              className="text-red-500"
            >
              Remove
            </button>

          </div>

        ))}

        <button
          type="button"
          onClick={addFaq}
          className="bg-gray-200 px-4 py-2"
        >
          Add FAQ
        </button>

      </div>


      {/* STATUS */}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>


      {/* FLAGS */}

      <label className="flex gap-2">

        <input
          type="checkbox"
          name="isFeatured"
          checked={form.isFeatured}
          onChange={handleChange}
        />

        Featured

      </label>

      <label className="flex gap-2">

        <input
          type="checkbox"
          name="isSticky"
          checked={form.isSticky}
          onChange={handleChange}
        />

        Sticky

      </label>


      <button className="bg-black text-white px-6 py-2">
        Save Blog
      </button>

    </form>
  );
}