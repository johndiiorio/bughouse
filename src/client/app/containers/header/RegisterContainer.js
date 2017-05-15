import { connect } from 'react-redux';
import RegisterComponent from '../../components/header/RegisterComponent';
import { updateCurrentUser } from '../../actions/user';
import { sendNotification } from '../../actions/topLevel';

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user)),
		sendNotification: notification => dispatch(sendNotification(notification))
	};
}

export default connect(null, mapDispatchToProps)(RegisterComponent);
