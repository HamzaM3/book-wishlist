const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const yup = require("yup");
const app = express();
const db = pgp("postgres://test:pass@localhost:5432/mydb");
const db_functions = require("./db_functions")(db);
const api_functions = require("./api_functions")(db_functions);
const { getBooks, signIn, signUp } = api_functions;

app.use(cors());

app.get("/", express.json(), getBooks.test, getBooks);

app.get("/signIn", express.json(), signIn.test, signIn);

app.post("/signUp", express.json(), signUp.test, signUp);

app.listen(5500);
