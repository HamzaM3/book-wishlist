const { usernamePasswordSchema } = require("./utils/schemas");

const { getHashedPass } = require("../../crypto/hashing");

module.exports = ({
  usernameToAuthkey,
  testAccountExists,
  testUsernamePassword,
}) => {
  const signIn = async (req, res, next) => {
    const { username } = req.body;
    const authkey = await usernameToAuthkey(username);
    res.data = {
      authkey,
    };
    next();
  };

  signIn.test = async (req, res, next) => {
    const { username, hashedPass } = req.body;
    const seed = req.seed;

    try {
      usernamePasswordSchema.validateSync(
        { username, hashedPass },
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

    if (
      !(await testUsernamePassword(
        username,
        getHashedPass(username, hashedPass, seed)
      ))
    ) {
      res.status(400).json({
        error: "Password is incorrect",
      });
      return;
    }

    next();
  };

  return signIn;
};
