import Joi from "joi";

export const updateValidation = (data) => {
  const user = Joi.object({
    fullName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(5).max(30).optional(),
  });
  return user.validate(data);
};
