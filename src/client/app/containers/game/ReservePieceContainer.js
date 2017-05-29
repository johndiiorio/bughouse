import { connect } from 'react-redux';
import { updatePieceToDragFromReserve } from '../../actions/game';
import ReservePieceComponent from '../../components/game/ReservePieceComponent';

function mapDispatchToProps(dispatch) {
	return {
		updatePieceToDragFromReserve: piece => dispatch(updatePieceToDragFromReserve(piece))
	};
}

export default connect(null, mapDispatchToProps)(ReservePieceComponent);
