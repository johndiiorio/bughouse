import axios from 'axios';

export const UPDATE_MOVES = 'UPDATE_MOVES';
export const UPDATE_CLOCKS = 'UPDATE_CLOCKS';
export const UPDATE_RESERVES = 'UPDATE_RESERVES';
export const UPDATE_BOARD1_CONFIG = 'UPDATE_BOARD1_CONFIG';
export const UPDATE_BOARD2_CONFIG = 'UPDATE_BOARD2_CONFIG';
export const UPDATE_PIECE_TO_DRAG_FROM_RESERVE = 'UPDATE_PIECE_TO_DRAG_FROM_RESERVE';
export const RECEIVE_GAME_INFO = 'RECEIVE_GAME_INFO';

export function updateMoves(moves) {
	return { type: UPDATE_MOVES, moves };
}

export function updateClocks(clocks) {
	return { type: UPDATE_CLOCKS, clocks };
}

export function updateBoard1Config(config) {
	return { type: UPDATE_BOARD1_CONFIG, config };
}

export function updateBoard2Config(config) {
	return { type: UPDATE_BOARD2_CONFIG, config };
}

// Each reserve is an array of objects of type { color, role }
export function updateReserves(leftWhite, leftBlack, rightWhite, rightBlack) {
	return { type: UPDATE_RESERVES, leftWhite, leftBlack, rightWhite, rightBlack };
}

export function updatePieceToDragFromReserve(piece) {
	return { type: UPDATE_PIECE_TO_DRAG_FROM_RESERVE, piece };
}

export function receiveGameInfo(data, userID) {
	return { type: RECEIVE_GAME_INFO, data, userID };
}

export function getGameInfo() {
	return (dispatch, getState) => {
		const state = getState();
		axios.get(`/api/games/withUsers/${state.lobby.selectedGame.id}`)
			.then(response => {
				dispatch(receiveGameInfo(response.data, state.user.currentUser.id));
			});
	};
}
