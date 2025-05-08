import Joi from "joi";

export const categoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    description: Joi.string().trim().optional(),
  });
  return category.validate(data);
};
