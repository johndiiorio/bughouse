INSERT INTO games
(id, minutes, increment, rating_range, mode, status, timestamp, join_random, player1, player2, player3, player4)
VALUES (
	${id},
	${minutes},
	${increment},
	${ratingRange},
	${mode},
	${status},
	now(),
	${joinRandom},
	${player1},
	${player2},
	${player3},
	${player4}
)
ON CONFLICT DO NOTHING;
