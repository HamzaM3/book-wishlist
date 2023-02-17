const forge = require("node-forge");

const { generateKeyPair, setPublicKey } = forge.pki.rsa;
const { publicKeyFromPem, privateKeyFromPem } = forge.pki;

// const getKeyPair = (bits) => {
//   const keys = generateKeyPair({ bits, e: 0x10001 });

//   const n = keys.privateKey.n;
//   const d = keys.privateKey.d;

//   keys.privateKey.encrypt = (message) => {
//     const k = setPublicKey(n, d);
//     return k.encrypt(message, "RSA-OAEP");
//   };

//   return keys;
// };

module.exports = () => {
  const {
    VERIFY_PUBLIC_KEY,
    VERIFY_PRIVATE_KEY,
    ENCRYPT_PUBLIC_KEY,
    ENCRYPT_PRIVATE_KEY,
  } = process.env;

  const verifyKeys = {
    privateKey: privateKeyFromPem(VERIFY_PRIVATE_KEY),
    publicKey: publicKeyFromPem(VERIFY_PUBLIC_KEY),
  };
  const encryptKeys = {
    privateKey: privateKeyFromPem(ENCRYPT_PRIVATE_KEY),
    publicKey: publicKeyFromPem(ENCRYPT_PUBLIC_KEY),
  };

  const verifyPem = VERIFY_PUBLIC_KEY;
  const encryptPem = ENCRYPT_PUBLIC_KEY;

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
