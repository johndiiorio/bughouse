import React from 'react';
import ReservePieceGroupComponent from './ReservePieceGroupComponent';

export default function ReserveComponent(props) {
	function getPieceNumsFromReserve(reserve) {
		const pieceNums = { pawn: 0, knight: 0, bishop: 0, rook: 0, queen: 0 };
		for (const row of props.reserves[reserve]) {
			pieceNums[row.role]++;
		}
		return pieceNums;
	}

	if (props.userPosition === 1) {
		if (props.reservePosition === 1) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('leftWhite')} canDrag margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 2) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('leftBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 3) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('rightWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		}
		return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('rightBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
	} else if (props.userPosition === 2) {
		if (props.reservePosition === 1) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('leftBlack')} canDrag margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 2) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('leftWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 3) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('rightBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		}
		return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('rightWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
	} else if (props.userPosition === 3) {
		if (props.reservePosition === 1) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('rightWhite')} canDrag margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 2) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('rightBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 3) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('leftWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		}
		return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('leftBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
	} else {
		if (props.reservePosition === 1) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('rightBlack')} canDrag margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 2) {
			return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('rightWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		} else if (props.reservePosition === 3) {
			return (<ReservePieceGroupComponent reserveColor="black" pieceNums={getPieceNumsFromReserve('leftBlack')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
		}
		return (<ReservePieceGroupComponent reserveColor="white" pieceNums={getPieceNumsFromReserve('leftWhite')} canDrag={false} margin={props.margin} floatRight={props.floatRight} />);
	}
}
