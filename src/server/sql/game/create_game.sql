INSERT INTO games
(id, minutes, increment, rating_range, mode, status, timestamp, join_random, player1, player2, player3, player4)
VALUES (
	${gameID},
	${minutes},
	${increment},
	${ratingRange},
	${mode},
	${status},
	${timestamp},
	${joinRandom},
	${player1},
	${player2},
	${player3},
	${player$}
);
