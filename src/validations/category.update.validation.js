import Joi from "joi";

export const categoryUpdateValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().min(3).max(30).trim().optional(),
    description: Joi.string().trim().optional(),
  });
  return category.validate(data);
};
