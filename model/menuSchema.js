const Joi = require("joi");

const newMenuSchema = Joi.object({
  menu_name: Joi.string().required(),
  form_id: Joi.number().required(),
  description: Joi.string(),
  menu_details: Joi.array()
    .items(
      Joi.object({
        controller_id: Joi.number().required(),
        created_by: Joi.string().required(),
        created_date: Joi.date().required(),
        updated_by: Joi.string(),
        updated_date: Joi.date(),
        is_active: Joi.string().max(1).required(),
      })
    )
    .required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref("start_date")),
  created_by: Joi.string().required(),
  created_date: Joi.date().required(),
  updated_by: Joi.string(),
  updated_date: Joi.date(),
});

const updateMenuSchema = Joi.object({
  id: Joi.number().required(),
  menu_name: Joi.string().required(),
  form_id: Joi.number().required(),
  description: Joi.string(),
  menu_details: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        menu_h_id: Joi.number().required(),
        controller_id: Joi.number().required(),
        created_by: Joi.string().required(),
        created_date: Joi.date().required(),
        updated_by: Joi.string(),
        updated_date: Joi.date(),
        is_active: Joi.string().max(1).required(),
      })
    )
    .required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref("start_date")),
  created_by: Joi.string(),
  created_date: Joi.date(),
  updated_by: Joi.string().required(),
  updated_date: Joi.date().required(),
});

module.exports = { newMenuSchema, updateMenuSchema };
