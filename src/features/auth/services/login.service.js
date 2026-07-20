import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { findUserByEmail } from "../repositories/login.repository";

export const loginService = async (email, password) => {
  await connectDB();

  const user = await findUserByEmail(email);
  console.log("USER FOUND:", user); // <-- ye check karo

  if (!user) {
    console.log("No user found with this email");
    return null;
  }

  console.log("Password from form:", password);
  console.log("Hashed password from DB:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch); // <-- true/false

  if (!isMatch) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};