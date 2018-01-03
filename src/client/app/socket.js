import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import store from './index';
import { toggleUserWaitingForGameToStart, updateDisplayedGames } from './actions/lobby';
import { updateDisplayResignChoice, updateDisplayDrawChoice } from './actions/game';
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
		|| (userPosition1 === userPosition2)
	);
}

socketLobby.on('update game list', () => {
	store.dispatch(updateDisplayedGames());
});

socketLoading.on('start game', id => {
	store.dispatch(toggleUserWaitingForGameToStart());
	playSound('notify');
	browserHistory.push(`/game/${id}`);
});

socketGame.on('offer resign', resigningUserPosition => {
	if (onSameTeam(store.getState().game.userPosition, resigningUserPosition)) {
		store.dispatch(updateDisplayResignChoice(true));
	}
});

socketGame.on('offer draw', () => {
	store.dispatch(updateDisplayDrawChoice(true));
});

socketGame.on('decline resign', decliningUserPosition => {
	if (onSameTeam(store.getState().game.userPosition, decliningUserPosition)) {
		store.dispatch(updateDisplayResignChoice(false));
	}
});

socketGame.on('decline draw', () => {
	store.dispatch(updateDisplayDrawChoice(false));
});
