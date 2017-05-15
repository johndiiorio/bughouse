import { connect } from 'react-redux';
import RegisterComponent from '../../components/header/RegisterComponent';
import { updateCurrentUser } from '../../actions/user';

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user)),
	};
}

export default connect(null, mapDispatchToProps)(RegisterComponent);
