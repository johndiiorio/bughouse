SELECT
	id,
	username,
	email,
	title,
	ratingBullet,
	rdBullet,
	ratingBlitz,
	rdBlitz,
	ratingClassical,
	rdClassical
FROM users
WHERE user_id IN(${id1}, ${id2}, ${id3}, ${id4});
