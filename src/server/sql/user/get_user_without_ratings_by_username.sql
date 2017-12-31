SELECT
	id,
	username,
	email,
	title,
	rd_bullet,
	rd_blitz,
	rd_classical
FROM users
WHERE username = ${username};
