const forge = require("node-forge");

const { generateKeyPair, setPublicKey } = forge.pki.rsa;
const { publicKeyFromPem, publicKeyToPem } = forge.pki;

const getKeyPair = (bits) => {
  keys = generateKeyPair({ bits, e: 0x10001 });

  const n = keys.privateKey.n;
  const d = keys.privateKey.d;

  keys.privateKey.encrypt = (message) => {
    const k = setPublicKey(n, d);
    return k.encrypt(message, "RSA-OAEP");
  };

  return keys;
};

module.exports = () => {
  const verifyKeys = getKeyPair(1024);
  const encryptKeys = getKeyPair(2048);

  const verifyPem = publicKeyToPem(verifyKeys.publicKey);
  const encryptPem = publicKeyToPem(encryptKeys.publicKey);

  const encrypt = (pem, message) => {
    const m1 = verifyKeys.privateKey.encrypt(message);
    const k = publicKeyFromPem(pem);
    return k.encrypt(m1, "RSA-OAEP");
  };

  const decrypt = (message) => {
    return encryptKeys.privateKey.decrypt(message, "RSA-OAEP");
  };

  return {
    encrypt,
    decrypt,
    verifyPem,
    encryptPem,
  };
};
