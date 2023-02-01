const http = require("http");
const https = require("https");
const fs = require("fs");
const yup = require("yup");

const makeFilename = (filename) => {
  const [extension] = filename.match(/\.[^\.]+$/g) || [];
  if (extension === undefined) {
    return "image-" + Date.now() + "-" + random() + ".png";
  }

  const name = filename.slice(0, -extension.length);

  return name + "-" + Date.now() + "-" + random() + extension;
};

const random = () => Math.floor(Math.random() * 1000000);

const isUrl = (str) => yup.string().url().required().strict().isValidSync(str);

const getImageHttp = (bookCoverUrl, filename) => {
  http.get(
    bookCoverUrl,
    {
      headers: {
        "User-Agent": "SomeMan/1.0.0",
      },
    },
    (res) => {
      res.pipe(fs.createWriteStream("bookCovers/" + filename));
    }
  );
};

const getImageHttps = (bookCoverUrl, filename) => {
  https.get(
    bookCoverUrl,
    {
      headers: {
        "User-Agent": "SomeMan/1.0.0",
      },
    },
    (res) => {
      res.pipe(fs.createWriteStream("bookCovers/" + filename));
    }
  );
};

module.exports = {
  makeFilename,
  random,
  isUrl,
  getImageHttp,
  getImageHttps,
};
