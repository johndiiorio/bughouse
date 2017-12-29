SELECT
	u.id,
	username,
	email,
	title,
	rating_bullet,
	rd_bullet,
	rating_blitz,
	rd_blitz,
	rating_classical,
	rd_classical
FROM users u
INNER JOIN (
		SELECT id, rating AS rating_bullet
		FROM most_recent_bullet_ratings
	) AS rbullet
ON rbullet.id = u.id
INNER JOIN (
	SELECT id, rating AS rating_blitz
		FROM most_recent_blitz_ratings
	) AS rblitz
ON rblitz.id = u.id
INNER JOIN (
	SELECT id, rating AS rating_classical
		FROM most_recent_classical_ratings
	) AS rclassical
ON rclassical.id = u.id
WHERE u.id = ${id};
