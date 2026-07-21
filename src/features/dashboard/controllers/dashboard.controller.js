// src/controllers/dashboardController.js
import { NextResponse } from "next/server";
import { getDashboardOverviewService } from "@/features/dashboard/services/dashboard.service";

export const getDashboardOverviewController = async () => {
  try {
    const data = await getDashboardOverviewService();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};