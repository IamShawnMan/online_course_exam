import bcrypt from "bcrypt";

export const encode = async (data) => {
  return await bcrypt.hash(data, 10);
};

export const decode = async (data, hashedPassword) => {
  return await bcrypt.compare(data, hashedPassword);
};
