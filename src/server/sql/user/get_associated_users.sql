SELECT
  new_ratings.user_id AS user_id,
  -- I use max here because max(2, null) = 2. It really could be any aggregate with that property
  -- Note that when FILTER sends zero arguments to max(), it returns null (I checked).

  -- The FILTER clauses only feed rows that satisfy the filter to the function, so bullet_rating
  -- will get the max rating that is a bullet rating. There's only 1 from the subquery, so it's that one.
  -- The others work the same way.
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'bullet') AS bullet_rating,
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'blitz') AS blitz_rating,
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'classical') AS classical_rating
FROM
-- This subquery gets exactly 1 row for each (user_id, rating_type) pair. The row contains the rating.
(
  SELECT
  -- DISTINCT ON only gets the first row where all the columns match
  DISTINCT ON (u.id, rts.rating_type)
  u.id as user_id,
  rts.rating_type as rating_type,
  rts.rating as rating
  FROM users u
  -- LEFT JOIN so we get a row for users with no ratings
  LEFT JOIN ratings rts ON u.id = rts.id
  -- This must start with the columns in the DISTINCT ON, and then we add rating_timestamp to get what we want.
  ORDER BY u.id, rts.rating_type, rts.rating_timestamp
) new_ratings
GROUP BY new_ratings.user_id;
