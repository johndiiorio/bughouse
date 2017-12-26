import { connect } from 'react-redux';
import LeaderBoardComponent from '../../components/header/LeaderBoardComponent';
import { fetchLeaderBoardIfNeeded } from '../../actions/leaderBoard';

function mapStateToProps(state) {
	return {
		data: state.leaderBoard.data
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchLeaderBoard: () => dispatch(fetchLeaderBoardIfNeeded())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoardComponent);
