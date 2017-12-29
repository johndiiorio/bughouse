SELECT
	u.id,
	username,
	email,
	title,
	rd_bullet,
	rd_blitz,
	rd_classical,
	rating_bullet,
	rating_blitz,
	rating_classical
FROM users u
	INNER JOIN (
	SELECT
	 rclassical.id,
	 rating_bullet,
	 rating_blitz,
	 rating_classical
	FROM (
		SELECT
			id,
			rating AS rating_bullet
		FROM ratings
		WHERE rating_type = 'bullet'
		ORDER BY rating_timestamp DESC
		LIMIT 1
	) AS rbullet
	INNER JOIN (
		SELECT
			id,
			rating AS rating_blitz
		FROM ratings
		WHERE rating_type = 'blitz'
		ORDER BY rating_timestamp DESC
		LIMIT 1
	) AS rblitz
	ON rbullet.id = rblitz.id
	INNER JOIN (
		SELECT
			id,
			rating AS rating_classical
		FROM ratings
		WHERE rating_type = 'classical'
		ORDER BY rating_timestamp DESC
		LIMIT 1
	) AS rclassical
	ON rblitz.id = rclassical.id
	WHERE rclassical.id IN (1, 2, 3, 4)
	) AS r
	ON u.id = r.id
WHERE u.id IN (1, 2, 3, 4);
