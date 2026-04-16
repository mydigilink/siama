import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  category: mongoose.Types.ObjectId;
  sub_category: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  image?: string;
  service_mode?: string;
  service_charge?: string;
  consult_charge?: string;
  estimate_time?: string;
  status?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  ratingAverage?: number;
  ratingNumber?: number;
  bestTreatment?: boolean;
  popularProduct?: boolean;
  tags?: mongoose.Types.ObjectId[];
  aboutUs?: string;
  benefits?: Array<{ benefits: string }>;
  images?: string[];
  postTreatmentCare?: Array<{ tips: string }>;
  slug?: string;
  created_at?: Date;
  updated_at?: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    sub_category: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    service_mode: { type: String },
    service_charge: { type: String },
    consult_charge: { type: String },
    estimate_time: { type: String },
    status: { type: Boolean, default: true },
    faq: [{
      question: { type: String },
      answer: { type: String }
    }],
    ratingAverage: { type: Number, default: 0 },
    ratingNumber: { type: Number, default: 0 },
    bestTreatment: { type: Boolean, default: false },
    popularProduct: { type: Boolean, default: false },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Condition' }],
    aboutUs: { type: String },
    benefits: [{
      benefits: { type: String }
    }],
    images: [{ type: String }],
    postTreatmentCare: [{
      tips: { type: String }
    }],
    slug: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'services' // Explicitly specify collection name
  }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);

