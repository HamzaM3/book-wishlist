select
  username
from
  account
where
  id = 1;

select
  b.title,
  b.author
from
  book b
where
  b.username = (
    select
      a.username
    from
      account a
    where
      a.username = 'user'
  );