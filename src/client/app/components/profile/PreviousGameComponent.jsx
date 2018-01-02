import React from 'react';
import { Chessground } from 'chessground/chessground';

export default class PreviousGameComponent extends React.Component {
	componentDidMount() {
		Chessground(this.boardLeft, {
			viewOnly: true,
			disableContextMenu: true,
			fen: this.props.game.leftFen
		});
		const boardRight = Chessground(this.boardRight, {
			viewOnly: true,
			disableContextMenu: true,
			fen: this.props.game.rightFen
		});
		boardRight.toggleOrientation();
	}

	render() {
		return (
			<div>
				<div className="board-left" ref={c => { this.boardLeft = c; }} />
				<div className="board-right" ref={c => { this.boardRight = c; }} />
			</div>
		);
	}
}
