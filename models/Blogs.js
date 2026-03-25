import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },

    featuredImage: { type: String, default: "" },

    categories: [{ type: String }],
    tags: [{ type: String }],

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },

    faqSchema: [faqSchema],

    author: {
      name: { type: String, default: "Admin" },
      avatar: { type: String, default: "" },
      bio: { type: String, default: "" },
    },

    readingTime: { type: Number, default: 5 },
    commentsCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isSticky: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);