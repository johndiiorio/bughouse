import { connect } from 'react-redux';
import ReserveComponent from '../../../components/game/boards/ReserveComponent';

function mapStateToProps(state) {
	return {
		userPosition: state.game.userPosition,
		reserves: state.game.reserves
	};
}

export default connect(mapStateToProps)(ReserveComponent);
