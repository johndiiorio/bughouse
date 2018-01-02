import { connect } from 'react-redux';
import LoadingComponent from '../../components/game/LoadingComponent';
import { toggleUserWaitingForGameToStart } from '../../actions/lobby';

function mapStateToProps(state) {
	return {
		userWaitingForGameToStart: state.lobby.userWaitingForGameToStart,
		selectedGameID: state.lobby.selectedGame.id
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleUserWaitingForGameToStart: () => dispatch(toggleUserWaitingForGameToStart())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);
