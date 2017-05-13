import { connect } from 'react-redux';
import CreateGameComponent from '../../components/home/CreateGameComponent';
import { createGame } from '../../actions/lobby';

function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createGame: data => dispatch(createGame(data)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGameComponent);
