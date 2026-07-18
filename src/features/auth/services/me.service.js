import connectDB from "@/lib/db";
import { findUserById } from "../repositories/me.repository";

export const meService = async (id) => {
  await connectDB();

  const user = await findUserById(id);

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};