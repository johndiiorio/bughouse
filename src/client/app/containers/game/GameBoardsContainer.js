import { connect } from 'react-redux';
import GameBoardsComponent from '../../components/game/GameBoardsComponent';
import { updateMoves } from '../../actions/game';

function mapStateToProps(state) {
	const userPosition = state.game.userPosition;
	const game = state.game.game;
	let board1Flip = false;
	let board2Flip = false;
	const display = {};
	if (userPosition === 1) {
		display.player1 = game.player1;
		display.player2 = game.player2;
		display.player3 = game.player3;
		display.player4 = game.player4;
		board2Flip = true;
	} else if (userPosition === 2) {
		display.player1 = game.player2;
		display.player2 = game.player1;
		display.player3 = game.player4;
		display.player4 = game.player3;
		board1Flip = true;
	} else if (userPosition === 3) {
		display.player1 = game.player3;
		display.player2 = game.player4;
		display.player3 = game.player1;
		display.player4 = game.player2;
		board2Flip = true;
	} else {
		display.player1 = game.player4;
		display.player2 = game.player3;
		display.player3 = game.player2;
		display.player4 = game.player1;
		board1Flip = true;
	}
	return {
		game,
		display,
		board1Flip,
		board2Flip,
		userPosition: state.game.userPosition,
		moves: state.game.moves,
		user: state.user.currentUser
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateMoves: moves => dispatch(updateMoves(moves))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoardsComponent);
