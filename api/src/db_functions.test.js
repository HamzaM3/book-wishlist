const yup = require("yup");
const pgp = require("pg-promise")();
const db = pgp("postgres://test:pass@localhost:5432/mydb");
const {
  authkeyToUsername,
  usernameToAuthkey,
  getDataFromUsername,
  testAccountExists,
  testUsernamePassword,
  createNewAccount,
} = require("./db_functions")(db);

describe("authkeyToUsername", () => {
  it("returns the username if the account exists", () => {
    expect(authkeyToUsername(1)).resolves.toBe("user");
    expect(authkeyToUsername(32)).resolves.toBe("user2");
  });

  it("returns undefined if the account doesn't exist", () => {
    expect(authkeyToUsername(0)).resolves.toBeUndefined();
    expect(authkeyToUsername(-1)).resolves.toBeUndefined();
  });
});

describe("usernameToAuthkey", () => {
  it("returns the authkey the account exists", () => {
    expect(usernameToAuthkey("user")).resolves.toBe(1);
    expect(usernameToAuthkey("user2")).resolves.toBe(32);
  });

  it("returns undefined if the account doesn't exist", () => {
    expect(usernameToAuthkey("nope")).resolves.toBeUndefined();
    expect(usernameToAuthkey("dontcreateme")).resolves.toBeUndefined();
  });
});

describe("getDataFromUsername", () => {
  it("returns data if the account exists", async () => {
    const validator = yup
      .array(
        yup
          .object({
            title: yup.string().required(),
            author: yup.string().required(),
            imgurl: yup.string().required(),
          })
          .noUnknown()
      )
      .strict();
    const data = await getDataFromUsername("user");
    expect(data.length).toBeGreaterThan(0);
    console.log(data);
    expect(validator.isValidSync(data)).toBe(true);
  });
  it("returns [] if the account doesn't exists", async () => {
    const data = await getDataFromUsername("1user");
    expect(data).toEqual([]);
  });
});

describe("testAccountExists", () => {
  it("returns true if the account exists", async () => {
    const exists = await testAccountExists("user");
    expect(exists).toBe(true);
  });
  it("returns false if the account doesn't exist", async () => {
    const exists = await testAccountExists("1user");
    expect(exists).toBe(false);
  });
});

describe("testUsernamePassword", () => {
  it("returns true if password correct", async () => {
    const correct = await testUsernamePassword("user", "password1");
    expect(correct).toBe(true);
  });
  it("returns false if password isn't correct", async () => {
    const correct = await testUsernamePassword("user", "notthecorrectpassword");
    expect(correct).toBe(false);
  });
});

describe("createNewAccount", () => {
  it("creates the account", async () => {
    const username = `newAccount${Math.floor(Math.random() * 100000)}`;
    const created = await createNewAccount(username, "easyPassword");
    expect(created).toBe(true);
    const correct = await testUsernamePassword(username, "easyPassword");
    expect(correct).toBe(true);
  });

  it("returns false if the account already exists", async () => {
    const created = await createNewAccount("user", "password1");
    expect(created).toBe(false);
  });
});
