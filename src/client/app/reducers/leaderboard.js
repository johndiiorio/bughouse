import * as leaderboardActions from '../actions/leaderboard';

const defaultState = {
	isFetching: false,
	hasFetched: false,
	data: {
		bullet: [],
		blitz: [],
		classical: []
	}
};

export default function leaderboard(state = defaultState, action) {
	switch (action.type) {
		case leaderboardActions.REQUEST_LEADERBOARD:
			return {
				...state,
				isFetching: true
			};
		case leaderboardActions.RECEIVE_LEADERBOARD:
			return {
				...state,
				isFetching: false,
				hasFetched: true,
				data: action.data
			};
		default:
			return state;
	}
}
