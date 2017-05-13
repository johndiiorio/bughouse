import React from 'react';

export default class LobbyComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="loginPanel" className="col-md-2" ng-show="!$parent.currentUser">
				<h3 className="brighter-color" style="text-decoration: underline">Login:</h3>
				<div style="background-color: #383838; padding-bottom: 10px">
					<form ng-submit="userLogIn()">
						<div className="row" style="margin: auto">
							<div className="col-md-12">
								<h5 className="brighter-color">Username</h5>
							</div>
							<div className="col-md-12">
								<input type="text" className="form-control input-sm" id="loginUsername" ng-model="login.username" />
							</div>
						</div>
						<div className="row" style="margin: auto">
							<div className="col-md-12">
								<h5 className="brighter-color">Password</h5>
							</div>
							<div className="col-md-12">
								<input type="password" className="form-control input-sm" id="loginPassword" ng-model="login.password" />
							</div>
						</div>
						<br />
						<div className="row" style="margin: auto">
							<div className="col-md-12">
								<button type="submit" className="btn btn-secondary">Sign in
									<span className="glyphicon glyphicon-log-in" />
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
