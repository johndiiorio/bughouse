import { connect } from 'react-redux';
import LeaderboardComponent from '../../components/header/LeaderboardComponent';
import { fetchLeaderboardIfNeeded } from '../../actions/leaderboard';

function mapStateToProps(state) {
	return {
		data: state.leaderboard.data
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchLeaderBoard: () => dispatch(fetchLeaderboardIfNeeded())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardComponent);
