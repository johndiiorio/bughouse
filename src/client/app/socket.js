import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import store from './index';
import { updateDisplayedGames } from './actions/lobby';
import { updateDisplayResignChoice } from './actions/game';
import playSound from './util/sound';

export const socketLobby = io('/lobby');
export const socketLoading = io('/loading');
export const socketGame = io('/game');

function onSameTeam(userPosition1, userPosition2) {
	return (
		(userPosition1 === 1 && userPosition2 === 4)
		|| (userPosition1 === 2 && userPosition2 === 3)
		|| (userPosition1 === 3 && userPosition2 === 2)
		|| (userPosition1 === 4 && userPosition2 === 1)
	);
}

socketLobby.on('update game list', () => {
	store.dispatch(updateDisplayedGames());
});

socketLoading.on('start game', id => {
	playSound('notify');
	browserHistory.push(`/game/${id}`);
});

socketGame.on('offer resign', resigningUserPosition => {
	const userPosition = store.getState().game.userPosition;
	if (onSameTeam(userPosition, resigningUserPosition)) {
		store.dispatch(updateDisplayResignChoice(true));
	}
});
