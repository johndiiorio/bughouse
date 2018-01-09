import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import HeaderContainer from '../../containers/header/HeaderContainer';
import { showSuccessNotification, showErrorNotification } from '../../util/notifications';
import './css/reset.css';

export default class ResetComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.handleSendResetLink = this.handleSendResetLink.bind(this);
		this.handleResetPassword = this.handleResetPassword.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	handleSendResetLink() {
		axios.post('/api/login/forgot', { username: this.state.username })
			.then(() => {
				browserHistory.push('/');
				showSuccessNotification('Email sent');
			})
			.catch(() => {
				browserHistory.push('/');
				showErrorNotification('Failed to send email');
			});
	}

	handleResetPassword() {
		axios.post('/api/login/reset', { password: this.state.password, resetToken: this.props.resetToken })
			.then(() => {
				browserHistory.push('/');
				showSuccessNotification('Password reset');
			})
			.catch(() => {
				browserHistory.push('/');
				showErrorNotification('Failed to reset password');
			});
	}

	handleUsernameChange(e) {
		this.setState({ username: e.target.value });
	}

	handlePasswordChange(e) {
		this.setState({ password: e.target.value });
	}

	render() {
		const resetToken = this.props.resetToken;
		return (
			<div>
				<HeaderContainer />
				<div className="container-fluid">
					<div className="col-xs-3">
						{ !resetToken ? (
							<div>
								<h4>Email a link to reset your password</h4>
								<input
									type="email"
									className="extra-margin form-control input-sm"
									placeholder="Username"
									value={this.state.username}
									onChange={this.handleUsernameChange}
								/>
								<Button
									bsClass="btn btn-secondary"
									onClick={this.handleSendResetLink}
								>
									Email me
								</Button>
							</div>
						) : (
							<div>
								<h4>Enter in your new password</h4>
								<input
									type="password"
									className="extra-margin form-control input-sm"
									placeholder="Password"
									value={this.state.password}
									onChange={this.handlePasswordChange}
								/>
								<Button
									bsClass="btn btn-secondary"
									onClick={this.handleResetPassword}
								>
									Change password
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

		);
	}
}
