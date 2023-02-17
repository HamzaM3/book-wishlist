import { useState, useEffect } from "react";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { css } from "@emotion/react";
import { useRSA } from "../contexts/RSA";
import CrossSVG from "../svg/Cross";

const bookStyle = css`
  min-width: 30%;
  display: grid;
  grid-template-columns: 1fr;
  height: 70px;

  border: 3px solid white;
  border-radius: 10px;
  padding: 10px 20px;
  gap: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const bookTitleStyle = css`
  font-size: 20px;
  font-weight: 500;
`;

const authorStyle = css`
  font-size: 15px;
  font-weight: 300;
`;

const detailsStyle = css`
  grid-row: 1;
  grid-column: 1;
`;

const crossStyle = css`
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  justify-self: end;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const titleStyle = css`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const welcomeStyle = css`
  font-weight: 600;
  font-size: 40px;
  text-align: right;
`;

const Main = () => {
  const { getBooks, deleteBook } = useApi();
  const { connected, authkey } = useAuthkey();
  const RSA = useRSA();

  const [books, setBooks] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (connected) setLoading(true);
  }, [authkey]);

  useEffect(() => {
    if (!RSA.isLoading && isLoading && connected) {
      getBooks()
        .then(setBooks)
        .then(() => setLoading(false));
    }
  }, [isLoading, RSA.isLoading]);

  if (RSA.isLoading) {
    return <div>Key generation ongoing</div>;
  }

  if (!connected) {
    return <div css={welcomeStyle}>Create your secure book wishlist !</div>;
  }

  return (
    <>
      <div css={titleStyle}>Your secret wishlist</div>
      {books.map(({ title, author, id: bookId }) => {
        const deleteClick = async (bookId) => {
          await deleteBook({ id: bookId });
          setLoading(true);
        };

        return (
          <div css={bookStyle} key={"book-" + bookId}>
            <div css={detailsStyle}>
              <div css={bookTitleStyle}>{title}</div>
              <div css={authorStyle}>by {author}</div>
            </div>
            <div css={crossStyle} onClick={() => deleteClick(bookId)}>
              <CrossSVG />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Main;
