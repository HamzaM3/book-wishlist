import { useContext, createContext } from "react";
import forge from "node-forge";

const AES = createContext({});

export const useAES = () => {
  return useContext(AES);
};

const AESProvider = ({ children }) => {
  // returns array of numbers from 0 to 255
  const encrypt = (message) => {
    let key = forge.random.getBytesSync(16);
    let iv = forge.random.getBytesSync(16);
    let cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    let encrypted = cipher.output.data;
    return { encrypted, key, iv };
  };

  // decrypt array of numbers from 0 to 255
  const decrypt = (message, key, iv) => {
    var decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(message));
    decipher.finish();
    return decipher.output.data;
  };

  return (
    <AES.Provider
      value={{
        encrypt,
        decrypt,
      }}
    >
      {children}
    </AES.Provider>
  );
};

export default AESProvider;
