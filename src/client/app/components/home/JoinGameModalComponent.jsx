import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { showErrorNotification } from '../../util/notifications';

export default class JoinGameModalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.toggleModal = this.toggleModal.bind(this);
		this.joinPlayer = this.joinPlayer.bind(this);
	}

	toggleModal() {
		this.props.toggleModalDisplay();
	}

	joinPlayer(slot) {
		this.toggleModal();
		const putData = {
			player: this.props.currentUser.id,
			playerPosition: `player${slot}`
		};
		return axios.put(`/api/games/open/${this.props.modalDisplayedGame.id}`, putData)
			.then(() => {
				this.props.updateSelectedGame(this.props.modalDisplayedGame);
			})
			.catch(() => {
				showErrorNotification('You cannot join this game');
			});
	}

	render() {
		const imgStyle = {
			marginTop: '3px',
			marginBottom: '3px'
		};
		const joinPlayer1Style = {
			display: _.has(this.props.modalDisplayedGame, 'player1') && this.props.modalDisplayedGame.player1.id !== null ? 'none' : 'block'
		};
		const joinPlayer2Style = {
			display: _.has(this.props.modalDisplayedGame, 'player2') && this.props.modalDisplayedGame.player2.id !== null ? 'none' : 'block'
		};
		const joinPlayer3Style = {
			display: _.has(this.props.modalDisplayedGame, 'player3') && this.props.modalDisplayedGame.player3.id !== null ? 'none' : 'block'
		};
		const joinPlayer4Style = {
			display: _.has(this.props.modalDisplayedGame, 'player4') && this.props.modalDisplayedGame.player4.id !== null ? 'none' : 'block'
		};
		return (
			<Modal show={this.props.modalDisplay} onHide={this.toggleModal}>
				<Modal.Header closeButton>
					<Modal.Title style={{ color: 'black' }}>Join this game</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer2Style} onClick={() => this.joinPlayer(2)}>
								Join this side
							</Button>
						</div>
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer3Style} onClick={() => this.joinPlayer(3)}>
								Join this side
							</Button>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-6">
							<img className="centerDiv" style={imgStyle} src="../../app/static/img/assets/initialBoardWhite.png" alt="Chess Board" width="100px" height="100px" />
						</div>
						<div className="col-xs-6">
							<img className="centerDiv" style={imgStyle} src="../../app/static/img/assets/initialBoardBlack.png" alt="Chess Board" width="100px" height="100px" />
						</div>
					</div>
					<div className="row">
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer1Style} onClick={() => this.joinPlayer(1)}>
								Join this side
							</Button>
						</div>
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer4Style} onClick={() => this.joinPlayer(4)}>
								Join this side
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		);
	}
}
