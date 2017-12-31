import { connect } from 'react-redux';
import ProfileComponent from '../../components/profile/ProfileComponent';

function mapStateToProps(state) {
	const user = state.user.profileUsers[state.user.selectedProfile];
	if (user) {
		return {
			user,
			bulletRating: user.bulletRatings[user.bulletRatings.length - 1][1],
			bulletRd: user.bulletRd,
			blitzRating: user.blitzRatings[user.blitzRatings.length - 1][1],
			blitzRd: user.blitzRd,
			classicalRating: user.classicalRatings[user.classicalRatings.length - 1][1],
			classicalRd: user.classicalRd
		};
	} else {
		return {};
	}
}

export default connect(mapStateToProps)(ProfileComponent);
