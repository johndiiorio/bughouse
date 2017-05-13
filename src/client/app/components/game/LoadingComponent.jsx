import React from 'react';
import '../../static/css/spinner.css';

export default function LoadingComponent() {
	return (
		<div>
			<div className="spinner-animation">
				<div className="spinner-outer-circle" />
				<div className="spinner-inner-circle" />
			</div>
			<br /><br /><br />
			<h3 className="brighter-color spinner-text">Waiting for other players to join the game...</h3>
		</div>
	);
}
