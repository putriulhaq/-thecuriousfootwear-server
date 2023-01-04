import joi from "joi";

const re_pass = /^[a-zA-Z0-9]{4,30}$/;
const userValidate = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  username: joi.string().alphanum().min(5).max(30).required(),
  password: joi.string().pattern(re_pass).required(),
  phone_number:joi.string().min(10).max(14),
  about: joi.string().max(100).allow('')
});

export default userValidate;