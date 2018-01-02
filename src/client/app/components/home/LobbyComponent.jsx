import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { showErrorNotification } from '../../util/notifications';

export default class LobbyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.addPlayer = this.addPlayer.bind(this);
	}

	addPlayer(game) {
		if (_.isEmpty(this.props.currentUser)) {
			showErrorNotification('Please log in to join a game');
		} else if (game.joinRandom) {
			const openSlots = [];
			if (game.player1.id === null) openSlots.push(1);
			if (game.player2.id === null) openSlots.push(2);
			if (game.player3.id === null) openSlots.push(3);
			if (game.player4.id === null) openSlots.push(4);
			const slot = openSlots[Math.floor(Math.random() * openSlots.length)];
			const putData = {
				player: this.props.currentUser.id,
				playerPosition: `player${slot}`
			};
			axios.put(`/api/games/open/${game.id}`, putData)
				.then(() => {
					this.props.updateSelectedGame(game);
				})
				.catch(() => {
					showErrorNotification('You cannot join this game');
				});
		} else {
			this.props.updateModalDisplayedGame(game);
			this.props.toggleModalDisplay();
		}
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
			if (game.player1.id !== null) count++;
			if (game.player2.id !== null) count++;
			if (game.player3.id !== null) count++;
			if (game.player4.id !== null) count++;
			return `${count}/4`;
		}

		function formatColor(player) {
			if (player.id === null) {
				return 'text-success';
			}
			return '';
		}
		function formatPlayer(player, game) {
			if (player.id !== null) {
				let returnString = '';
				if (player.title !== null) {
					returnString += `${player.title} `;
				}
				returnString += player.username;
				if (game.minutes < 3) {
					returnString += ` (${Math.round(player.ratingBullet)})`;
				} else if (game.minutes >= 3 && game.minutes <= 8) {
					returnString += ` (${Math.round(player.ratingBlitz)})`;
				} else {
					returnString += ` (${Math.round(player.ratingClassical)})`;
				}
				return returnString;
			}
			return 'empty';
		}

		function formatRange(game) {
			return `${parseInt(game.ratingRange.substring(0, game.ratingRange.indexOf('-')))} to ${parseInt(game.ratingRange.substring(game.ratingRange.indexOf('-') + 1))}`;
		}

		function formatRandom(game) {
			return game.joinRandom ? 'Yes' : 'No';
		}
		/* eslint-disable jsx-a11y/no-static-element-interactions */
		return (
			<div className="col-md-9">
				<h3 style={underlineStyle}>Lobby:</h3>
				<div id="lobbyTable">
					<table className="table table-hover table-condensed table-fixedheader">
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
								<tr onClick={() => this.addPlayer(game)} key={index} style={cursorStyle}>
									<td width="10%">{getSlots(game)}</td>
									<td width="15%">{game.mode}</td>
									<td width="35%">
										<div className="row">
											<div className={`col-xs-6 ${formatColor(game.player2)}`}>
												{ game.player2.title && <div className="title-color title">{game.player2.title}</div> }
												{formatPlayer(game.player2, game)}
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
