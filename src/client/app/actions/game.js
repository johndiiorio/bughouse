import axios from 'axios';

export const UPDATE_MOVES = 'UPDATE_MOVES';
export const RECEIVE_GAME_INFO = 'RECEIVE_GAME_INFO';

export function updateMoves(moves) {
	return { type: UPDATE_MOVES, moves };
}

export function receiveGameInfo(data) {
	return {type: RECEIVE_GAME_INFO, data};
}


export function getGameInfo() {
	return (dispatch, getState) => axios.get(`/api/games/withUsers/${getState().lobby.selectedGame.id}`).then(response => dispatch(receiveGameInfo(response.data)));
}
