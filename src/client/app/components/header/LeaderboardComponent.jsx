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
						<h3 className="brighter-color">Bullet</h3>
						<UserListComponent data={this.props.bullet} ratingType="ratingBullet" />
					</div>
					<div className="col-xs-3">
						<h3 className="brighter-color">Blitz</h3>
						<UserListComponent data={this.props.blitz} ratingType="ratingBlitz" />
					</div>
					<div className="col-xs-3">
						<h3 className="brighter-color">Classical</h3>
						<UserListComponent data={this.props.classical} ratingType="ratingClassical" />
					</div>
				</div>
			</div>
		);
	}
}
