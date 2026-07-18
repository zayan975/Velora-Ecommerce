import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { findUserByEmail } from "../repositories/login.repository";

export const loginService = async (email, password) => {
  await connectDB();

  const user = await findUserByEmail(email);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};