import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { showErrorNotification } from '../../util/notifications';

export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleForgotPassword = this.handleForgotPassword.bind(this);
	}

	componentWillMount() {
		const token = localStorage.getItem('token');
		if (token) {
			axios.post('/api/login/token', {
				token: token,
			})
			.then(response => {
				this.props.updateCurrentUser(response.data);
			})
			.catch(() => {
				localStorage.removeItem('token');
			});
		}
	}

	componentDidMount() {
		if (this.inputUsername)	this.inputUsername.focus();
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
			this.inputUsername.focus();
			showErrorNotification('Invalid username/password combination');
		});
		this.setState({ username: '', password: '' });
	}

	handleForgotPassword() {
		browserHistory.push('/reset/');
	}

	render() {
		const containerStyle = {
			maxWidth: 600
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
			<div>
				{ _.isEmpty(this.props.currentUser) &&
				<div className="col-md-2" style={containerStyle}>
					<h3 style={underlineStyle}>Log in:</h3>
					<div style={loginStyle}>
						<form onSubmit={this.handleSubmit}>
							<div className="row" style={marginStyle}>
								<div className="col-md-12">
									<h5>Username</h5>
								</div>
								<div className="col-md-12">
									<input
										type="text" ref={c => { this.inputUsername = c; }}
										className="form-control input-sm"
										maxLength="25"
										value={this.state.username}
										onChange={this.handleUsernameChange}
									/>
								</div>
							</div>
							<div className="row" style={marginStyle}>
								<div className="col-md-12">
									<h5>Password</h5>
								</div>
								<div className="col-md-12">
									<input
										type="password"
										className="form-control input-sm"
										value={this.state.password}
										onChange={this.handlePasswordChange}
									/>
								</div>
							</div>
							<br />
							<div className="row" style={marginStyle}>
								<div className="col-md-12">
									<Button type="submit" bsClass="btn btn-secondary"> Sign in
									<span className="glyphicon glyphicon-log-in" />
									</Button>
									<Button
										bsClass="btn btn-secondary pull-right"
										onClick={this.handleForgotPassword}
									>
										Reset password
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
				}
			</div>
		);
	}
}
