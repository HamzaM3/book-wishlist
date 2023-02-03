const path = require("path");

module.exports = ({
  testAuthorizedToAccessBook,
  authkeyToUsername,
  deleteBookFromId,
}) => {
  const deleteBook = async (req, res) => {
    const { id } = req.body;
    if (!(await deleteBookFromId(id))) {
      res.status(500).json({
        error: "Error while deleting the entry",
      });
      return;
    }
    res.end();
  };

  deleteBook.test = async (req, res, next) => {
    const { id } = req.body;
    const { authkey } = req.headers;

    console.log("id", id);

    if (typeof id !== "number") {
      res.status(400).json({
        error: "An id should be a number",
      });
      return;
    }

    console.log("authkey:", authkey);
    const username =
      authkey && /^[0-9]+$/.test(authkey)
        ? await authkeyToUsername(authkey)
        : undefined;

    if (!username) {
      res.status(400).json({
        error: "Incorrect authkey",
      });
      return;
    }

    if (!(await testAuthorizedToAccessBook(username, id))) {
      res.status(404).json({
        error: "Unauthorized to delete this entry",
      });
      return;
    }

    next();
  };

  return deleteBook;
};