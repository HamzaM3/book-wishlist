module.exports = ({ authkeyToUsername, getDataFromUsername }) => {
  const getBooks = async (req, res, next) => {
    const authkey = req.authkey;
    const username = await authkeyToUsername(authkey);
    const books = await getDataFromUsername(username);
    res.data = books;
    next();
  };

  getBooks.test = async (req, res, next) => {
    const authkey = req.authkey;
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

  return getBooks;
};
