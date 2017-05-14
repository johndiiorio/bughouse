import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default class JoinGameModalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.toggleModal = this.toggleModal.bind(this);
		this.joinPlayer = this.joinPlayer.bind(this);
	}

	toggleModal() {
		this.props.toggleModalDisplay();
	}

	joinPlayer(e) {
		this.toggleModal();
		const putData = {
			id: this.props.modalDisplayedGame.id,
			player: this.props.currentUser.id,
			playerPosition: `player${e.target.id.substring(e.target.id.length - 1)}`
		};
		return axios.put(`/api/games/open/${this.props.modalDisplayedGame.id}`, putData)
			.then(() => {
				this.props.updateSelectedGame(this.props.modalDisplayedGame);
			})
			.catch(console.error);
	}

	render() {
		const imgStyle = {
			marginTop: '3px',
			marginBottom: '3px'
		};
		const joinPlayer1Style = {
			display: this.props.modalDisplayedGame.player1 !== undefined ? 'inline' : 'block'
		};
		const joinPlayer2Style = {
			display: this.props.modalDisplayedGame.player2 !== undefined ? 'inline' : 'block'
		};
		const joinPlayer3Style = {
			display: this.props.modalDisplayedGame.player3 !== undefined ? 'inline' : 'block'
		};
		const joinPlayer4Style = {
			display: this.props.modalDisplayedGame.player4 !== undefined ? 'inline' : 'block'
		};
		return (
			<Modal show={this.props.modalDisplay} onHide={this.toggleModal}>
				<Modal.Header closeButton>
					<Modal.Title>Join this game</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer2Style} onClick={this.joinPlayer}>
								Join this side
							</Button>
						</div>
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer3Style} onClick={this.joinPlayer}>
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
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer1Style} onClick={this.joinPlayer}>
								Join this side
							</Button>
						</div>
						<div className="col-xs-6">
							<Button bsClass="btn btn-secondary centerDiv" style={joinPlayer4Style} onClick={this.joinPlayer}>
								Join this side
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		);
	}
}
