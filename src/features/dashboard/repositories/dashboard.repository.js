// src/repositories/dashboard.repository.js
import Order from "@/models/Order";
import Product from "@/models/Product";

export const getOrderStats = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  return result[0] || { totalOrders: 0, totalRevenue: 0 };
};

export const getPendingOrdersCount = async () => {
  return Order.countDocuments({ orderStatus: "pending" });
};

export const getLowStockCount = async (threshold = 10) => {
  return Product.countDocuments({ stock: { $lte: threshold, $gt: 0 } });
};

export const getLowStockProducts = async (threshold = 10) => {
  return Product.find({ stock: { $lte: threshold } })
    .select("name stock images")
    .sort({ stock: 1 })
    .limit(10);
};

export const getRevenueOverview = async (days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getTopSellingProducts = async (limit = 5) => {
  return Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        image: { $first: "$items.image" },
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
  ]);
};

export const getRecentOrders = async (limit = 5) => {
  return Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("items total paymentStatus orderStatus createdAt shippingAddress");
};