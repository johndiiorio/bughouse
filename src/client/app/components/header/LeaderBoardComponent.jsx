import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';

export default class LeaderBoardComponent extends React.Component {
	componentWillMount() {
		this.props.fetchLeaderBoard();
	}

	render() {
		return (
			<div>
				<HeaderContainer />
			</div>
		);
	}
}
