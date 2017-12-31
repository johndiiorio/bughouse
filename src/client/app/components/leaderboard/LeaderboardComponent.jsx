import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import UserListComponent from './UserListComponent';

export default class LeaderboardComponent extends React.Component {
	componentWillMount() {
		this.props.fetchLeaderboard();
	}

	render() {
		return (
			<div>
				<HeaderContainer />
				<div className="container-fluid">
					<div className="col-xs-3">
						<h3>Bullet</h3>
						<UserListComponent data={this.props.bullet} />
					</div>
					<div className="col-xs-3">
						<h3>Blitz</h3>
						<UserListComponent data={this.props.blitz} />
					</div>
					<div className="col-xs-3">
						<h3>Classical</h3>
						<UserListComponent data={this.props.classical} />
					</div>
				</div>
			</div>
		);
	}
}
