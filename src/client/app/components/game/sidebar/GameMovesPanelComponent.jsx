import React from 'react';
import './css/gameMovesPanel.css';

export default function GameMovesPanelComponent(props) {
	return (
		<div className="movesTablePanel">
			<table className="table-container">
				<thead>
					<tr>
						<th><h1>#</h1></th>
						<th><h1>{props.game.player1.username}</h1></th>
						<th><h1>{props.game.player2.username}</h1></th>
						<th><h1>{props.game.player3.username}</h1></th>
						<th><h1>{props.game.player4.username}</h1></th>
					</tr>
				</thead>
				<tbody id="movesTableTBody">
					{props.moves.map((move, index) =>
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
	);
}
