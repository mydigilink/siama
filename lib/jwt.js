import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "siama_jwt_secret_8299881237";

export const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};