SELECT
  username,
  title,
	rating_classical AS rating
FROM users_with_most_recent_ratings
ORDER BY rating_classical DESC
LIMIT 10;
