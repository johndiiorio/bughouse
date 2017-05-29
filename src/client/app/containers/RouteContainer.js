import { connect } from 'react-redux';
import _ from 'lodash';
import RouteComponent from '../components/RouteComponent';
import { clearNotifications } from '../actions/topLevel';

function mapStateToProps(state) {
	return {
		notification: state.topLevel.notification,
		gameExists: !_.isEmpty(state.lobby.selectedGame)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		clearNotifications: () => dispatch(clearNotifications())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteComponent);
