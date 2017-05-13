import * as lobbyActions from '../actions/lobby';

const defaultState = {
	gameID: null,
	selectedGame: {},
	displayedGames: []
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case lobbyActions.UPDATE_SELECTED_GAME:
			return {
				...state,
				selectedGame: action.game
			};
		case lobbyActions.UPDATE_DISPLAYED_GAMES:
			return {
				...state,
				displayedGames: action.games
			};
		case lobbyActions.RECEIVE_CREATE_GAME:
			return {
				...state,
				gameID: action.data.id
			};
		case lobbyActions.RECEIVE_UPDATE_PLAYERS_FOR_OPEN_GAME:
			return {
				// TODO
			};
		default:
			return state;
	}
}
