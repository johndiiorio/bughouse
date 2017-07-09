const soundMove = new Audio('/app/static/sound/move.mp3');
const soundCapture = new Audio('/app/static/sound/capture.mp3');
const soundNotify = new Audio('/app/static/sound/notify.mp3');

export default function playSound(name) {
	switch (name) {
		case 'move':
			soundMove.play();
			break;
		case 'capture':
			soundCapture.play();
			break;
		case 'notify':
			soundNotify.play();
			break;
		default:
			soundNotify.play();
	}
}
