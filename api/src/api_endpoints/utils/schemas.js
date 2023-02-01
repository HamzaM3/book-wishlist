const yup = require("yup");

const usernamePasswordSchema = yup
  .object({
    username: yup
      .string()
      .min(4, "Username too short")
      .max(32, "Username too long")
      .required("Username required"),
    password: yup
      .string()
      .min(8, "Password too short")
      .max(32, "Password too long")
      .required("Password required"),
  })
  .strict();

const bookSchema = yup
  .object({
    imgurl: yup.string().url(),
    title: yup.string().min(1).required(),
    author: yup.string().min(1).required(),
    authkey: yup
      .string()
      .matches(/^[0-9]+$/)
      .required(),
  })
  .strict();

module.exports = {
  usernamePasswordSchema,
  bookSchema,
};
