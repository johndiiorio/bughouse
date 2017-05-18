import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import store from './index';
import { updateDisplayedGames } from './actions/lobby';

export const socketLobby = io('/lobby');
export const socketLoading = io('/loading');
export const socketGame = io('/game');

socketLobby.on('update game list', () => {
	store.dispatch(updateDisplayedGames());
});

socketLoading.on('connect', () => {
	socketLoading.emit('room', store.getState().lobby.selectedGame.id);
});

socketLoading.on('begin game', () => {
	browserHistory.push('/game');
});
