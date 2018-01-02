import { connect } from 'react-redux';
import LobbyComponent from '../../components/home/LobbyComponent';
import { updateSelectedGame, updateModalDisplayedGame, toggleModalDisplay } from '../../actions/lobby';

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser,
		selectedGame: state.lobby.selectedGame,
		displayedGames: state.lobby.displayedGames
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateSelectedGame: game => dispatch(updateSelectedGame(game)),
		updateModalDisplayedGame: game => dispatch(updateModalDisplayedGame(game)),
		toggleModalDisplay: () => dispatch(toggleModalDisplay()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
