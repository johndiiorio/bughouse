import React from 'react';

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
	const pieceStyle = {
		width: '62px',
		height: '62px',
		display: 'block',
		cursor: 'pointer',
		float: 'left',
		opacity: '0.1'
	};
	let reserveColor;
	if (props.userPosition === 1 || props.userPosition === 3) {
		reserveColor = props.reserveColorFromPosition1;
	} else {
		reserveColor = props.reserveColorFromPosition1 === 'white' ? 'black' : 'white';
	}
	return (

		<div style={reserveContainerStyle}>
			{ reserveColor === 'white' ?
				(
					<div>
						<img src="../../app/static/img/pieces/wP.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/wN.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/wR.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/wB.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/wQ.svg" style={pieceStyle} />
					</div>
				) : (
					<div>
						<img src="../../app/static/img/pieces/bP.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/bN.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/bR.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/bB.svg" style={pieceStyle} />
						<img src="../../app/static/img/pieces/bQ.svg" style={pieceStyle} />
					</div>
				)
			}
		</div>
	);
}
