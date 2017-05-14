UPDATE games
SET
	${playerPosition~} = ${player}
WHERE id = ${id};
