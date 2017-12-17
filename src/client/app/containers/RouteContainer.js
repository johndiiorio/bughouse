import { connect } from 'react-redux';
import RouteComponent from '../components/RouteComponent';
import { clearNotifications } from '../actions/topLevel';
import { clearSelectedGame } from '../actions/lobby';
import { updateIsPlaying, resetGameState } from '../actions/game';

function mapStateToProps(state) {
	return {
		notification: state.topLevel.notification,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateIsPlaying: gameID => dispatch(updateIsPlaying(gameID)),
		clearNotifications: () => dispatch(clearNotifications()),
		resetGameState: () => dispatch(resetGameState()),
		clearSelectedGame: () => dispatch(clearSelectedGame())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteComponent);
