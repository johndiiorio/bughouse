import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { socketLobby } from '../../socket';
import './css/loading.css';

export default class LoadingComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleUserLeaveGame = this.handleUserLeaveGame.bind(this);
	}

	componentWillMount() {
		window.addEventListener('beforeunload', this.handleUserLeaveGame);
	}

	componentWillUnmount() {
		// User is manually navigating away
		if (this.props.userWaitingForGameToStart) {
			this.handleUserLeaveGame();
		}
		window.removeEventListener('beforeunload', this.handleUserLeaveGame);
	}

	handleUserLeaveGame() {
		axios.put('/api/games/remove', {
			token: localStorage.getItem('token'),
			gameID: this.props.selectedGameID
		}).then(() => {
			socketLobby.emit('update game list');
			this.props.toggleUserWaitingForGameToStart();
			browserHistory.push('/');
		});
	}

	render() {
		return (
			<div>
				<div className="spinner-animation">
					<div className="spinner-outer-circle" />
					<div className="spinner-inner-circle" />
				</div>
				<br /><br /><br />
				<h3 className="spinner-text">Waiting for other players to join the game...</h3>
				<Button bsClass="btn btn-secondary cancel-button" onClick={this.handleUserLeaveGame}>Cancel game</Button>
			</div>
		);
	}
}
