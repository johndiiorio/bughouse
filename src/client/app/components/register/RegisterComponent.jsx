import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { Button, Form, FormGroup, FormControl, HelpBlock, Col } from 'react-bootstrap';
import HeaderContainer from '../../containers/header/HeaderContainer';
import { showErrorNotification } from '../../util/notifications';

export default class RegisterComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			usernameValid: null,
			usernameHelpBlock: '',
			password: '',
			passwordValid: null,
			passwordHelpBlock: '',
			email: '',
			emailValid: null,
			emailHelpBlock: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
		this.formValidityForSubmitButton = this.formValidityForSubmitButton.bind(this);
	}

	handleChangeUsername(e) {
		this.setState({ username: e.target.value });
		if (e.target.value === '') {
			this.setState({ usernameValid: null, usernameHelpBlock: '' });
		} else if (e.target.value.length > 15) {
			this.setState({ usernameValid: 'error', usernameHelpBlock: 'Username is too long' });
		} else {
			axios.get(`/api/users/username/${e.target.value}`)
				.then(() => this.setState({ usernameValid: 'error', usernameHelpBlock: 'This username is not available' }))
				.catch(() => this.setState({ usernameValid: 'success', usernameHelpBlock: '' }));
		}
	}

	handleChangePassword(e) {
		this.setState({ password: e.target.value });
		if (e.target.value === '') {
			this.setState({ passwordValid: null, passwordHelpBlock: '' });
		} else if (e.target.value.length < 6) {
			this.setState({ passwordValid: 'error', passwordHelpBlock: 'Password is too short' });
		} else if (e.target.value.length > 50) {
			this.setState({ passwordValid: 'error', passwordHelpBlock: 'Password is too long' });
		} else {
			this.setState({ passwordValid: 'success', passwordHelpBlock: '' });
		}
	}

	handleChangeEmail(e) {
		this.setState({ email: e.target.value });
		if (e.target.value === '') {
			this.setState({ emailValid: null, emailHelpBlock: '' });
		} else if (e.target.value.length < 3) {
			this.setState({ emailValid: 'error', emailHelpBlock: 'Email is too short' });
		} else if (e.target.value.length > 254) {
			this.setState({ emailValid: 'error', emailHelpBlock: 'Email is too long' });
		} else {
			this.setState({ emailValid: 'success', emailHelpBlock: '' });
		}
	}

	formValidityForSubmitButton() {
		return !(this.state.usernameValid === 'success' && this.state.passwordValid === 'success' && this.state.emailValid);
	}

	handleSubmit(e) {
		e.preventDefault();
		const postData = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email
		};
		axios.post('/api/users/', postData)
			.then(response => {
				localStorage.setItem('token', response.data.token);
				this.props.updateCurrentUser(response.data.user);
			})
			.catch(() => {
				showErrorNotification('Failed to register');
			})
			.then(() => {
				browserHistory.push('/');
			});
	}

	render() {
		const underlineStyle = {
			textDecoration: 'underline'
		};
		return (
			<div className="col-md-12">
				<HeaderContainer />
				<div className="container-fluid">
					<h3 style={underlineStyle}>Register:</h3>
					<Form horizontal onSubmit={this.handleSubmit}>
						<FormGroup validationState={this.state.usernameValid}>
							<Col md={4}>
								<FormControl
									type="text"
									value={this.state.username}
									placeholder="Username"
									onChange={this.handleChangeUsername}
								/>
								<FormControl.Feedback />
								<HelpBlock>{this.state.usernameHelpBlock}</HelpBlock>
							</Col>
						</FormGroup>
						<FormGroup validationState={this.state.passwordValid}>
							<Col md={4}>
								<FormControl
									type="password"
									value={this.state.password}
									placeholder="Password"
									onChange={this.handleChangePassword}
								/>
								<FormControl.Feedback />
								<HelpBlock>{this.state.passwordHelpBlock}</HelpBlock>
							</Col>
						</FormGroup>
						<FormGroup validationState={this.state.emailValid}>
							<Col md={4}>
								<FormControl
									type="email"
									value={this.state.email}
									placeholder="Email address"
									onChange={this.handleChangeEmail}
								/>
								<FormControl.Feedback />
								<HelpBlock>{this.state.emailHelpBlock}</HelpBlock>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col md={4}>
								<Button bsStyle="primary" type="submit" disabled={this.formValidityForSubmitButton()}>Register</Button>
							</Col>
						</FormGroup>
					</Form>
				</div>
			</div>
		);
	}
}

