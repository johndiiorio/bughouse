SELECT
  username,
  title,
	rating_bullet AS rating
FROM users u
  INNER JOIN most_recent_ratings r
ON u.id = r.user_id
ORDER BY rating_bullet DESC
LIMIT 10;
