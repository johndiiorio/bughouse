SELECT
  username,
  title,
  rating AS rating
FROM users u
  INNER JOIN most_recent_classical_ratings r
ON u.id = r.id
ORDER BY rating DESC
LIMIT 10;
