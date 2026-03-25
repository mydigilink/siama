import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["men", "women"],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "30 mins",
    },
    sessions: {
      type: Number,
      default: 1,
    },
    benefits: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Treatment ||
  mongoose.model("Treatment", treatmentSchema);
// import mongoose from "mongoose";

// const TreatmentSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     slug: { type: String, required: true, unique: true },
//     gender: { type: String, enum: ["men", "women"], required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     salePrice: { type: Number, default: 0 },
//     duration: { type: String, default: "" },
//     image: { type: String, default: "" },
//     shortDescription: { type: String, default: "" },
//     description: { type: String, default: "" },
//     sessions: { type: Number, default: 1 },
//     active: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Treatment ||
//   mongoose.model("Treatment", TreatmentSchema);

// import mongoose from "mongoose";

// const FaqSchema = new mongoose.Schema(
//   {
//     question: { type: String, trim: true },
//     answer: { type: String, trim: true },
//   },
//   { _id: false }
// );

// const TreatmentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     fullSlug: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       unique: true,
//     },

//     mainCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TreatmentCategory",
//       required: true,
//     },

//     subCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TreatmentCategory",
//       required: true,
//     },

//     mainCategorySlug: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },

//     subCategorySlug: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },

//     shortDescription: {
//       type: String,
//       default: "",
//     },

//     content: {
//       type: String,
//       default: "",
//     },

//     featuredImage: {
//       type: String,
//       default: "",
//     },

//     gallery: [
//       {
//         type: String,
//       },
//     ],

//     benefits: [
//       {
//         type: String,
//       },
//     ],

//     tags: [
//       {
//         type: String,
//       },
//     ],

//     faqSchema: [FaqSchema],

//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft",
//     },

//     order: {
//       type: Number,
//       default: 0,
//     },

//     seo: {
//       metaTitle: { type: String, default: "" },
//       metaDescription: { type: String, default: "" },
//       keywords: [{ type: String }],
//     },
//   },
//   { timestamps: true }
// );

// TreatmentSchema.index({ fullSlug: 1 }, { unique: true });
// TreatmentSchema.index({ mainCategorySlug: 1, subCategorySlug: 1, status: 1 });

// export default mongoose.models.Treatment ||
//   mongoose.model("Treatment", TreatmentSchema);