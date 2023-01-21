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

  localforage.setItem("authKey", authkey);
};

export const signUp = async (username, password) => {
  const {
    data: { authKey },
  } = await axios.post("http://localhost:5500/signUp", {
    username,
    password,
  });

  console.log(authKey);

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
