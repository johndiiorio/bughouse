import { connect } from 'react-redux';
import OverviewComponent from '../../components/home/OverviewComponent';
import { updateDisplayedGames } from '../../actions/lobby';

function mapDispatchToProps(dispatch) {
	return {
		updateDisplayedGames: () => dispatch(updateDisplayedGames())
	};
}

export default connect(null, mapDispatchToProps)(OverviewComponent);
