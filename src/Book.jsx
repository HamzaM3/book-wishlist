export default ({ imgUrl, title, author }) => {
  return (
    <div>
      <img src={imgUrl} alt={title + " book cover"} />
      <div>{title}</div>
      <div>{author}</div>
    </div>
  );
};
