import * as userActions from '../actions/user';

const defaultState = {
	currentUser: {},
	profileUsers: {},
	selectedProfile: null,
	profileUserFetching: false
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case userActions.UPDATE_CURRENT_USER:
			return {
				...state,
				currentUser: action.user
			};
		case userActions.UPDATE_SELECTED_PROFILE:
			return {
				...state,
				selectedProfile: action.username
			};
		case userActions.REQUEST_PROFILE_USER:
			return {
				...state,
				profileUserFetching: true
			};
		case userActions.RECEIVE_PROFILE_USER:
			return {
				...state,
				profileUserFetching: false,
				profileUsers: {
					...state.profileUsers,
					[action.user.username]: action.user
				}
			};
		default:
			return state;
	}
}
