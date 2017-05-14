import { connect } from 'react-redux';
import _ from 'lodash';
import OverviewComponent from '../../components/home/OverviewComponent';
import { updateDisplayedGames } from '../../actions/lobby';

function mapStateToProps(state) {
	return {
		showPaddingDiv: _.isEmpty(state.user.currentUser)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateDisplayedGames: () => dispatch(updateDisplayedGames())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewComponent);
