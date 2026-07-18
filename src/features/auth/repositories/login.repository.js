import User from "@/models/User";

export const findUserByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};