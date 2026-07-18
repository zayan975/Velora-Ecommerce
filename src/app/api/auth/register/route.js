import { registerController } from "@/features/auth/controllers/register.controller";

export async function POST(req) {
  return registerController(req);
}