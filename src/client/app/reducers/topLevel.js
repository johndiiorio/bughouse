import * as topLevelActions from '../actions/topLevel';

const defaultState = {
	notification: {}
};

export default function topLevel(state = defaultState, action) {
	switch (action.type) {
		case topLevelActions.SEND_NOTIFICATION:
			return {
				...state,
				notification: action.notification
			};
		case topLevelActions.CLEAR_NOTIFICATIONS:
			return {
				...state,
				notification: {}
			};
		default:
			return state;
	}
}
