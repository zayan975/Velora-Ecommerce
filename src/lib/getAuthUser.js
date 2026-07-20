// lib/getAuthUser.js
import { auth } from "@/auth"; // apne NextAuth config file ka exact path daalna

export const getAuthUser = async () => {
  const session = await auth();
  if (!session?.user) return null;
  return session.user.id; // jwt callback mein token.id set kiya hai, isliye session.user.id available hai
};
export async function GET() {
  const session = await auth();
  console.log("SESSION:", session);
  // ...
}