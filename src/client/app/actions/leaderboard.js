import axios from 'axios';
import { showErrorNotification } from '../util/notifications';

export const REQUEST_LEADERBOARD = 'REQUEST_LEADERBOARD';
export const RECEIVE_LEADERBOARD = 'RECEIVE_LEADERBOARD';

function requestLeaderboard() {
	return { type: REQUEST_LEADERBOARD };
}

function receiveLeaderboard(data) {
	return { type: RECEIVE_LEADERBOARD, data };
}

function shouldFetchLeaderboard(state) {
	return !state.leaderboard.hasFetched && !state.leaderboard.isFetching;
}

function fetchLeaderboard() {
	return dispatch => {
		dispatch(requestLeaderboard);
		return axios.get('/api/leaderboard')
			.then(response => dispatch(receiveLeaderboard(response.data)))
			.catch(() => {
				showErrorNotification('Failed to fetch leaderboard');
			});
	};
}

export function fetchLeaderboardIfNeeded() {
	return (dispatch, getState) => {
		if (shouldFetchLeaderboard(getState())) {
			return dispatch(fetchLeaderboard());
		}
		return Promise.resolve();
	};
}
