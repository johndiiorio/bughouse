import { connect } from 'react-redux';
import RouteComponent from '../components/RouteComponent';
import { clearNotifications } from '../actions/topLevel';
import { updateIsPlaying } from '../actions/game';

function mapStateToProps(state) {
	return {
		notification: state.topLevel.notification,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateIsPlaying: gameID => dispatch(updateIsPlaying(gameID)),
		clearNotifications: () => dispatch(clearNotifications())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteComponent);
