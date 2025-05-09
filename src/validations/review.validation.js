import Joi from "joi";

export const reviewValidator = (data) => {
  const review = Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
  });

  return review.validate(data);
};
