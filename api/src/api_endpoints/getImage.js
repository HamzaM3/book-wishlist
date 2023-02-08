const path = require("path");
const fs = require("fs");

module.exports = ({ authkeyToUsername, testAuthorizedToAccessImage }) => {
  const getImage = async (req, res, next) => {
    const { image } = req.body;

    const imagePath = path.resolve(__dirname, "../..", "bookCovers/" + image);

    const file = fs.readFileSync(imagePath, { encoding: "base64" });

    res.data = file;

    next();
  };

  getImage.test = async (req, res, next) => {
    const authkey = req.authkey;
    const { image } = req.body;

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
