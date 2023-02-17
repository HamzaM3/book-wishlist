const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
require("dotenv").config();
const app = express();

// Don't know if Vercel will make it work
// const readlineSync = require("readline-sync");
// const postgresPass = readlineSync.question("Postgres password: ");
// const seed = readlineSync.question("Seed: ");

const { SEED: seed, POSTGRESQL_PASS: postgresPass } = process.env;

const db = pgp(
  `postgresql://postgres:${postgresPass}@db.yqxdkuqujyrafzlsqpoq.supabase.co:5432/postgres`
);

console.log("connection established");

const db_functions = require("./src/db_functions")(db);
const api_functions = require("./src/api_endpoints/index")(db_functions);
const { getBooks, signIn, signUp, addBook, deleteBook } = api_functions;

const { sendKeys, decryptMiddleware, encryptMiddleware } =
  require("./crypto/middleware")();

app.use((req, res, next) => {
  req.seed = seed;
  next();
});

app.use(cors(), express.json({ limit: "200gb" }));

app.get("/api/keys", sendKeys);

app.get("/api/**", (req, res, next) => {
  req.body = req.query;
  next();
});

app.delete("/api/**", (req, res, next) => {
  req.body = req.query;
  next();
});

app.use(decryptMiddleware);

app.get("/api", getBooks.test, getBooks);

app.get("/api/signIn", signIn.test, signIn);

app.post("/api/signUp", signUp.test, signUp);

app.post("/api", addBook.test, addBook);

app.delete("/api", deleteBook.test, deleteBook);

app.use(encryptMiddleware);

console.log("hey");

module.exports = app;
