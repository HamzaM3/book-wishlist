const path = require("path");

module.exports = ({ authkeyToUsername, testAuthorizedToAccessImage }) => {
  const getImage = async (req, res) => {
    const { image } = req.params;

    const imagePath = path.resolve(__dirname, "../..", "bookCovers/" + image);

    res.sendFile(imagePath, {}, (err) => {
      if (err) {
        res.status(404).json({
          error: "Book cover not found",
        });
      }
    });
  };

  getImage.test = async (req, res, next) => {
    const authkey = req.headers.authkey;
    const { image } = req.params;
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

    if (!(await testAuthorizedToAccessImage(username, image))) {
      res.status(400).json({
        error: "Unauthorized to access image",
      });
      return;
    }
    next();
  };

  return getImage;
};
