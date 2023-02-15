const yup = require("yup");

const usernamePasswordSchema = yup
  .object({
    username: yup
      .string()
      .min(4, "Username too short")
      .max(32, "Username too long")
      .required("Username required"),
    hashedPass: yup
      .string()
      .length(64, "Something is wrong")
      .matches(/^[a-f0-9]+$/, "Something is wrong")
      .required("Password required"),
  })
  .strict();

const bookSchema = yup
  .object({
    imgurl: yup.string().url(),
    title: yup.string().min(1).required(),
    author: yup.string().min(1).required(),
  })
  .strict();

module.exports = {
  usernamePasswordSchema,
  bookSchema,
};
