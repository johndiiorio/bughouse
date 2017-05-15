import { connect } from 'react-redux';
import CreateGameComponent from '../../components/home/LoginComponent';
import { updateCurrentUser } from '../../actions/user';
import { sendNotification } from '../../actions/topLevel';

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user)),
		sendNotification: notification => dispatch(sendNotification(notification))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGameComponent);
