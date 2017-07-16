import axios from 'axios';

export const UPDATE_MOVES = 'UPDATE_MOVES';
export const UPDATE_CLOCKS = 'UPDATE_CLOCKS';
export const UPDATE_RESERVES = 'UPDATE_RESERVES';
export const UPDATE_PIECE_TO_DRAG_FROM_RESERVE = 'UPDATE_PIECE_TO_DRAG_FROM_RESERVE';
export const RECEIVE_GAME_INFO = 'RECEIVE_GAME_INFO';
export const UPDATE_DISPLAY_RESIGN_CHOICE = 'UPDATE_DISPLAY_RESIGN_CHOICE';
export const UPDATE_DISPLAY_DRAW_CHOICE = 'UPDATE_DISPLAY_DRAW_CHOICE';

export function updateMoves(moves) {
	return { type: UPDATE_MOVES, moves };
}

export function updateClocks(clocks) {
	return { type: UPDATE_CLOCKS, clocks };
}

// Each reserve is an array of objects of type { color, role }
export function updateReserves(leftWhite, leftBlack, rightWhite, rightBlack) {
	return { type: UPDATE_RESERVES, leftWhite, leftBlack, rightWhite, rightBlack };
}

export function updatePieceToDragFromReserve(piece) {
	return { type: UPDATE_PIECE_TO_DRAG_FROM_RESERVE, piece };
}

export function receiveGameInfo(data, userPosition) {
	return { type: RECEIVE_GAME_INFO, data, userPosition };
}

export function updateDisplayResignChoice(display) {
	return { type: UPDATE_DISPLAY_RESIGN_CHOICE, display };
}

export function updateDisplayDrawChoice(display) {
	return { type: UPDATE_DISPLAY_DRAW_CHOICE, display };
}

export function getGameInfo(id) {
	return (dispatch, getState) => {
		const state = getState();
		axios.put(`/api/games/withUsers/${state.lobby.selectedGame.id || id}`, { token: localStorage.getItem('token') })
			.then(response => {
				dispatch(receiveGameInfo(response.data, response.data.userPosition));
			});
	};
}
