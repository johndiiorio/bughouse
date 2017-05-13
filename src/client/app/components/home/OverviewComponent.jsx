import React from 'react';
import CreateGameComponent from './CreateGameComponent';
import JoinGameModalComponent from './JoinGameModalComponent';
import LoginComponent from './LoginComponent';
import LobbyComponent from './LobbyComponent';

export default class OverviewComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		// TODO dispatch action to fetch open games
	}

	render() {
		const containerStyle = {
			marginTop: '2em'
		};
		return (
			<div className="container-fluid" style={containerStyle}>
				<CreateGameComponent />
				<LoginComponent />
				<div className="col-md-1" ng-show="!$parent.currentUser" />
				<LobbyComponent />
				<div className="col-md-1" />
				<JoinGameModalComponent />
			</div>
		);
	}
}
