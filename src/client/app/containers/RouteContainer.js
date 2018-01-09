import { connect } from 'react-redux';
import RouteComponent from '../components/RouteComponent';
import { clearNotifications, updateResetToken } from '../actions/topLevel';
import { clearSelectedGame } from '../actions/lobby';
import { updateIsPlaying, resetGameState } from '../actions/game';
import { updateSelectedProfile } from '../actions/user';

function mapStateToProps(state) {
	return {
		notification: state.topLevel.notification,
		selectedGame: state.lobby.selectedGame
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateIsPlaying: gameID => dispatch(updateIsPlaying(gameID)),
		updateSelectedProfile: username => dispatch(updateSelectedProfile(username)),
		updateResetToken: resetToken => dispatch(updateResetToken(resetToken)),
		clearNotifications: () => dispatch(clearNotifications()),
		resetGameState: () => dispatch(resetGameState()),
		clearSelectedGame: () => dispatch(clearSelectedGame())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteComponent);
