import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const Authkey = createContext({});

export const useAuthkey = () => {
  return useContext(Authkey);
};

const AuthKeyProvider = ({ children }) => {
  const [authkey, setAuthkey] = useState(localStorage.getItem("authkey"));

  const updateAuthkey = async (value) => {
    await localStorage.setItem("authkey", value);
    setAuthkey(value);
  };

  const removeAuthkey = async () => {
    await localStorage.removeItem("authkey");
    setAuthkey(undefined);
  };

  return (
    <Authkey.Provider
      value={{
        authkey,
        updateAuthkey,
        removeAuthkey,
        connected: authkey !== undefined,
      }}
    >
      {children}
    </Authkey.Provider>
  );
};

export default AuthKeyProvider;
