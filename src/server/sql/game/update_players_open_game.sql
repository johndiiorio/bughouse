UPDATE games
SET
	player1 = ${player1},
	player2 = ${player2},
	player3 = ${player3},
	player4 = ${player4}
WHERE id = ${gameID};
