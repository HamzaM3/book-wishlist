const { usernamePasswordSchema } = require("./utils/schemas");

module.exports = ({
  usernameToAuthkey,
  testAccountExists,
  testUsernamePassword,
}) => {
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

  return signIn;
};
