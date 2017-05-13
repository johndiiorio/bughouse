import { connect } from 'react-redux';
import _ from 'lodash';
import HeaderComponent from '../../components/header/HeaderComponent';

function mapStateToProps(state) {
	return {
		isLoggedIn: !_.isEmpty(state.user.currentUser)
	};
}

export default connect(mapStateToProps)(HeaderComponent);
