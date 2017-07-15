import { connect } from 'react-redux';
import GameMovesPanelComponent from '../../components/game/GameMovesPanelComponent';

function mapStateToProps(state) {
	return {
		game: state.game.game,
		moves: state.game.moves
	};
}

export default connect(mapStateToProps)(GameMovesPanelComponent);
