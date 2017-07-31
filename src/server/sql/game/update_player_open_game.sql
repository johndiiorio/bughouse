UPDATE games
SET
	${playerPosition~} = ${player},
	${playerRatingColumn~} = ${userRating}
WHERE id = ${id};
