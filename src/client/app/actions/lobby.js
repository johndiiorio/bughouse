import axios from 'axios';

export const REQUEST_CREATE_GAME = 'REQUEST_CREATE_GAME';
export const RECEIVE_CREATE_GAME = 'REQUEST_CREATE_GAME';

function requestCreateGame() {
	return { type: REQUEST_CREATE_GAME };
}

function receiveCreateGame(data) {
	return { type: RECEIVE_CREATE_GAME, data };
}

export function createGame(postData) {
	return dispatch => {
		dispatch(requestCreateGame());
		return axios.post('/api/games', postData)
			.then(response => dispatch(receiveCreateGame(response.data)));
	};
}
