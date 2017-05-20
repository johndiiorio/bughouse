import axios from 'axios';

export const UPDATE_MOVES = 'UPDATE_MOVES';
export const RECEIVE_GAME_INFO = 'RECEIVE_GAME_INFO';

export function updateMoves(moves) {
	return { type: UPDATE_MOVES, moves };
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
