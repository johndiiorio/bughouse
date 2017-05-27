import React from 'react';
import ReservePieceComponent from './ReservePieceComponent';

export default function ReserveComponent(props) {
	const reserveContainerStyle = {
		width: '310px',
		height: '63px',
		backgroundColor: '#b0b0b0',
		float: props.floatRight ? 'right' : 'auto',
		marginTop: props.margin === 'top' ? '15px' : '0em',
		marginBottom: props.margin === 'bottom' ? '15px' : '0em',
		display: 'inline-block'
	};

	let reserveColor;
	if (props.userPosition === 1 || props.userPosition === 3) {
		reserveColor = props.reserveColorFromPosition1;
	} else {
		reserveColor = props.reserveColorFromPosition1 === 'white' ? 'black' : 'white';
	}
	// TODO set pieceNum to props from Redux state, done after reserve pieces are implemented in Redux
	return (
		<div style={reserveContainerStyle}>
			{ reserveColor === 'white' ?
				(
					<div>
						<ReservePieceComponent piece="wP" pieceNum={0} />
						<ReservePieceComponent piece="wN" pieceNum={4} />
						<ReservePieceComponent piece="wB" pieceNum={0} />
						<ReservePieceComponent piece="wR" pieceNum={2} />
						<ReservePieceComponent piece="wQ" pieceNum={1} />
					</div>
				) : (
					<div>
						<ReservePieceComponent piece="bP" pieceNum={1} />
						<ReservePieceComponent piece="bN" pieceNum={0} />
						<ReservePieceComponent piece="bB" pieceNum={2} />
						<ReservePieceComponent piece="bR" pieceNum={0} />
						<ReservePieceComponent piece="bQ" pieceNum={9} />
					</div>
				)
			}
		</div>
	);
}
