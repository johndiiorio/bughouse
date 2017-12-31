SELECT
	rating_type,
	rating,
	rating_timestamp
FROM ratings r
INNER JOIN users u ON u.id = r.user_id
WHERE u.username = ${username}
ORDER BY rating_type, rating_timestamp;
