import React from 'react';
import { browserHistory } from 'react-router';
import { Chessground } from 'chessground/chessground';
import UserLinkComponent from '../common/UserLinkComponent';
import './css/previousGame.css';

export default class PreviousGameComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		Chessground(this.boardLeft, {
			viewOnly: true,
			disableContextMenu: true,
			coordinates: false,
			fen: this.props.game.leftFen
		});
		const boardRight = Chessground(this.boardRight, {
			viewOnly: true,
			disableContextMenu: true,
			coordinates: false,
			fen: this.props.game.rightFen
		});
		boardRight.toggleOrientation();
	}

	handleClick() {
		browserHistory.push(`/game/${this.props.game.id}`);
	}

	render() {
		const game = this.props.game;
		function getInfoFormat() {
			let speed;
			if (game.minutes < 3) speed = 'Bullet';
			else if (game.minutes >= 3 && game.minutes <= 8) speed = 'Blitz';
			else speed = 'Classical';
			return `${game.minutes}+${game.increment}, ${speed}, ${game.mode}`;
		}

		return (
			<div className="game-wrapper row" onClick={this.handleClick}>
				<div className="col-xs-3" />
				<div className="info-wrapper col-xs-6">
					<div className="col-xs-6">
						<h4>{getInfoFormat()}</h4>
						<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
						<span className="align-player-info player-separation">
							<UserLinkComponent user={game.player1} rating={game.player1.rating} />
						</span>
						<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
						<span className="align-player-info">
							<UserLinkComponent user={game.player4} rating={game.player4.rating} />
						</span>
						<p className="versus">versus</p>
						<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
						<span className="align-player-info player-separation">
							<UserLinkComponent user={game.player2} rating={game.player2.rating} />
						</span>
						<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
						<span className="align-player-info">
							<UserLinkComponent user={game.player3} rating={game.player3.rating} />
						</span>
						<h4>{game.termination}</h4>
					</div>
					<div className="col-xs-6">
						<div className="col-xs-6">
							<div ref={c => { this.boardLeft = c; }} />
						</div>
						<div className="col-xs-6">
							<div ref={c => { this.boardRight = c; }} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
