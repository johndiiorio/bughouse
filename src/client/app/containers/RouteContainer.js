import { connect } from 'react-redux';
import RouteComponent from '../components/RouteComponent';
import { clearNotifications } from '../actions/topLevel';

function mapStateToProps(state) {
	return {
		notification: state.topLevel.notification
	};
}

function mapDispatchToProps(dispatch) {
	return {
		clearNotifications: () => dispatch(clearNotifications())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteComponent);
