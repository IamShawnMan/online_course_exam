import Joi from "joi";

export const reviewUpdateValidator = (data) => {
  const review = Joi.object({
    rate: Joi.number().min(1).max(5).optional(),
    comment: Joi.string().optional(),
  });

  return review.validate(data);
};
