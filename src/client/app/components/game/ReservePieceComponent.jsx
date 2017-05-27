import React from 'react';

export default function ReservePieceComponent(props) {
	const isPieceHighlighted = props.pieceNum > 0;

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
		<div style={containerStyle}>
			<img src={`../../app/static/img/pieces/${props.piece}.svg`} style={pieceStyle} />
			<p style={absoluteTextStyle}>{props.pieceNum}</p>
		</div>
	);
}
