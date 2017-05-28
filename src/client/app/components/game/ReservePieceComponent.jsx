import React from 'react';

export default class ReservePieceComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleOnDragStart = this.handleOnDragStart.bind(this);
	}

	handleOnDragStart(e) {
		e.preventDefault();
		const rolesMapping = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
		const pieceToDrag = {
			role: rolesMapping[this.props.piece.charAt(1).toLowerCase()],
			color: this.props.piece.charAt(0) === 'w' ? 'white' : 'black'
		};
		this.props.updatePieceToDragFromReserve(pieceToDrag);
	}

	render() {
		const isPieceHighlighted = this.props.pieceNum > 0;

		const containerStyle = {
			position: 'relative'
		};

		const pieceStyle = {
			width: '62px',
			height: '62px',
			display: 'block',
			cursor: isPieceHighlighted ? 'pointer' : 'default',
			float: 'left',
			opacity: isPieceHighlighted ? '1' : '0.1',
			position: 'relative'
		};

		const absoluteTextStyle = {
			transform: 'translate(-20px, 39px)',
			padding: '5px 5px 5px 5px',
			textAlign: 'center',
			lineHeight: '14px',
			fontWeight: 'bold',
			color: '#fff',
			background: '#d85000',
			position: 'absolute',
			display: isPieceHighlighted ? 'inline' : 'none',
			zIndex: '1'
		};

		return (
			<div style={containerStyle} draggable="true" onDragStart={this.handleOnDragStart}>
				<img src={`../../app/static/img/pieces/${this.props.piece}.svg`} style={pieceStyle} />
				<p style={absoluteTextStyle}>{this.props.pieceNum}</p>
			</div>
		);
	}
}
