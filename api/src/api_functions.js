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
    imgurl: yup.string().url().required(),
    title: yup.string().min(1).required(),
    author: yup.string().min(1).required(),
    authkey: yup
      .string()
      .matches(/^[0-9]+$/)
      .required(),
  })
  .strict();

const api_functions = ({
  authkeyToUsername,
  usernameToAuthkey,
  getDataFromUsername,
  testAccountExists,
  testUsernamePassword,
  createNewAccount,
  createNewBook,
}) => {
  const getBooks = async (req, res) => {
    const authkey = req.headers.authkey;
    const username = await authkeyToUsername(authkey);
    const books = await getDataFromUsername(username);
    res.json(books);
  };

  getBooks.test = async (req, res, next) => {
    const authkey = req.headers.authkey;
    if (authkey === undefined) {
      res.status(400).json({
        error: "No authkey received",
      });
      return;
    }

    const username = await authkeyToUsername(authkey);

    if (username === undefined) {
      res.status(400).json({
        error: "Invalid authkey",
      });
      return;
    }
    next();
  };

  const signIn = async (req, res) => {
    const { username } = req.query;
    const authkey = await usernameToAuthkey(username);
    res.json({
      authkey,
    });
  };

  signIn.test = async (req, res, next) => {
    const { username, password } = req.query;

    try {
      usernamePasswordSchema.validateSync(
        { username, password },
        { strict: true, abortEarly: false }
      );
    } catch (error) {
      res.status(400).json({
        error: error.errors,
      });
      return;
    }

    if (!(await testAccountExists(username))) {
      res.status(400).json({
        error: "Account doesn't exist",
      });
      return;
    }

    if (!(await testUsernamePassword(username, password))) {
      res.status(400).json({
        error: "Password is incorrect",
      });
      return;
    }

    next();
  };

  const signUp = async (req, res) => {
    const { username, password } = req.body;

    if (!(await createNewAccount(username, password))) {
      res.status(400).json({
        error: "Error while creating account",
      });
      return;
    }

    const authkey = await usernameToAuthkey(username);
    res.json({
      authkey,
    });
  };

  signUp.test = async (req, res, next) => {
    const { username, password } = req.body;

    try {
      usernamePasswordSchema.validateSync(
        { username, password },
        { strict: true, abortEarly: false }
      );
    } catch (error) {
      res.status(400).json({
        error: error.errors,
      });
      return;
    }

    if (await testAccountExists(username)) {
      res.status(400).json({
        error: "Account already exists",
      });
      return;
    }

    next();
  };

  const addBook = async (req, res) => {
    const { authkey } = req.headers;
    const { title, author, imgurl } = req.body;

    if (!(await createNewBook(title, author, imgurl, authkey))) {
      res.status(400).json({
        error: "Error while saving book",
      });
      return;
    }
    res.end();
  };

  addBook.test = async (req, res, next) => {
    const { authkey } = req.headers;
    const { title, author, imgurl } = req.body;

    try {
      bookSchema.validateSync(
        { authkey, title, author, imgurl },
        { strict: true, abortEarly: false }
      );
    } catch (error) {
      res.status(400).json({
        error: error.errors,
      });
      return;
    }

    if (!(await authkeyToUsername(authkey))) {
      res.status(400).json({
        error: "Incorrect authkey",
      });
      return;
    }
    next();
  };

  return {
    getBooks,
    signIn,
    signUp,
    addBook,
  };
};

module.exports = api_functions;
