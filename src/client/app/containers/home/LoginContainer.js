import { connect } from 'react-redux';
import LoginComponent from '../../components/home/LoginComponent';
import { updateCurrentUser } from '../../actions/user';

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
