import { connect } from 'react-redux';
import ReserveComponent from '../../components/game/ReserveComponent';

function mapStateToProps(state) {
	return {
		userPosition: state.game.userPosition
	};
}

export default connect(mapStateToProps)(ReserveComponent);
