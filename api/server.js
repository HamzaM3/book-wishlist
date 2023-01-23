const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const yup = require("yup");
const app = express();
const db = pgp("postgres://test:pass@localhost:5432/mydb");

app.use(cors());

app.get("/", express.json(), async (req, res) => {
  const authkey = req.headers.authkey;

  if (!authkey) {
    res.json({
      error: "No Auth Key",
    });
    return;
  }

  const { username } = await db.one(
    `
    select
      username
    from
      account
    where
      id = $security$${authkey}$security$;
    `
  );

  if (!username) {
    res.json({
      error: "Invalid Auth Key",
    });
    return;
  }

  const data = await db.any(
    `
    select
      b.title,
      b.author,
      b.imgUrl
    from
      book b
    where
      b.username = $security$${username}$security$;
    `
  );

  res.json(data);
});

app.get("/signIn", express.json(), async (req, res) => {
  const validationSchema = yup.object({
    username: yup
      .string()
      .min(4, "Username Too Short")
      .max(32, "Username Too Long"),
    password: yup
      .string()
      .min(8, "Password Too Short")
      .max(32, "Password Too Long"),
  });

  const { username, password } = req.query;

  try {
    validationSchema.validateSync(req.body, { strict: true });
  } catch (error) {
    res.json(error);
  }

  if (!username || !password) {
    console.log(JSON.stringify(req.body, null, 2));
    res.json({
      error: "Invalid Sign In Data",
    });
    return;
  }

  const { id } = await db.one(
    `
    select
      id
    from
      account
    where
      username = $security$${username}$security$;
    `
  );

  if (!id) {
    res.json({
      error: "Username Invalid",
    });
    return;
  }

  const { valid } = await db.one(
    `
    select
      count(*) as valid
    from
      account
    where
      username = $security$${username}$security$ and pass = $security$${password}$security$;
    `
  );

  if (!!!valid) {
    res.json({
      error: "Password Invalid",
    });
    return;
  }

  res.json({
    authkey: id,
  });
});

app.post("/signUp", express.json(), async (req, res) => {
  const validationSchema = yup.object({
    username: yup
      .string()
      .min(4, "Username Too Short")
      .max(32, "Username Too Long")
      .required("Username Required"),
    password: yup
      .string()
      .min(8, "Password Too Short")
      .max(32, "Password Too Long")
      .required("Password Required"),
  });

  console.log(req.body);

  const { username, password } = req.body;

  try {
    validationSchema.validateSync(
      {
        username,
        password,
      },
      {
        strict: true,
        abortEarly: false,
      }
    );
  } catch (error) {
    res.json({
      error: error.errors.filter(
        (e) =>
          [
            "Username Too Short",
            "Username Too Long",
            "Username Required",
            "Password Too Short",
            "Password Too Long",
            "Password Required",
          ].indexOf(e) !== -1
      ),
    });
    return;
  }

  if (!username || !password) {
    res.json({
      error: "Invalid Sign Up Data",
    });
    return;
  }

  const { valid } = await db.one(
    `
    select
      count(*) as valid
    from
      account
    where
      username = $security$${username}$security$;
    `
  );

  if (valid > 0) {
    res.json({
      error: "Username Already Exists",
    });
    return;
  }

  try {
    await db.none(
      `insert into account(username, pass) values ($security$${username}$security$, $security$${password}$security$)`
    );
  } catch (error) {
    console.log("Error with POST /signUp. Data: ", JSON.stringify(error));
    res.json({
      error: "Unknown error",
    });
  }

  const { id } = await db.one(
    `
    select id
    from account
    where 
      username = $security$${username}$security$
    `
  );

  res.json({
    message: "Account successfully created",
    authkey: id,
  });
});

app.listen(5500);
