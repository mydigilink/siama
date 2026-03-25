// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema(
//   {
//     treatmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Treatment",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       default: 1,
//     },
//     image: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: true } // keep default subdocument _id
// );

// const orderSchema = new mongoose.Schema(
//   {
//     customerName: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       default: "",
//     },
//     gender: {
//       type: String,
//       enum: ["men", "women"],
//       default: "women",
//     },
//     items: [orderItemSchema],
//     subtotal: Number,
//     discount: Number,
//     consultationFee: Number,
//     total: Number,
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "cancelled"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order || mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    treatmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
    couponCode: {
  type: String,
  default: "",
},
couponId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
  default: null,
},
couponType: {
  type: String,
  default: "",
},
couponValue: {
  type: Number,
  default: 0,
}
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["men", "women"],
      default: "women",
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);