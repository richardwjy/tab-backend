const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().required().min(7),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
});

const updatePasswordSchema = Joi.object({
  id: Joi.number().integer().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
  confirm_password: Joi.ref("password"),
  updated_by: Joi.string().required(),
  updated_date: Joi.date().required(),
}).with("password", "confirm_password");

module.exports = { loginSchema, updatePasswordSchema };
