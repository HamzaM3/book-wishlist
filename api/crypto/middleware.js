const RSA = require("./rsa")();
const AES = require("./aes");

module.exports = () => {
  const { verifyPem, encryptPem } = RSA;

  const decryptMiddleware = (req, res, next) => {
    const { encrypted, AESKey } = req.body;
    const { key, iv } = JSON.parse(RSA.decrypt(AESKey));
    const { data, pem, authkey } = JSON.parse(AES.decrypt(encrypted, key, iv));
    req.body = data;
    req.authkey = authkey;
    req.pem = pem;
    next();
  };

  const encryptMiddleware = (req, res) => {
    if (!res.data) {
      res.end();
      return;
    }
    const pem = req.pem;
    const { encrypted, key, iv } = AES.encrypt(JSON.stringify(res.data));
    const AESKey = RSA.encrypt(pem, JSON.stringify({ key, iv }));
    res.json({ encrypted, AESKey });
  };

  const sendKeys = (req, res) => {
    res.json({
      verifyKey: verifyPem,
      encryptKey: encryptPem,
    });
  };

  return {
    decryptMiddleware,
    encryptMiddleware,
    sendKeys,
  };
};
