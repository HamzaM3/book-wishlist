const { bookSchema } = require("./utils/schemas");

module.exports = ({ createNewBook, authkeyToUsername }) => {
  const addBook = async (req, res) => {
    const authkey = req.authkey;
    const { title, author } = req.body;

    if (!(await createNewBook(title, author, authkey))) {
      res.status(400).json({
        error: "Error while saving book",
      });
      return;
    }
    res.end();
  };

  addBook.test = async (req, res, next) => {
    const authkey = req.authkey;
    const { title, author } = req.body;

    console.log(authkey.length, /^[0-9a-f]{128}$/.test(authkey));
    if (!(authkey && /^[0-9a-f]{128}$/.test(authkey))) {
      res.status(400).json({
        error: "Invalid authkey",
      });
      return;
    }

    try {
      bookSchema.validateSync(
        { title, author },
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

  return addBook;
};
