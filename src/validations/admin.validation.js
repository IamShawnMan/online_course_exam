import Joi from "joi";

export const adminValidation = (data) => {
  const admin = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required(),
  });
  return admin.validate(data);
};
