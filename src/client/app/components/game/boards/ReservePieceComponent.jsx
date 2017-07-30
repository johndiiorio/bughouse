import React from 'react';
import './css/reservePiece.css';

export default class ReservePieceComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleOnDragStart = this.handleOnDragStart.bind(this);
	}

	handleOnDragStart(e) {
		e.preventDefault();
		if (this.props.pieceNum === 0 || !this.props.canDrag || this.props.gameOver) {
			return;
		}
		const rolesMapping = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
		const pieceToDrag = {
			role: rolesMapping[this.props.piece.charAt(1).toLowerCase()],
			color: this.props.piece.charAt(0) === 'w' ? 'white' : 'black'
		};
		this.props.updatePieceToDragFromReserve(pieceToDrag);
	}

	render() {
		const isPieceHighlighted = this.props.pieceNum > 0;
		const pieceStyle = {
			cursor: isPieceHighlighted ? 'pointer' : 'default',
			opacity: isPieceHighlighted ? '1' : '0.1',
		};
		const absoluteTextStyle = {
			display: isPieceHighlighted ? 'inline' : 'none',
		};

		return (
			<div draggable="true" onDragStart={this.handleOnDragStart}>
				<img src={`/app/static/img/pieces/${this.props.piece}.svg`} className="pieceStyle" style={pieceStyle} />
				<p className="absoluteTextStyle" style={absoluteTextStyle}>{this.props.pieceNum}</p>
			</div>
		);
	}
}
