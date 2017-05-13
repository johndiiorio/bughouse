import React from 'react';

export default class LobbyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.addPlayer = this.addPlayer.bind(this);
	}

	addPlayer(game) {

	}

	render() {
		const underlineStyle = {
			textDecoration: 'underline'
		};
		const cursorStyle = {
			cursor: 'pointer'
		};

		function getSlots(game) {
			let count = 0;
			if (typeof game.player1 !== 'undefined' && game.player1.length > 0) count++;
			if (typeof game.player2 !== 'undefined' && game.player2.length > 0) count++;
			if (typeof game.player3 !== 'undefined' && game.player3.length > 0) count++;
			if (typeof game.player4 !== 'undefined' && game.player4.length > 0) count++;
			return `${count}/4`;
		}

		function formatColor(player) {
			if (typeof player === 'undefined') {
				return 'text-success';
			}
			if (player.length <= 0) {
				return 'text-success';
			}
			return '';
		}
		function formatPlayer(player, game) {
			if (typeof player !== 'undefined') {
				let returnString = player.username;
				if (game.minutes < 3) {
					returnString += ` (${player.ratingBullet})`;
				} else if (game.minutes >= 3 && game.minutes <= 8) {
					returnString += ` (${player.ratingBlitz})`;
				} else {
					returnString += ` (${player.ratingClassical})`;
				}
				if (player.title !== null) {
					returnString = `${player.title} ${returnString}`;
				}
				return returnString;
			}
			return 'empty';
		}

		function formatRange(game) {
			return `${game.ratingRange.substring(0, game.ratingRange.indexOf(','))} - ${game.ratingRange.substring(game.ratingRange.indexOf(',') + 1)}`;
		}

		function formatRandom(game) {
			return game.joinRandom ? 'Yes' : 'No';
		}
		/* eslint-disable jsx-a11y/no-static-element-interactions */
		return (
			<div className="col-md-8">
				<h3 className="brighter-color" style={underlineStyle}>Lobby:</h3>
				<div id="lobbyTable">
					<table className="table table-hover brighter-color table-condensed table-fixedheader">
						<thead>
							<tr>
								<th width="10%">Slots</th>
								<th width="15%">Mode</th>
								<th width="35%">Players</th>
								<th width="15%">Time Control</th>
								<th width="15%">Rating Range</th>
								<th width="10%">Join Random</th>
							</tr>
						</thead>
						<tbody>
							{this.props.displayedGames.map((game, index) =>
								<tr onClick={this.addPlayer(game)} key={index} style={cursorStyle}>
									<td width="10%">{getSlots(game)}</td>
									<td width="15%">{game.mode}</td>
									<td width="35%">
										<div className="row">
											<div className={`col-xs-6 ${formatColor(game.player2)}`}>{formatPlayer(game.player2, game)}
											</div>
											<div className={`col-xs-6 ${formatColor(game.player3)}`}>{formatPlayer(game.player3, game)}
											</div>
										</div>
										<div className="row">
											<div className={`col-xs-6 ${formatColor(game.player1)}`}>{formatPlayer(game.player1, game)}
											</div>
											<div className={`col-xs-6 ${formatColor(game.player4)}`}>{formatPlayer(game.player4, game)}
											</div>
										</div>
									</td>
									<td width="15%">{`${game.minutes}+${game.increment}`}</td>
									<td width="15%">{formatRange(game)}</td>
									<td width="10%">{formatRandom(game)}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions */
	}
}
