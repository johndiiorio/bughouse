import React from 'react';
import UserLinkComponent from '../../common/UserLinkComponent';
import './css/gameMovesPanel.css';

export default function GameMovesPanelComponent(props) {
	return (
		<div className="movesTablePanel">
			<table className="table-container">
				<thead>
					<tr>
						<th><h1>#</h1></th>
						<th><h1><UserLinkComponent user={props.game.player1} /></h1></th>
						<th><h1><UserLinkComponent user={props.game.player2} /></h1></th>
						<th><h1><UserLinkComponent user={props.game.player3} /></h1></th>
						<th><h1><UserLinkComponent user={props.game.player4} /></h1></th>
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
