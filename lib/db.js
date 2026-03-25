import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/siama/adminjs";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI);
};