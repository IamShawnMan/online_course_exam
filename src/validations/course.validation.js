import Joi from "joi";

export const courseValidator = (data) => {
  const course = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    author: Joi.string().required(),
  });

  return course.validate(data);
};
