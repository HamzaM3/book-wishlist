module.exports = (dbApi) => {
  return {
    getBooks: require("./getBooks")(dbApi),
    addBook: require("./addBook")(dbApi),
    getImage: require("./getImage")(dbApi),
    signIn: require("./signIn")(dbApi),
    signUp: require("./signUp")(dbApi),
    deleteBook: require("./deleteBook")(dbApi),
  };
};
