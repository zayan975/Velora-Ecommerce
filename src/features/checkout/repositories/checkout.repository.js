import Cart from "@/models/Cart";

export const getPopulatedCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price stock"
  );
};