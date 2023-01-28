const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const yup = require("yup");
const app = express();
const db = pgp("postgres://test:pass@localhost:5432/mydb");
const db_functions = require("./db_functions")(db);
const api_functions = require("./api_functions")(db_functions);
const { getBooks, signIn, signUp, addBook } = api_functions;

app.use(cors(), express.json());

app.get("/", getBooks.test, getBooks);

app.get("/signIn", signIn.test, signIn);

app.post("/signUp", signUp.test, signUp);

app.post("", addBook.test, addBook);

app.listen(5500);
