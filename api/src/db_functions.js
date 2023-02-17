const fs = require("fs");
const path = require("path");
const forge = require("node-forge");

const { getBytesSync } = forge.random;
const { bytesToHex } = forge.util;

const getSecurity = () =>
  bytesToHex(getBytesSync(16))
    .split("")
    .filter((x) => !/[0-9]/.test(x))
    .join("");

const db_functions = (db) => {
  const authkeyToUsername = async (authkey) => {
    const security = getSecurity();
    const queryResult = await db.any(`
      select
        username
      from
        account
      where
        authkey = $${security}$${authkey}$${security}$;
    `);
    if (queryResult.length === 0) return undefined;
    else return queryResult[0].username;
  };

  const usernameToAuthkey = async (username) => {
    const security = getSecurity();
    console.log(username);
    const queryResult = await db.any(`
      select authkey
      from account
      where 
        username = $${security}$${username}$${security}$
    `);
    console.log(queryResult);
    if (queryResult.length === 0) return undefined;
    else return queryResult[0].authkey;
  };

  const getDataFromUsername = async (authkey) => {
    const security = getSecurity();
    return db.any(`
      select
        b.id,
        b.title,
        b.author
      from
        book b
      where
        b.authkey = $${security}$${authkey}$${security}$;
    `);
  };

  const testAccountExists = async (username) => {
    const security = getSecurity();
    const queryResult = await db.any(`
      select
        authkey
      from
        account
      where
        username = $${security}$${username}$${security}$;
    `);
    return queryResult.length !== 0;
  };

  const testUsernamePassword = async (username, hashedPass) => {
    const security = getSecurity();

    const [{ valid }] = await db.any(`
      select
        count(*) as valid
      from
        account
      where
        username = $${security}$${username}$${security}$
        and 
        hashedPass = $${security}$${hashedPass}$${security}$;
    `);
    return valid > 0;
  };

  const testAuthorizedToAccessBook = async (authkey, id) => {
    const security = getSecurity();
    const [{ valid }] = await db.any(`
      select
        count(*) as valid
      from
        book
      where
        authkey = $${security}$${authkey}$${security}$
        and
        id = $${security}$${id}$${security}$;
    `);

    return valid > 0;
  };

  const createNewAccount = async (username, hashedPass, authkey) => {
    const security = getSecurity();
    try {
      await db.none(`
      insert 
        into account(username, hashedPass, authkey)
        values (
          $${security}$${username}$${security}$,
          $${security}$${hashedPass}$${security}$,
          $${security}$${authkey}$${security}$
        )
      `);
      return true;
    } catch (e) {
      return false;
    }
  };

  const createNewBook = async (title, author, authkey) => {
    const security = getSecurity();
    try {
      await db.none(`
      insert 
        into book(authkey, title, author)
        values (
          $${security}$${authkey}$${security}$,
          $${security}$${title}$${security}$,
          $${security}$${author}$${security}$
        )
      `);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const deleteBookFromId = async (id) => {
    try {
      const security = getSecurity();

      await db.none(`
        delete from book where id = $${security}$${id}$${security}$
      `);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  return {
    authkeyToUsername,
    usernameToAuthkey,
    getDataFromUsername,
    testAccountExists,
    testUsernamePassword,
    createNewAccount,
    createNewBook,
    deleteBookFromId,
    testAuthorizedToAccessBook,
  };
};

module.exports = db_functions;
