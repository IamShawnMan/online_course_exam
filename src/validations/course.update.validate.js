import Joi from "joi";

export const courseUpdateValidator = (data) => {
  const course = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().optional(),
    author: Joi.string().optional(),
  });

  return course.validate(data);
};
