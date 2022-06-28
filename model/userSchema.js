const Joi = require('joi')

const newUserSchema = Joi.object({
    username: Joi.string().required().min(7).max(100),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'id', 'co'] } }).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
    position_id: Joi.number().required(),
    confirm_password: Joi.ref('password'),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    updated_by: Joi.string(),
    updated_date: Joi.date()
}).with('password', 'confirm_password')

const updateUserSchema = Joi.object({
    id: Joi.number().integer().required(),
    username: Joi.string().required().min(7).max(100),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'id', 'co'] } }).required(),
    old_password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
    new_password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
    confirm_password: Joi.ref('new_password'),
    position_id: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    created_by: Joi.string().required(),
    created_date: Joi.date().required(),
    updated_by: Joi.string().required(),
    updated_date: Joi.date().required()
}).with('new_password', 'confirm_password')

module.exports = { newUserSchema, updateUserSchema }