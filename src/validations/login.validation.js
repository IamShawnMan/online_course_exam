import Joi from "joi";

export const loginValidate = (data) => {
  const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required(),
  });

  return login.validate(data);
};
