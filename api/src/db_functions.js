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
        b.title,
        b.author,
        b.imgUrl
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
      console.log("hello");
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
  };
};

module.exports = db_functions;
