import React from 'react';

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
		if (this.props.game.minutes < 3) return this.props.game[player].ratingBullet;
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) return this.props.game[player].ratingBlitz;
		return this.props.game[player].ratingClassical;
	}

	render() {
		const infoPlayersStyle = {
			textAlign: 'center',
			width: '450px',
			backgroundColor: '#262626',
			margin: '0 auto',
			paddingTop: '10px',
			paddingBottom: '20px',
			border: '1px solid #3d3d3d'
		};
		const underlineStyle = {
			textDecoration: 'underline'
		};
		const alignPlayerInfoStyle = {
			top: '3px',
			position: 'relative'
		};
		const versusStyle = {
			top: '7px',
			position: 'relative'
		};
		return (
			<div style={infoPlayersStyle}>
				<h4 className="brighter-color" style={underlineStyle}>{this.getInfoFormat()}</h4>
				<div>
					<img src="../../app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="blue-color" style={alignPlayerInfoStyle}>
						{` ${this.props.game.player1.username} (${this.getRating('player1')}) `}
					</span>
					<img src="../../app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="blue-color" style={alignPlayerInfoStyle}>
						{` ${this.props.game.player4.username} (${this.getRating('player4')})`}
					</span>
					<p className="brighter-color" style={versusStyle}>versus</p>
					<img src="../../app/static/img/pieces/bK.svg" alt="Black" width="20px" height="20px" />
					<span className="red-color" style={alignPlayerInfoStyle}>
						{` ${this.props.game.player2.username} (${this.getRating('player2')}) `}
					</span>
					<img src="../../app/static/img/pieces/wK.svg" alt="White" width="20px" height="20px" />
					<span className="red-color" style={alignPlayerInfoStyle}>
						{` ${this.props.game.player3.username} (${this.getRating('player3')})`}
					</span>
				</div>
			</div>
		);
	}
}
