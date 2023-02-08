import { useContext, useState, useEffect, createContext } from "react";
import { getMachineKeys, getServerKeys } from "./utils/RSA-utils";

const RSA = createContext({});

export const useRSA = () => {
  return useContext(RSA);
};

const RSAProvider = ({ children }) => {
  const [machineKeys, setMachineKeys] = useState();
  const [serverKeys, setServerKeys] = useState();
  const [isLoading, setLoading] = useState(true);

  // returns array of numbers from 0 to 255
  const encrypt = (message) => {
    return serverKeys.encryptKey.encrypt(message, "RSA-OAEP");
  };

  // decrypt array of numbers from 0 to 255
  const decrypt = (message) => {
    const m1 = machineKeys.encryptKeys.privateKey.decrypt(message, "RSA-OAEP");
    return serverKeys.verifyKey.decrypt(m1);
  };

  useEffect(() => {
    setMachineKeys(getMachineKeys());
  }, []);

  useEffect(() => {
    const f = async () => {
      setServerKeys(await getServerKeys());
      setLoading(false);
    };
    if (machineKeys) f();
  }, [machineKeys]);

  return (
    <RSA.Provider
      value={{
        machineKeys,
        serverKeys,
        encrypt,
        decrypt,
        isLoading,
      }}
    >
      {children}
    </RSA.Provider>
  );
};

export default RSAProvider;
