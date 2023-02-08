const fs = require("fs");
const path = require("path");

const db_functions = (db) => {
  const authkeyToUsername = async (authkey) => {
    const queryResult = await db.any(`
      select
        username
      from
        account
      where
        id = $security$${authkey}$security$;
    `);
    if (queryResult.length === 0) return undefined;
    else return queryResult[0].username;
  };

  const usernameToAuthkey = async (username) => {
    const queryResult = await db.any(`
      select id
      from account
      where 
        username = $security$${username}$security$
    `);
    if (queryResult.length === 0) return undefined;
    else return queryResult[0].id;
  };

  const getDataFromUsername = async (username) => {
    return db.any(`
      select
        b.id,
        b.title,
        b.author,
        b.bookcover
      from
        book b
      where
        b.username = $security$${username}$security$;
    `);
  };

  const testAccountExists = async (username) => {
    const queryResult = await db.any(`
      select
        id
      from
        account
      where
        username = $security$${username}$security$;
    `);
    return queryResult.length !== 0;
  };

  const testUsernamePassword = async (username, password) => {
    const [{ valid }] = await db.any(`
      select
        count(*) as valid
      from
        account
      where
        username = $security$${username}$security$ and pass = $security$${password}$security$;
    `);
    return valid > 0;
  };

  const testAuthorizedToAccessImage = async (username, bookcover) => {
    const [{ valid }] = await db.any(`
      select
        count(*) as valid
      from
        book
      where
        username = $security$${username}$security$ and bookcover = $security$${bookcover}$security$;
    `);

    return valid > 0;
  };

  const testAuthorizedToAccessBook = async (username, id) => {
    const [{ valid }] = await db.any(`
      select
        count(*) as valid
      from
        book
      where
        username = $security$${username}$security$ and id = $security$${id}$security$;
    `);

    return valid > 0;
  };

  const createNewAccount = async (username, password) => {
    try {
      await db.none(`
      insert 
        into account(username, pass)
        values (
          $security$${username}$security$,
          $security$${password}$security$
        )
      `);
      return true;
    } catch (e) {
      return false;
    }
  };

  const createNewBook = async (title, author, filename, authkey) => {
    const username = await authkeyToUsername(authkey);

    try {
      await db.none(`
      insert 
        into book(username, title, author${filename ? ", bookcover" : ""})
        values (
          $security$${username}$security$,
          $security$${title}$security$,
          $security$${author}$security$
          ${filename ? `, $security$${filename}$security$` : ""}
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
      const bookcover = await getImageFromId(id);

      if (bookcover)
        await fs.unlinkSync(
          path.resolve(__dirname, "../bookCovers", bookcover)
        );

      await db.none(`
        delete from book where id = $security$${id}$security$
      `);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getImageFromId = async (id) => {
    const [{ bookcover }] = await db.any(`
      select bookcover from book where id = $security$${id}$security$
    `);

    return bookcover;
  };

  return {
    authkeyToUsername,
    usernameToAuthkey,
    getDataFromUsername,
    testAccountExists,
    testUsernamePassword,
    createNewAccount,
    createNewBook,
    testAuthorizedToAccessImage,
    deleteBookFromId,
    testAuthorizedToAccessBook,
    getImageFromId,
  };
};

module.exports = db_functions;
