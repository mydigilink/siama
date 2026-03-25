import mongoose from "mongoose";

const TreatmentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["main", "sub"],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatmentCategory",
      default: null,
    },
    parentSlug: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

TreatmentCategorySchema.index({ slug: 1, type: 1 }, { unique: false });

export default mongoose.models.TreatmentCategory ||
  mongoose.model("TreatmentCategory", TreatmentCategorySchema);