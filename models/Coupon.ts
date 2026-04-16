// /models/Coupon.ts

import mongoose, { Schema, model, models } from 'mongoose';

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'flat'], required: true },
    value: { type: Number, required: true },
    maxDiscount: Number,
    minCartValue: { type: Number, default: 0 },
    validTill: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Coupon || model('Coupon', CouponSchema);