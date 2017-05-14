import { connect } from 'react-redux';
import _ from 'lodash';
import OverviewComponent from '../../components/home/OverviewComponent';

function mapStateToProps(state) {
	return {
		showPaddingDiv: _.isEmpty(state.user.currentUser)
	};
}

export default connect(mapStateToProps)(OverviewComponent);
