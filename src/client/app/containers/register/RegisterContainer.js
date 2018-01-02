import { connect } from 'react-redux';
import RegisterComponent from '../../components/register/RegisterComponent';
import { updateCurrentUser } from '../../actions/user';

function mapDispatchToProps(dispatch) {
	return {
		updateCurrentUser: user => dispatch(updateCurrentUser(user))
	};
}

export default connect(null, mapDispatchToProps)(RegisterComponent);
