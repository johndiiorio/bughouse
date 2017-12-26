import * as leaderBoardActions from '../actions/leaderBoard';

const defaultState = {
	isFetching: false,
	data: {}
};

export default function leaderBoard(state = defaultState, action) {
	switch (action.type) {
		case leaderBoardActions.REQUEST_LEADER_BOARD:
			return {
				...state,
				isFetching: true
			};
		case leaderBoardActions.RECEIVE_LEADER_BOARD:
			return {
				...state,
				isFetching: false,
				data: action.data
			};
		default:
			return state;
	}
}
