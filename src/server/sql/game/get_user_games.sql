SELECT
	g.id,
	g.minutes,
	g.increment,
	g.termination,
	g.mode,
	g.left_fens AS "leftFens",
	g.right_fens AS "rightFens",
	player1.title AS "player1Title",
	player1.username AS "player1Username",
	g.player1_rating AS "player1Rating",
	player2.title AS "player2Title",
	player2.username AS "player2Username",
	g.player2_rating AS "player2Rating",
	player3.title AS "player3Title",
	player3.username AS "player3Username",
	g.player3_rating AS "player3Rating",
	player4.title AS "player4Title",
	player4.username AS "player4Username",
	g.player4_rating AS "player4Rating"
FROM games AS g
	LEFT JOIN users player1 ON g.player1 = player1.id
	LEFT JOIN users player2 ON g.player2 = player2.id
	LEFT JOIN users player3 ON g.player3 = player3.id
	LEFT JOIN users player4 ON g.player4 = player4.id
WHERE
	(player1 = ${id} OR player2 = ${id} OR player3 = ${id} OR player4 = ${id})
	AND status = 'terminated'
ORDER BY g.timestamp DESC;
