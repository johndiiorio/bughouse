import { connect } from 'react-redux';
import GameInfoPanelComponent from '../../../components/game/sidebar/GameInfoPanelComponent';

function mapStateToProps(state) {
	return {
		game: state.game.game,
		moves: state.game.moves,
		isPlaying: state.game.isPlaying
	};
}

export default connect(mapStateToProps)(GameInfoPanelComponent);
