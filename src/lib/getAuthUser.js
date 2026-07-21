// lib/getAuthUser.js
import { auth } from "@/auth"; // apne NextAuth config file ka exact path daalna

export const getAuthUser = async () => {
  const session = await auth();
  if (!session?.user) return null;
  return session.user.id; // jwt callback mein token.id set kiya hai, isliye session.user.id available hai
};

  export const requireAdmin = async () => {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }
  if (session.user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }
  return { userId: session.user.id };
};