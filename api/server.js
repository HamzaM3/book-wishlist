const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const yup = require("yup");
const app = express();
const db = pgp("postgres://test:pass@localhost:5432/mydb");
const db_functions = require("./src/db_functions")(db);
const api_functions = require("./src/api_endpoints/index")(db_functions);
const { getBooks, signIn, signUp, addBook, getImage, deleteBook } =
  api_functions;

app.use(cors(), express.json());

app.get("/", getBooks.test, getBooks);

app.get("/signIn", signIn.test, signIn);

app.post("/signUp", signUp.test, signUp);

app.post("/", addBook.test, addBook.downloadImage, addBook);

app.get("/bookCover/:image", getImage.test, getImage);

app.delete("/", deleteBook.test, deleteBook);

app.listen(5500);
