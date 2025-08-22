import admin from "../config/firebase.js";

export const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded; 
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
