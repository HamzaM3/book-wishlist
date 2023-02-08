import forge from "node-forge";
import axios from "axios";

const { generateKeyPair, setPrivateKey, setPublicKey } = forge.pki.rsa;
const { BigInteger } = forge.jsbn;
const { publicKeyFromPem } = forge.pki;

const stringifyKeys = (keys) => {
  let { n, e, d, p, q, dP, dQ, qInv } = keys.privateKey;
  return JSON.stringify(
    [n, e, d, p, q, dP, dQ, qInv].map((x) => x.toString(16))
  );
};

const destringifyKeys = (stringifiedKeys) => {
  const [n, e, d, p, q, dP, dQ, qInv] = JSON.parse(stringifiedKeys).map(
    (x) => new BigInteger(x, 16)
  );

  const privateKey = setPrivateKey(n, e, d, p, q, dP, dQ, qInv);
  const publicKey = setPublicKey(n, e);

  return { privateKey, publicKey };
};

const getKeys = (bits, name = "rsa-keys") => {
  let keys = localStorage.getItem(name);

  if (!keys) {
    keys = generateKeyPair({ bits, e: 0x10001 });
    localStorage.setItem(name, stringifyKeys(keys));
  } else {
    keys = destringifyKeys(keys);
  }

  keys.privateKey.encrypt = (message) => {
    const k = setPublicKey(keys.privateKey.n, keys.privateKey.d);

    return k.encrypt(message, "RSA-OAEP");
  };

  return keys;
};

export const getMachineKeys = () => {
  return {
    verifyKeys: getKeys(1024, "verify-keys"),
    encryptKeys: getKeys(2048, "encrypt-keys"),
  };
};

export const getServerKeys = async () => {
  let {
    data: { verifyKey, encryptKey },
  } = await axios.get("http://localhost:5500/keys");

  verifyKey = publicKeyFromPem(verifyKey);
  verifyKey.decrypt = (message) => {
    const k = setPrivateKey(verifyKey.n, Number("0x10001"), verifyKey.e);
    return k.decrypt(message, "RSA-OAEP");
  };

  return {
    verifyKey: verifyKey,
    encryptKey: publicKeyFromPem(encryptKey),
  };
};
