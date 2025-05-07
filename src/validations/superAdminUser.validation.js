import Joi from "joi";

export const superAdminUserValidator = (data) => {
  const user = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required(),
    role: Joi.string().valid("superadmin", "user"),
  });

  return user.validate(data);
};
