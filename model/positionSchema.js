const Joi = require('joi')

const newPositionSchema = Joi.object({
    position_name: Joi.string().required(),
    direct_report_id: Joi.number().integer(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    updated_by: Joi.string(),
    updated_date: Joi.date()
})

const updatePositionSchema = Joi.object({
    id: Joi.number().integer().required(),
    position_name: Joi.string().required(),
    direct_report_id: Joi.number().integer(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    updated_by: Joi.string().required(),
    updated_date: Joi.date().required()
})

module.exports = { newPositionSchema, updatePositionSchema }