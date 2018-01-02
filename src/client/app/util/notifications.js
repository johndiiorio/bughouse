import store from '../index';
import { sendNotification } from '../actions/topLevel';

export function showSuccessNotification(message, position = 'tc', autoDismiss = 3) {
	store.dispatch(sendNotification({
		message,
		level: 'success',
		position,
		autoDismiss
	}));
}

export function showErrorNotification(message, position = 'tc', autoDismiss = 3) {
	store.dispatch(sendNotification({
		message,
		level: 'error',
		position,
		autoDismiss
	}));
}
