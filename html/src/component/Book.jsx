import { useAuthkey } from "../contexts/Authkey";
import { useApi } from "../contexts/Api";
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import CrossSVG from "../svg/Cross";

const bookStyle = css`
  width: 30%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  height: 150px;

  border: 3px solid white;
  border-radius: 20px;
  padding: 10px;
  gap: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const imgStyle = css`
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const titleStyle = css`
  font-size: 20px;
  font-weight: 500;
`;

const authorStyle = css`
  font-size: 15px;
  font-weight: 300;
`;

const detailsStyle = css`
  grid-row: 1;
  grid-column: 2;
`;

const crossStyle = css`
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  justify-self: end;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Book = ({ bookcover, title, author, bookId, setLoading }) => {
  const [imageSrc, setImageSrc] = useState("");
  const { deleteBook, getImage } = useApi();

  useEffect(() => {
    (async () => {
      if (bookcover) {
        const image = await getImage({ image: bookcover });
        console.log(image);
        setImageSrc("data:image/jpg;base64, " + image);
      }
    })();
  }, [bookcover]);

  const deleteClick = async (bookId) => {
    await deleteBook({ id: bookId });
    setLoading(true);
  };

  return (
    <div css={bookStyle}>
      <img css={imgStyle} src={imageSrc} alt={title + " book cover"} />
      <div css={detailsStyle}>
        <div css={titleStyle}>{title}</div>
        <div css={authorStyle}>by {author}</div>
      </div>
      <div css={crossStyle} onClick={() => deleteClick(bookId)}>
        <CrossSVG />
      </div>
    </div>
  );
};

export default Book;
