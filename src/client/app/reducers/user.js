import * as userActions from '../actions/user';

const defaultState = {
	currentUser: {}
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case userActions.UPDATE_CURRENT_USER:
			return {
				...state,
				currentUser: action.user
			};
		default:
			return state;
	}
}
