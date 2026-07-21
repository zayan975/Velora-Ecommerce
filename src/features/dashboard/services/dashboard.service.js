// src/services/dashboard.service.js
import connectDB from "@/lib/db";
import {
  getOrderStats,
  getPendingOrdersCount,
  getLowStockCount,
  getLowStockProducts,
  getRevenueOverview,
  getTopSellingProducts,
  getRecentOrders,
} from "@/features/dashboard/repositories/dashboard.repository";

export const getDashboardOverviewService = async () => {
  await connectDB();

  const [
    orderStats,
    pendingOrders,
    lowStockCount,
    lowStockProducts,
    revenueOverview,
    topSellingProducts,
    recentOrders,
  ] = await Promise.all([
    getOrderStats(),
    getPendingOrdersCount(),
    getLowStockCount(),
    getLowStockProducts(),
    getRevenueOverview(7),
    getTopSellingProducts(5),
    getRecentOrders(5),
  ]);

  return {
    totalOrders: orderStats.totalOrders,
    totalRevenue: orderStats.totalRevenue,
    pendingOrders,
    lowStockCount,
    lowStockProducts,
    revenueOverview,
    topSellingProducts,
    recentOrders,
  };
};