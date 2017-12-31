import React from 'react';
import GameActionsPanelContainer from '../../../containers/game/sidebar/GameActionsPanelContainer';
import UserLinkComponent from '../../common/UserLinkComponent';
import './css/gameInfoPanel.css';

export default class GameInfoPanelComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getInfoFormat = this.getInfoFormat.bind(this);
	}

	getInfoFormat() {
		let speed;
		if (this.props.game.minutes < 3) speed = 'Bullet';
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) speed = 'Blitz';
		else speed = 'Classical';
		return `${this.props.game.minutes}+${this.props.game.increment}, ${speed}, ${this.props.game.mode}`;
	}

	render() {
		return (
			<div className="game-info-panel-container">
				<h4>{this.getInfoFormat()}</h4>
				<div>
					<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="align-player-info player-separation">
						<UserLinkComponent user={this.props.game.player1} rating={this.props.game.player1.rating} />
					</span>
					<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="align-player-info">
						<UserLinkComponent user={this.props.game.player4} rating={this.props.game.player4.rating} />
					</span>
					<p className="versus">versus</p>
					<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="align-player-info player-separation">
						<UserLinkComponent user={this.props.game.player2} rating={this.props.game.player2.rating} />
					</span>
					<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="align-player-info">
						<UserLinkComponent user={this.props.game.player3} rating={this.props.game.player3.rating} />
					</span>
				</div>
				{ this.props.gameTermination ? (
					<p className="game-termination">
						{this.props.gameTermination}
					</p>
				) : (
					<div>
						{ this.props.isPlaying && <GameActionsPanelContainer /> }
					</div>
				)}
			</div>
		);
	}
}
