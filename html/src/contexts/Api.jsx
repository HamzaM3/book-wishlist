import axios from "axios";
import { useContext } from "react";
import { createContext } from "react";
import { useAuthkey } from "./Authkey";
import { useCrypto } from "./Crypto";

const Api = createContext();

export const useApi = () => {
  return useContext(Api);
};

const ApiProvider = ({ children }) => {
  const { get, post, delete_ } = useCrypto();
  const { authkey, updateAuthkey, removeAuthkey } = useAuthkey();

  const signIn = async (username, password) => {
    const { authkey } = await get("/signIn")({ username, password });

    updateAuthkey(authkey);
  };

  const signUp = async (username, password) => {
    const { authkey } = await post("/signUp")({ username, password });

    updateAuthkey(authkey);
  };

  const logOut = async () => {
    removeAuthkey();
  };

  const getBooks = get("/");

  const addBook = post("/");

  const deleteBook = delete_("/");

  const getImage = get("/bookcover");

  return (
    <Api.Provider
      value={{
        signIn,
        signUp,
        logOut,
        getBooks,
        addBook,
        deleteBook,
        getImage,
      }}
    >
      {children}
    </Api.Provider>
  );
};

export default ApiProvider;
