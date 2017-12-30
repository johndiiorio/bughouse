SELECT
	g.id,
	g.minutes,
	g.increment,
	g.rating_range AS "ratingRange",
	g.mode,
	g.status,
	g.timestamp,
	g.join_random AS "joinRandom",
	player1.id AS player1id,
	player1.username AS player1username,
	player1.title AS player1title,
	player1.rating_bullet AS "player1ratingBullet",
	player1.rating_blitz AS "player1ratingBlitz",
	player1.rating_classical AS "player1ratingClassical",
	player2.id AS player2id,
	player2.username AS player2username,
	player2.title AS player2title,
	player2.rating_bullet AS "player2ratingBullet",
	player2.rating_blitz AS "player2ratingBlitz",
	player2.rating_classical AS "player2ratingClassical",
	player3.id AS player3id,
	player3.username AS player3username,
	player3.title AS player3title,
	player3.rating_bullet AS "player3ratingBullet",
	player3.rating_blitz AS "player3ratingBlitz",
	player3.rating_classical AS "player3ratingClassical",
	player4.id AS player4id,
	player4.username AS player4username,
	player4.title AS player4title,
	player4.rating_bullet AS "player4ratingBullet",
	player4.rating_blitz AS "player4ratingBlitz",
	player4.rating_classical AS "player4ratingClassical"
FROM games AS g
	LEFT JOIN users_with_most_recent_ratings player1 ON g.player1 = player1.id
	LEFT JOIN users_with_most_recent_ratings player2 ON g.player2 = player2.id
	LEFT JOIN users_with_most_recent_ratings player3 ON g.player3 = player3.id
	LEFT JOIN users_with_most_recent_ratings player4 ON g.player4 = player4.id
WHERE status = 'open'
ORDER by timestamp ASC;
