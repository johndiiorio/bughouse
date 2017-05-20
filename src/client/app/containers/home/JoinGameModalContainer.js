import { connect } from 'react-redux';
import JoinGameModalComponent from '../../components/home/JoinGameModalComponent';
import { updateSelectedGame, toggleModalDisplay } from '../../actions/lobby';
import { sendNotification } from '../../actions/topLevel';

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser,
		selectedGame: state.lobby.selectedGame,
		displayedGames: state.lobby.displayedGames,
		modalDisplayedGame: state.lobby.modalDisplayedGame,
		modalDisplay: state.lobby.modalDisplay
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateSelectedGame: game => dispatch(updateSelectedGame(game)),
		toggleModalDisplay: () => dispatch(toggleModalDisplay()),
		sendNotification: notification => dispatch(sendNotification(notification))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinGameModalComponent);
