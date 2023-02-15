import { useContext, useState, useEffect, createContext } from "react";
import axios from "axios";
import forge from "node-forge";
import { useRSA } from "./RSA";
import { useAES } from "./AES";
import { useAuthkey } from "./Authkey";

const { publicKeyToPem } = forge.pki;

const Crypto = createContext({});

export const useCrypto = () => {
  return useContext(Crypto);
};

const throwError = (e, RSA) => {
  if (!e.response || !e.response.data) {
    throw e;
  }
  if (!e.response.data.error || e.response.data.error !== "Wrong keys") {
    throw e.response.data;
  }
  RSA.getKeys();
  throw e.response.data;
};

const BASE_URL = "http://localhost:5500";

const CryptoProvider = ({ children }) => {
  const RSA = useRSA();
  const AES = useAES();
  const { authkey } = useAuthkey();

  const encrypt = (message) => {
    const pem = publicKeyToPem(RSA.machineKeys.encryptKeys.publicKey);
    const data = JSON.stringify({ pem, data: message, authkey });
    const { encrypted, key, iv } = AES.encrypt(data);
    const AESKey = RSA.encrypt(JSON.stringify({ key, iv }));
    return { encrypted, AESKey };
  };

  const decrypt = (encrypted, AESKey) => {
    const { key, iv } = JSON.parse(RSA.decrypt(AESKey));
    return JSON.parse(AES.decrypt(encrypted, key, iv));
  };

  const get = (path) => {
    return async (value) => {
      try {
        const params = encrypt(value);
        const res = await axios.get(BASE_URL + path, {
          headers: { responsetype: "json" },
          params,
        });
        if (!res.data) return;
        return decrypt(res.data.encrypted, res.data.AESKey);
      } catch (e) {
        throwError(e, RSA);
      }
    };
  };

  const post = (path) => {
    return async (value) => {
      try {
        const encrypted1 = encrypt(value);
        const res = await axios.post(BASE_URL + path, encrypted1);

        if (!res.data) return;
        return decrypt(res.data.encrypted, res.data.AESKey);
      } catch (e) {
        throwError(e, RSA);
      }
    };
  };

  const delete_ = (path) => {
    return async (value) => {
      try {
        const encrypted1 = encrypt(value);
        const res = await axios.delete(BASE_URL + path, { params: encrypted1 });

        if (!res.data) return;
        return decrypt(res.data.encrypted, res.data.AESKey);
      } catch (e) {
        throwError(e, RSA);
      }
    };
  };

  return (
    <Crypto.Provider
      value={{
        get,
        post,
        delete_,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoProvider;
