import Joi from 'joi';
import { generalFields } from '../../midlleware/validation.js';

//register vlidation
export const registerSchema ={
    body: Joi.object({
    userName:Joi.string().min(3).max(40).required().messages({
        'string.empty':'username is required'
    }),
    password:generalFields.password,
    email:generalFields.email,
    age:Joi.number().positive().integer().min(12).optional(),
    gender:Joi.valid('Male','Female'),
    cpassword:Joi.valid(Joi.ref('password')).required()
})
}

//log in validation

export const LoginSchema ={
  body:  Joi.object({
    email:generalFields.email,
    password:generalFields.password,
})
}