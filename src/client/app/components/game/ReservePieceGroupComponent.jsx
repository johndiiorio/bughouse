import React from 'react';
import ReservePieceContainer from '../../containers/game/ReservePieceContainer';

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
						<ReservePieceContainer piece="wP" pieceNum={props.pieceNums.pawn} />
						<ReservePieceContainer piece="wN" pieceNum={props.pieceNums.knight} />
						<ReservePieceContainer piece="wB" pieceNum={props.pieceNums.bishop} />
						<ReservePieceContainer piece="wR" pieceNum={props.pieceNums.rook} />
						<ReservePieceContainer piece="wQ" pieceNum={props.pieceNums.queen} />
					</div>
				) : (
					<div>
						<ReservePieceContainer piece="bP" pieceNum={props.pieceNums.pawn} />
						<ReservePieceContainer piece="bN" pieceNum={props.pieceNums.knight} />
						<ReservePieceContainer piece="bB" pieceNum={props.pieceNums.bishop} />
						<ReservePieceContainer piece="bR" pieceNum={props.pieceNums.rook} />
						<ReservePieceContainer piece="bQ" pieceNum={props.pieceNums.queen} />
					</div>
				)
			}
		</div>
	);
}
