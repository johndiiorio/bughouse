export default function playSound(name) {
	function Sound(src) {
		this.sound = document.createElement('audio');
		this.sound.src = src;
		this.sound.setAttribute('preload', 'auto');
		this.sound.setAttribute('controls', 'none');
		this.sound.style.display = 'none';
		document.body.appendChild(this.sound);
		this.play = () => this.sound.play();
		this.stop = () => this.sound.pause();
	}
	let soundObj;
	if (name === 'move') {
		soundObj = new Sound('../../sound/move.mp3');
	} else if (name === 'capture') {
		soundObj = new Sound('../../sound/capture.mp3');
	} else {
		soundObj = new Sound('../../sound/notify.mp3');
	}
	soundObj.play();
}
