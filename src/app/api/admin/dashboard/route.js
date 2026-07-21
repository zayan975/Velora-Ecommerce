// src/app/api/admin/dashboard/route.js
import { requireAdmin } from "@/lib/getAuthUser";
import { getDashboardOverviewController } from "@/features/dashboard/controllers/dashboard.controller";

export async function GET() {
  const check = await requireAdmin();
  if (check.error) {
    return Response.json({ success: false, message: check.error }, { status: check.status });
  }
  return getDashboardOverviewController();
}