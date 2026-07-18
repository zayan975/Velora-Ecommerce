import User from "@/models/User";

export const findUserById = async (id) => {
  return User.findById(id);
};