import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import store from './index';
import { updateDisplayedGames } from './actions/lobby';
import playSound from './util/sound';

export const socketLobby = io('/lobby');
export const socketLoading = io('/loading');
export const socketGame = io('/game');

socketLobby.on('update game list', () => {
	store.dispatch(updateDisplayedGames());
});

socketLoading.on('start game', id => {
	playSound('notify');
	browserHistory.push(`/game/${id}`);
});
