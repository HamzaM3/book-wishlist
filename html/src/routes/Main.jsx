import { useState, useEffect } from "react";
import Book from "../component/Book";
import Welcome from "../component/Welcome";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { css } from "@emotion/react";

const titleStyle = css`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Main = () => {
  const { getBooks } = useApi();
  const { connected, authkey } = useAuthkey();

  const [books, setBooks] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (connected) setLoading(true);
  }, [authkey]);

  useEffect(() => {
    if (isLoading) {
      getBooks()
        .then(setBooks)
        .then(() => setLoading(false));
    }
  }, [isLoading]);

  if (!connected) {
    return <Welcome />;
  }

  return (
    <>
      <div css={titleStyle}>Your secret wishlist</div>
      {books.map(({ title, author, bookcover, id: bookId }) => (
        <Book
          {...{ title, author, bookcover, bookId, setLoading }}
          key={"book-" + bookId}
        />
      ))}
    </>
  );
};

export default Main;
