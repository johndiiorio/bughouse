import React from 'react';
import ReservePieceContainer from '../../../containers/game/boards/ReservePieceContainer';
import './css/reservePieceGroup.css';

export default function ReservePieceGroupComponent(props) {
	const reserveContainerStyle = {
		float: props.floatRight ? 'right' : 'auto',
		marginTop: props.margin === 'top' ? '15px' : '0em',
		marginBottom: props.margin === 'bottom' ? '15px' : '0em',
	};

	return (
		<div className="reserveContainer" style={reserveContainerStyle}>
			{ props.reserveColor === 'white' ?
				(
					<div>
						<ReservePieceContainer piece="wP" canDrag={props.canDrag} pieceNum={props.pieceNums.pawn} />
						<ReservePieceContainer piece="wN" canDrag={props.canDrag} pieceNum={props.pieceNums.knight} />
						<ReservePieceContainer piece="wB" canDrag={props.canDrag} pieceNum={props.pieceNums.bishop} />
						<ReservePieceContainer piece="wR" canDrag={props.canDrag} pieceNum={props.pieceNums.rook} />
						<ReservePieceContainer piece="wQ" canDrag={props.canDrag} pieceNum={props.pieceNums.queen} />
					</div>
				) : (
					<div>
						<ReservePieceContainer piece="bP" canDrag={props.canDrag} pieceNum={props.pieceNums.pawn} />
						<ReservePieceContainer piece="bN" canDrag={props.canDrag} pieceNum={props.pieceNums.knight} />
						<ReservePieceContainer piece="bB" canDrag={props.canDrag} pieceNum={props.pieceNums.bishop} />
						<ReservePieceContainer piece="bR" canDrag={props.canDrag} pieceNum={props.pieceNums.rook} />
						<ReservePieceContainer piece="bQ" canDrag={props.canDrag} pieceNum={props.pieceNums.queen} />
					</div>
				)
			}
		</div>
	);
}
