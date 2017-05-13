import axios from 'axios';

export const UPDATE_SELECTED_GAME = 'UPDATE_SELECTED_GAME';
export const UPDATE_DISPLAYED_GAMES = 'UPDATE_DISPLAYED_GAMES';
export const REQUEST_CREATE_GAME = 'REQUEST_CREATE_GAME';
export const RECEIVE_CREATE_GAME = 'REQUEST_CREATE_GAME';
export const REQUEST_UPDATE_PLAYERS_FOR_OPEN_GAME = 'REQUEST_UPDATE_PLAYERS_FOR_OPEN_GAME';
export const RECEIVE_UPDATE_PLAYERS_FOR_OPEN_GAME = 'RECEIVE_UPDATE_PLAYERS_FOR_OPEN_GAME';

export function updateSelectedGame(game) {
	return { type: UPDATE_SELECTED_GAME, game };
}

export function updateDisplayedGames(games) {
	return { type: UPDATE_DISPLAYED_GAMES, games };
}

function requestCreateGame() {
	return { type: REQUEST_CREATE_GAME };
}

function receiveCreateGame(data) {
	return { type: RECEIVE_CREATE_GAME, data };
}

function requestUpdatePlayersForOpenGame() {
	return { type: REQUEST_UPDATE_PLAYERS_FOR_OPEN_GAME };
}

function receiveUpdatePlayersForOpenGame(data) {
	return { type: RECEIVE_UPDATE_PLAYERS_FOR_OPEN_GAME, data };
}

export function createGame(postData) {
	return dispatch => {
		dispatch(requestCreateGame());
		return axios.post('/api/games', postData)
			.then(response => dispatch(receiveCreateGame(response.data)));
	};
}

export function updatePlayersForOpenGame(id, putData) {
	return dispatch => {
		dispatch(requestUpdatePlayersForOpenGame());
		return axios.put(`/api/games/${id}`, putData)
			.then(response => dispatch(receiveUpdatePlayersForOpenGame(response.data)));
	};
}
