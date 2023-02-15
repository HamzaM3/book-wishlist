const { usernamePasswordSchema } = require("./utils/schemas");
const { getAuthkey, getHashedPass } = require("../../crypto/hashing");

module.exports = ({
  usernameToAuthkey,
  createNewAccount,
  testAccountExists,
}) => {
  const signUp = async (req, res, next) => {
    const { username, hashedPass, userNumber, timestamp } = req.body;

    const authkey = getAuthkey(username, hashedPass, userNumber, timestamp);

    console.log(username, hashedPass, getHashedPass(username, hashedPass));

    if (
      !(await createNewAccount(
        username,
        getHashedPass(username, hashedPass),
        authkey
      ))
    ) {
      res.status(400).json({
        error: "Error while creating account",
      });
      return;
    }

    res.data = {
      authkey,
    };
    next();
  };

  signUp.test = async (req, res, next) => {
    const { username, hashedPass } = req.body;

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
