import React from 'react';

export default class LobbyComponent extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div id="lobbyPanel" className="col-md-8">
				<h3 className="brighter-color" style="text-decoration: underline">Lobby:</h3>
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
						<tr ng-repeat="game in gameArray track by $index" ng-click="addPlayer(game)" style="cursor: pointer">
							<td width="10%">{{getSlots(game)}}</td>
							<td width="15%">{{game.mode}}</td>
							<td width="35%">
								<div className="row">
									<div className="col-xs-6 {{formatColor(game.player2)}}">{{formatPlayer(game.player2, game)}}
									</div>
									<div className="col-xs-6 {{formatColor(game.player3)}}">{{formatPlayer(game.player3, game)}}
									</div>
								</div>
								<div className="row">
									<div className="col-xs-6 {{formatColor(game.player1)}}">{{formatPlayer(game.player1, game)}}
									</div>
									<div className="col-xs-6 {{formatColor(game.player4)}}">{{formatPlayer(game.player4, game)}}
									</div>
								</div>
							</td>
							<td width="15%">{{game.minutes + "+" + game.increment}}</td>
							<td width="15%">{{formatRange(game)}}</td>
							<td width="10%">{{formatRandom(game)}}</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
