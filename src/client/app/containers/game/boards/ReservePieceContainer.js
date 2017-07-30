import { connect } from 'react-redux';
import { updatePieceToDragFromReserve } from '../../../actions/game';
import ReservePieceComponent from '../../../components/game/boards/ReservePieceComponent';

function mapStateToProps(state) {
	return {
		gameOver: state.game.gameTermination !== ''
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updatePieceToDragFromReserve: piece => dispatch(updatePieceToDragFromReserve(piece))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservePieceComponent);
