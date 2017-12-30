SELECT
  username,
  title,
	rating_bullet AS rating
FROM users_with_most_recent_ratings
ORDER BY rating_bullet DESC
LIMIT 10;
