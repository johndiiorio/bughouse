import React from 'react';
import ReservePieceComponent from './ReservePieceComponent';

// Props: floatRight, margin, reserveColor, pieceNums
export default function ReservePieceGroupComponent(props) {
	const reserveContainerStyle = {
		width: '310px',
		height: '63px',
		backgroundColor: '#b0b0b0',
		float: props.floatRight ? 'right' : 'auto',
		marginTop: props.margin === 'top' ? '15px' : '0em',
		marginBottom: props.margin === 'bottom' ? '15px' : '0em',
		display: 'inline-block'
	};

	return (
		<div style={reserveContainerStyle}>
			{ props.reserveColor === 'white' ?
				(
					<div>
						<ReservePieceComponent piece="wP" pieceNum={props.pieceNums.pawn} />
						<ReservePieceComponent piece="wN" pieceNum={props.pieceNums.knight} />
						<ReservePieceComponent piece="wB" pieceNum={props.pieceNums.bishop} />
						<ReservePieceComponent piece="wR" pieceNum={props.pieceNums.rook} />
						<ReservePieceComponent piece="wQ" pieceNum={props.pieceNums.queen} />
					</div>
				) : (
					<div>
						<ReservePieceComponent piece="bP" pieceNum={props.pieceNums.pawn} />
						<ReservePieceComponent piece="bN" pieceNum={props.pieceNums.knight} />
						<ReservePieceComponent piece="bB" pieceNum={props.pieceNums.bishop} />
						<ReservePieceComponent piece="bR" pieceNum={props.pieceNums.rook} />
						<ReservePieceComponent piece="bQ" pieceNum={props.pieceNums.queen} />
					</div>
				)
			}
		</div>
	);
}
