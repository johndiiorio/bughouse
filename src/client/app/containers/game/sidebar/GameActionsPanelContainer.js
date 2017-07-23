import { connect } from 'react-redux';
import GameActionsPanelComponent from '../../../components/game/sidebar/GameActionsPanelComponent';
import { updateDisplayResignChoice, updateDisplayDrawChoice } from '../../../actions/game';

function mapStateToProps(state) {
	return {
		id: state.game.game.id,
		userPosition: state.game.userPosition,
		displayResignChoice: state.game.displayResignChoice,
		displayDrawChoice: state.game.displayDrawChoice
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateDisplayResignChoice: display => dispatch(updateDisplayResignChoice(display)),
		updateDisplayDrawChoice: display => dispatch(updateDisplayDrawChoice(display))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GameActionsPanelComponent);
