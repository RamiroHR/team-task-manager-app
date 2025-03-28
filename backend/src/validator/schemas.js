const Joi = require('joi')

// Validation schema for user credentials
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(12).required(),
  password: Joi.string().min(5).required(),
});


// Validation schema for user tasks
const taskSchema = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  completed: Joi.boolean()
})


// module.exports = {userSchema}
module.exports = {userSchema, taskSchema}


// // Try user-pass (it works for register)s
// user: user032701
// pass: pass!0327-01
