create table account (
  id serial not null unique,
  username varchar(32) primary key check (length(username) >= 4),
  pass varchar(32) not null check (length(pass) >= 8)
);

insert into account(username, pass) values ('user', 'password1');
insert into account(username, pass) values ('test', 'hahajk23l');
insert into account(username, pass) values ('cat2123', 'hellololol');
insert into account(username, pass) values ('imauser', 'passlong');

create table book (
  id serial primary key,
  username varchar(32) references account(username),
  title text not null check (length(title) > 0),
  author text not null check (length(author) > 0),
  imgUrl text
);

insert into book(username, title, author, imgUrl) values (
  'user',
  'Einstein: His Life and Universe',
  'Walter Isaacson',
  'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1328011405l/10884.jpg'
);

insert into book(username, title, author, imgUrl) values (
  'user',
  'Gandhi: An Autobiography',
  'Mahatma Gandhi',
  'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320560971l/112803.jpg'
);

insert into book(username, title, author, imgUrl) values (
  'test',
  'A. Lincoln',
  'Ronald C. White Jr.',
  'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1425598216l/4059448.jpg'
);

insert into book(username, title, author, imgUrl) values (
  'test',
  'The Rise of Theodore Roosevelt',
  'Edmund Morris',
  'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586402749l/40929._SY475_.jpg'
);
