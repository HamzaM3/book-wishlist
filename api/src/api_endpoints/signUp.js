const { usernamePasswordSchema } = require("./utils/schemas");

module.exports = ({
  usernameToAuthkey,
  createNewAccount,
  testAccountExists,
}) => {
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

  return signUp;
};
