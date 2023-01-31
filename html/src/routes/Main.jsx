import { useState, useEffect } from "react";
import Book from "../component/Book";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";

const getKey = (title, author, occurences) => {
  return title + "-" + author + "-" + occurences[title + author];
};

const getBookList = (books) => {
  const occurences = {};
  const res = [];

  for (let i = 0; i < books.length; i++) {
    const { title, author, imgUrl } = books[i];
    occurences[title + author] = occurences[title + author]
      ? occurences[title + author] + 1
      : 1;
    res.push(
      <Book
        {...{ title, author, imgUrl }}
        key={getKey(title, author, occurences)}
      />
    );
  }
  return res;
};

const Main = () => {
  const { getBooks } = useApi();
  const { connected, authkey } = useAuthkey();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (connected) getBooks().then(setBooks);
  }, [authkey]);

  if (!connected) {
    return <div>Create your private book wishlist</div>;
  }

  return (
    <>
      <div className="wishlist-title">Your secret wishlist</div>
      {getBookList(books)}
    </>
  );
};

export default Main;
