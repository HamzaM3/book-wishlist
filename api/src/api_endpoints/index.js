module.exports = (dbApi) => {
  return {
    getBooks: require("./getBooks")(dbApi),
    addBook: require("./addBook")(dbApi),
    signIn: require("./signIn")(dbApi),
    signUp: require("./signUp")(dbApi),
    deleteBook: require("./deleteBook")(dbApi),
  };
};
