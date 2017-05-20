import { connect } from 'react-redux';
import GameBoardsComponent from '../../components/game/GameBoardsComponent';

function mapStateToProps(state) {
	return {
		user: state.user.currentUser,
		game: state.lobby.selectedGame,
		moves: state.game.moves
	};
}

export default connect(mapStateToProps)(GameBoardsComponent);
