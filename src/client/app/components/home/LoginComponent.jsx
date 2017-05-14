import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import NotificationSystem from 'react-notification-system';
import { Button } from 'react-bootstrap';

export default class LobbyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.notificationSystem = null;
	}

	handleUsernameChange(e) {
		this.setState({ username: e.target.value });
	}

	handlePasswordChange(e) {
		this.setState({ password: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		axios.post('/api/login/', {
			username: this.state.username,
			password: this.state.password
		})
		.then(response => {
			localStorage.setItem('token', response.data.token);
			this.props.updateCurrentUser(response.data.user);
		})
		.catch(() => {
			this.notificationSystem.addNotification({
				message: 'Invalid username/password combination',
				level: 'error',
				position: 'tl',
				autoDismiss: 2
			});
		});
		this.setState({ username: '', password: '' });
	}

	render() {
		const containerStyle = {
			display: _.isEmpty(this.props.currentUser) ? 'block' : 'none'
		};
		const underlineStyle = {
			textDecoration: 'underline'
		};
		const loginStyle = {
			backgroundColor: '#383838',
			paddingBottom: '10px'
		};
		const marginStyle = {
			margin: 'auto'
		};
		return (
			<div className="col-md-2" style={containerStyle}>
				<NotificationSystem ref={c => { this.notificationSystem = c; }} />
				<h3 className="brighter-color" style={underlineStyle}>Login:</h3>
				<div style={loginStyle}>
					<form onSubmit={this.handleSubmit}>
						<div className="row" style={marginStyle}>
							<div className="col-md-12">
								<h5 className="brighter-color">Username</h5>
							</div>
							<div className="col-md-12">
								<input type="text" className="form-control input-sm" maxLength="25" value={this.state.username} onChange={this.handleUsernameChange} />
							</div>
						</div>
						<div className="row" style={marginStyle}>
							<div className="col-md-12">
								<h5 className="brighter-color">Password</h5>
							</div>
							<div className="col-md-12">
								<input type="password" className="form-control input-sm" value={this.state.password} onChange={this.handlePasswordChange} />
							</div>
						</div>
						<br />
						<div className="row" style={marginStyle}>
							<div className="col-md-12">
								<Button type="submit" bsClass="btn btn-secondary"> Sign in
									<span className="glyphicon glyphicon-log-in" />
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}