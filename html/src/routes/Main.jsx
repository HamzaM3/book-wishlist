import { useState, useEffect } from "react";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";

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
      {books.map(({ title, author, imgUrl }) => {
        return (
          <div className="book" key={`${title}-${author}-${imgUrl}`}>
            <div>{title}</div>
            <div>{author}</div>
          </div>
        );
      })}
    </>
  );
};

export default Main;
