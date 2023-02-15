import axios from "axios";
import { useContext } from "react";
import { createContext } from "react";
import { useAuthkey } from "./Authkey";
import { useCrypto } from "./Crypto";
import forge from "node-forge";

const getHashedPass = (username, password) => {
  const seed1 =
    "2693d3c41c2ba5ad9af3fc1206a5312fa42516adc59a7c46b00d15c62a8a2851";
  const seed2 =
    "dff7a71dfb6c73cadb312de00e53e6d1e2c2604875aa7578c0e4648b9773ec2e";
  const seed3 =
    "51dc6558f78dd6cffc655d5f0f04b4671cfc03b7d11683f172b8ee3600f5ac32";
  const seed4 =
    "cc56d8717bc09f5ab6d9dc11ccd93fd04064dfdaa49ff2f225253188c96345da";
  const seed5 =
    "271c0274948e76af5423766b715e18e654303f8ff215ee6bea39077f96851682";
  const seed6 =
    "2ca95275e427ceb0220bf4d09bd486f02dcad8a30b3876cda790b573367e0a0f";

  const entry =
    seed1 +
    username +
    seed2 +
    password +
    seed3 +
    username +
    seed4 +
    password +
    seed5 +
    password +
    seed6;

  const md = forge.md.sha256.create();
  md.update(entry);
  return md.digest().toHex();
};

const Api = createContext();

export const useApi = () => {
  return useContext(Api);
};

const ApiProvider = ({ children }) => {
  const { get, post, delete_ } = useCrypto();
  const { updateAuthkey, removeAuthkey } = useAuthkey();

  const signIn = async (username, password) => {
    const hashedPass = getHashedPass(username, password);
    const { authkey } = await get("/signIn")({ username, hashedPass });

    updateAuthkey(authkey);
  };

  const signUp = async (username, password) => {
    const hashedPass = getHashedPass(username, password);
    const userNumber = forge.util.bytesToHex(forge.random.getBytesSync(128));
    const timestamp = new Date().toString();
    const { authkey } = await post("/signUp")({
      username,
      hashedPass,
      userNumber,
      timestamp,
    });

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
