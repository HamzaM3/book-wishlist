create table
  account (
    authkey text not null unique,
    username text not null unique check (length(username) >= 4),
    hashedPass text not null unique
  );

create table
  book (
    id serial primary key,
    authkey text references account (authkey),
    title text not null check (length(title) > 0),
    author text not null check (length(author) > 0),
    bookcover text
  );