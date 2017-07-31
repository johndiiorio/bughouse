SELECT
	g.id,
	g.minutes,
	g.increment,
	g.rating_range AS "ratingRange",
	g.mode,
	g.status,
	g.timestamp,
	g.join_random AS "joinRandom",
	g.player1_rating AS "player1rating",
	g.player2_rating AS "player2rating",
	g.player3_rating AS "player3rating",
	g.player4_rating AS "player4rating",
	player1.id AS player1id,
	player1.username AS player1username,
	player1.title AS player1title,
	player2.id AS player2id,
	player2.username AS player2username,
	player2.title AS player2title,
	player3.id AS player3id,
	player3.username AS player3username,
	player3.title AS player3title,
	player4.id AS player4id,
	player4.username AS player4username,
	player4.title AS player4title
FROM games AS g
	LEFT JOIN users player1 ON g.player1 = player1.id
	LEFT JOIN users player2 ON g.player2 = player2.id
	LEFT JOIN users player3 ON g.player3 = player3.id
	LEFT JOIN users player4 ON g.player4 = player4.id
WHERE g.id = ${id};
