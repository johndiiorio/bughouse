import { connect } from 'react-redux';
import GameBoardsComponent from '../../components/game/GameBoardsComponent';

function mapStateToProps(state) {
	let userPosition;
	let board1Flip = false;
	let board2Flip = false;
	const display = {};
	const game = state.game.game;
	const user = state.user.currentUser;
	if (game.player1.id === user.id) {
		userPosition = 1;
		display.player1 = game.player1;
		display.player2 = game.player2;
		display.player3 = game.player3;
		display.player4 = game.player4;
		board2Flip = true;
	} else if (game.player2.id === user.id) {
		userPosition = 2;
		display.player1 = game.player2;
		display.player2 = game.player1;
		display.player3 = game.player4;
		display.player4 = game.player3;
		board1Flip = true;
	} else if (game.player3.id === user.id) {
		userPosition = 3;
		display.player1 = game.player3;
		display.player2 = game.player4;
		display.player3 = game.player1;
		display.player4 = game.player2;
		board2Flip = true;
	} else {
		userPosition = 4;
		display.player1 = game.player4;
		display.player2 = game.player3;
		display.player3 = game.player2;
		display.player4 = game.player1;
		board1Flip = true;
	}
	return {
		user,
		game,
		userPosition,
		display,
		board1Flip,
		board2Flip,
		moves: state.game.moves,
	};
}

export default connect(mapStateToProps)(GameBoardsComponent);
