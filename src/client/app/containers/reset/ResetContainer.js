import { connect } from 'react-redux';
import ResetComponent from '../../components/reset/ResetComponent';

function mapStateToProps(state) {
	return {
		resetToken: state.topLevel.resetToken
	};
}

export default connect(mapStateToProps)(ResetComponent);
