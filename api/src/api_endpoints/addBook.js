const {
  isUrl,
  makeFilename,
  getImageHttp,
  getImageHttps,
} = require("./utils/http");

const { bookSchema } = require("./utils/schemas");

module.exports = ({ createNewBook, authkeyToUsername }) => {
  const addBook = async (req, res) => {
    const authkey = req.authkey;
    const { title, author, filename } = req.body;

    if (!(await createNewBook(title, author, filename, authkey))) {
      res.status(400).json({
        error: "Error while saving book",
      });
      return;
    }
    res.end();
  };

  addBook.downloadImage = async (req, res, next) => {
    const { bookCoverUrl } = req.body;

    if (!bookCoverUrl) {
      next();
      return;
    }

    if (!isUrl(bookCoverUrl)) {
      res.status(400).end();
      return;
    }
    const url = new URL(bookCoverUrl);
    let filename = url.pathname.match(/\/[^\/]+$/g)[0].slice(1);
    filename = makeFilename(filename);
    const protocol = url.protocol;

    try {
      if (protocol === "http:") getImageHttp(bookCoverUrl, filename);
      else if (protocol === "https:") getImageHttps(bookCoverUrl, filename);
      else {
        res.status(400).end();
        return;
      }
    } catch (e) {
      res.status(500).end();
    }
    req.body.filename = filename;
    next();
  };

  addBook.test = async (req, res, next) => {
    const authkey = req.authkey;
    const { title, author, bookCoverUrl } = req.body;

    console.log(authkey.length, /^[0-9a-f]{128}$/.test(authkey));
    if (!(authkey && /^[0-9a-f]{128}$/.test(authkey))) {
      res.status(400).json({
        error: "Invalid authkey",
      });
      return;
    }

    try {
      bookSchema.validateSync(
        { title, author, bookCoverUrl },
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
