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
		const infoPanelStyle = {
			position: 'relative',
			textAlign: 'center',
			paddingTop: '4em'
		};
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
			<div style={infoPanelStyle} className="col-md-4">
				<div style={infoPlayersStyle}>
					<h4 className="brighter-color" style={underlineStyle}>{this.getInfoFormat()}</h4>
					<div>
						<img src="../../app/static/img/chesspieces/wikipedia/wK.png" alt="White" width="20px" height="20px" />
						<span className="blue-color" style={alignPlayerInfoStyle}>
							{`${this.props.game.player1.username} (${this.getRating('player1')})`}
						</span>
						<img src="../../app/static/img/chesspieces/wikipedia/bK.png" alt="Black" width="20px" height="20px" />
						<span className="blue-color" style={alignPlayerInfoStyle}>
							{`${this.props.game.player4.username} (${this.getRating('player4')})`}
						</span>
						<p className="brighter-color" style={versusStyle}>versus</p>
						<img src="../../app/static/img/chesspieces/wikipedia/bK.png" alt="Black" width="20px" height="20px" />
						<span className="red-color" style={alignPlayerInfoStyle}>
							{`${this.props.game.player2.username} (${this.getRating('player2')})`}
						</span>
						<img src="../../app/static/img/chesspieces/wikipedia/wK.png" alt="White" width="20px" height="20px" />
						<span className="red-color" style={alignPlayerInfoStyle}>
							{`${this.props.game.player3.username} (${this.getRating('player3')})`}
						</span>
					</div>
				</div>
				<br />
				<div id="movesTable">
					<table id="movesTableContainer" className="table-container">
						<thead>
							<tr>
								<th><h1>#</h1></th>
								<th><h1>{this.props.game.player1.username}</h1></th>
								<th><h1>{this.props.game.player2.username}</h1></th>
								<th><h1>{this.props.game.player3.username}</h1></th>
								<th><h1>{this.props.game.player4.username}</h1></th>
							</tr>
						</thead>
						<tbody id="movesTableTBody">
							{this.props.moves.map((move, index) =>
								<tr key={index}>
									<td>{move.number}</td>
									<td>{move.player1}</td>
									<td>{move.player2}</td>
									<td>{move.player3}</td>
									<td>{move.player4}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
