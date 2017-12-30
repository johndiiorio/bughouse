SELECT
  username,
  title,
  rating_blitz AS rating
FROM users_with_most_recent_ratings
ORDER BY rating_blitz DESC
LIMIT 10;
