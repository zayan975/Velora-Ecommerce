import { meController } from "@/features/auth/controllers/me.controller";

export async function GET() {
  return meController();
}