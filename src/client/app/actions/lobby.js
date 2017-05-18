import axios from 'axios';
import { browserHistory } from 'react-router';
import { socketLobby, socketLoading } from '../socket';

export const UPDATE_SELECTED_GAME = 'UPDATE_SELECTED_GAME';
export const UPDATE_MODAL_DISPLAYED_GAME = 'UPDATE_MODAL_DISPLAYED_GAME';
export const TOGGLE_MODAL_DISPLAY = 'TOGGLE_MODAL_DISPLAY';
export const REQUEST_CREATE_GAME = 'REQUEST_CREATE_GAME';
export const REQUEST_GAMES_INFO = 'REQUEST_GAMES_INFO';
export const RECEIVE_GAMES_INFO = 'RECEIVE_GAMES_INFO';

export function updateSelectedGame(game) {
	socketLoading.emit('room', game.id);
	socketLobby.emit('update game list');
	browserHistory.push('/loading');
	return { type: UPDATE_SELECTED_GAME, game };
}

export function updateModalDisplayedGame(game) {
	return { type: UPDATE_MODAL_DISPLAYED_GAME, game };
}

export function toggleModalDisplay() {
	return { type: TOGGLE_MODAL_DISPLAY };
}

function requestGamesInfo() {
	return { type: REQUEST_GAMES_INFO };
}

function receiveGamesInfo(data) {
	return { type: RECEIVE_GAMES_INFO, data };
}

function requestCreateGame() {
	return { type: REQUEST_CREATE_GAME };
}

export function createGame(postData) {
	return dispatch => {
		dispatch(requestCreateGame());
		return axios.post('/api/games', postData)
			.then(response => dispatch(updateSelectedGame(response.data)));
	};
}

export function updateDisplayedGames() {
	return dispatch => {
		dispatch(requestGamesInfo());
		return axios.get('/api/games/open')
			.then(response => dispatch(receiveGamesInfo(response.data)));
	};
}
