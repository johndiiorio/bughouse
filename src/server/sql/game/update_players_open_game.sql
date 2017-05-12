UPDATE games
SET
	player1 = ${player1ID},
	player2 = ${player2ID},
	player3 = ${player3ID},
	player4 = ${player4ID}
WHERE id = ${gameID};
