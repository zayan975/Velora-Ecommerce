import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import {findUserByEmail,createUser,} from "../repositories/register.repository";

export const registerService = async ({ name, email, password }) => {
  // Connect Database
  await connectDB();

  // Check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};