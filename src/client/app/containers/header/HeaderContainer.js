import { connect } from 'react-redux';
import _ from 'lodash';
import { updateCurrentUser } from '../../actions/user';
import HeaderComponent from '../../components/header/HeaderComponent';

function mapStateToProps(state) {
	return {
		isLoggedIn: !_.isEmpty(state.user.currentUser),
		username: !_.isEmpty(state.user.currentUser) ? state.user.currentUser.username : ''
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
