import { connect } from 'react-redux';
import LeaderboardComponent from '../../components/leaderboard/LeaderboardComponent';
import { fetchLeaderboardIfNeeded } from '../../actions/leaderboard';

function mapStateToProps(state) {
	return {
		bullet: state.leaderboard.data.bullet,
		blitz: state.leaderboard.data.blitz,
		classical: state.leaderboard.data.classical
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchLeaderboard: () => dispatch(fetchLeaderboardIfNeeded())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardComponent);
