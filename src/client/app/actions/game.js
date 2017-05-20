export const UPDATE_MOVES = 'UPDATE_MOVES';

export function updateMoves(moves) {
	return { type: UPDATE_MOVES, moves };
}
