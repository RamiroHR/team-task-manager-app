const Joi = require('joi')

// Validation schema for user credentials
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(12).required(),
  password: Joi.string().min(5).required(),
});


// Validation schema for user tasks
const taskSchema = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(512).allow(''),
  completed: Joi.boolean()
}).strict();


// module.exports = {userSchema}
module.exports = {userSchema, taskSchema}

