import React from 'react';
import GameActionsPanelContainer from '../../../containers/game/sidebar/GameActionsPanelContainer';
import './css/gameInfoPanel.css';

export default class GameInfoPanelComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getInfoFormat = this.getInfoFormat.bind(this);
		this.getRating = this.getRating.bind(this);
	}

	getInfoFormat() {
		let speed;
		if (this.props.game.minutes < 3) speed = 'Bullet';
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) speed = 'Blitz';
		else speed = 'Classical';
		return `${this.props.game.minutes}+${this.props.game.increment}, ${speed}, ${this.props.game.mode}`;
	}

	getRating(player) {
		return Math.round(this.props.game[player].rating);
	}

	render() {
		return (
			<div className="gameInfoPanelContainer">
				<h4 className="brighter-color underlined">{this.getInfoFormat()}</h4>
				<div>
					<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="blue-color alignPlayerInfo">
						{` ${this.props.game.player1.username} (${this.getRating('player1')}) `}
					</span>
					<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="blue-color alignPlayerInfo">
						{` ${this.props.game.player4.username} (${this.getRating('player4')})`}
					</span>
					<p className="brighter-color versus">versus</p>
					<img src="/app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="red-color alignPlayerInfo">
						{` ${this.props.game.player2.username} (${this.getRating('player2')}) `}
					</span>
					<img src="/app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="red-color alignPlayerInfo">
						{` ${this.props.game.player3.username} (${this.getRating('player3')})`}
					</span>
				</div>
				{ this.props.gameTermination ? (
					<p className="gameTermination">
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
