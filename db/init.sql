create table
  account (
    id serial not null unique,
    username varchar(32) primary key check (length(username) >= 4),
    pass varchar(32) not null check (length(pass) >= 8)
  );

insert into
  account (username, pass)
values
  ('user', 'password1');

insert into
  account (username, pass)
values
  ('test', 'hahajk23l');

insert into
  account (username, pass)
values
  ('cat2123', 'hellololol');

insert into
  account (username, pass)
values
  ('imauser', 'passlong');

create table
  book (
    id serial primary key,
    username varchar(32) references account (username),
    title text not null check (length(title) > 0),
    author text not null check (length(author) > 0),
    imgUrl text
  );

insert into
  book (username, title, author)
values
  (
    'user',
    'Einstein: His Life and Universe',
    'Walter Isaacson',
  );

insert into
  book (username, title, author)
values
  (
    'user',
    'Gandhi: An Autobiography',
    'Mahatma Gandhi',
  );

insert into
  book (username, title, author)
values
  ('test', 'A. Lincoln', 'Ronald C. White Jr.',);

insert into
  book (username, title, author, imgUrl)
values
  (
    'test',
    'The Rise of Theodore Roosevelt',
    'Edmund Morris',
  );