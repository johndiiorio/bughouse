import React from 'react';
import { Modal } from 'react-bootstrap';

export default class JoinGameModalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { showModal: false };
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.joinPlayer = this.joinPlayer.bind(this);
	}

	openModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	joinPlayer(e) {
		this.closeModal();
		const slot = e.target.id.substring(e.target.id.length - 1);
		let player1;
		let	player2;
		let	player3;
		let	player4;

		player1 = this.props.selectedGame.player1;
		player2 = this.props.selectedGame.player2;
		player3 = this.props.selectedGame.player3;
		player4 = this.props.selectedGame.player4;

		if (slot === 1) {
			player1 = this.props.selectedGame.currentUser.id;
		} else if (slot === 2) {
			player2 = this.props.selectedGame.currentUser.id;
		} else if (slot === 3) {
			player3 = this.props.selectedGame.currentUser.id;
		} else {
			player4 = this.props.selectedGame.currentUser.id;
		}

		const putData = { player1, player2, player3, player4 };
		$http({
			method: 'PUT',
			url: `/api/games/open/${this.props.selectedGame.game_id}`,
			data: putData
		}).success(() => {
			$scope.switchToLoadingScreen(this.props.selectedGame.id);
			if ($scope.getOpenSlots(this.props.selectedGame).length <= 1) {
				$scope.startGame(this.props.selectedGame);
			}
		}).error(() => {
			console.log('Error updating game');
		});
	}

	render() {
		const imgStyle = {
			marginTop: '3px',
			marginBottom: '3px'
		};
		return (
			<Modal show={this.state.showModal} onHide={this.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Join this game</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-6">
							<button type="button" id="joinPlayer2" className="btn btn-secondary centerDiv" onClick={this.joinPlayer}>
								Join this side
							</button>
						</div>
						<div className="col-xs-6">
							<button type="button" id="joinPlayer3" className="btn btn-secondary centerDiv" onClick={this.joinPlayer}>
								Join this side
							</button>
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
							<button type="button" id="joinPlayer1" className="btn btn-secondary centerDiv" onClick={this.joinPlayer}>
								Join this side
							</button>
						</div>
						<div className="col-xs-6">
							<button type="button" id="joinPlayer4" className="btn btn-secondary centerDiv" onClick={this.joinPlayer}>
								Join this side
							</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		);
	}
}
