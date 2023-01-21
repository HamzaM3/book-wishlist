import axios from "axios";
import localforage from "localforage";

export const signIn = async (username, password) => {
  const {
    data: { authkey },
  } = await axios.get("http://localhost:5500/signIn", {
    params: {
      username,
      password,
    },
  });

  await localforage.setItem("authKey", authkey);
};

export const signUp = async (username, password) => {
  const authKey = axios.post("http://localhost:5500/signUp", {
    data: {
      username,
      password,
    },
  });

  localforage.setItem("authKey", authKey);
};

export const logOut = async () => {
  localforage.removeItem("authKey");
};

export const getBooks = async (authKey) => {
  return axios.get("http://localhost:5500/", {
    headers: {
      authKey,
    },
  });
};
