import axios from "axios";
import { useContext } from "react";
import { createContext } from "react";
import { useAuthkey } from "./Authkey";

const Api = createContext();

export const useApi = () => {
  return useContext(Api);
};

const ApiProvider = ({ children }) => {
  const { authkey, updateAuthkey, removeAuthkey } = useAuthkey();

  const signIn = async (username, password) => {
    const {
      data: { authkey },
    } = await axios.get("http://localhost:5500/signIn", {
      params: {
        username,
        password,
      },
    });

    updateAuthkey(authkey);
  };

  const signUp = async (username, password) => {
    const {
      data: { authkey },
    } = await axios.post("http://localhost:5500/signUp", {
      username,
      password,
    });

    updateAuthkey(authkey);
  };

  const logOut = async () => {
    removeAuthkey();
  };

  const getBooks = async () => {
    return axios.get("http://localhost:5500/", {
      headers: {
        authkey: authkey,
      },
    });
  };

  return (
    <Api.Provider
      value={{
        signIn,
        signUp,
        logOut,
        getBooks,
      }}
    >
      {children}
    </Api.Provider>
  );
};

export default ApiProvider;
