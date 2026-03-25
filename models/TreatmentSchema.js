import mongoose from "mongoose";

const TreatmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["men", "women"], required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    image: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    sessions: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Treatment ||
  mongoose.model("Treatment", TreatmentSchema);