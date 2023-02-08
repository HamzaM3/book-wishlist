const forge = require("node-forge");

module.exports.encrypt = (message) => {
  let key = forge.random.getBytesSync(16);
  let iv = forge.random.getBytesSync(16);
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();
  let encrypted = cipher.output.data;
  return { encrypted, key, iv };
};

module.exports.decrypt = (message, key, iv) => {
  var decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(message));
  decipher.finish();
  return decipher.output.data;
};
