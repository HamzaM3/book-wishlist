const { randomBytes, createHash } = require("crypto");

module.exports.getHashedPass = (username, hashedPass) => {
  // input by hand at start of server
  // RAM is considered unaccessible
  // If it's not, then obfuscation is necessary
  const seed = "seed";

  const hash = createHash("sha512");

  const data = hash.update(username + hashedPass + seed, "utf-8");

  return data.digest("hex");
};

module.exports.getAuthkey = (username, hashedPass, userNumber, timestamp) => {
  const rand1 = randomBytes(128).toString();
  const rand2 = randomBytes(128).toString();

  const entry = rand1 + username + hashedPass + userNumber + timestamp + rand2;

  const hash = createHash("sha512");

  const data = hash.update(entry, "binary");

  return data.digest("hex");
};
