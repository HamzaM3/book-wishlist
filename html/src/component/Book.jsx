const Book = ({ imgUrl, title, author }) => {
  return (
    <div className="book">
      <img className="book-img" src={imgUrl} alt={title + " book cover"} />
      <div className="book-title">{title}</div>
      <div className="book-author">{author}</div>
    </div>
  );
};

export default Book;
