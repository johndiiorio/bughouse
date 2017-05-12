import React from 'react';

export default class RegisterComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			email: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
	}

	componentWillMount() {

	}

	handleChangeUsername() {
		// check username availability
	}

	handleChangePassword() {

	}

	handleChangeEmail() {

	}

	handleSubmit() {

	}

	render() {
		const underlineStyle = {
			textDecoration: 'underline'
		};
		return (
			<div className="container-fluid brighter-color">
				<h3 className="brighter-color" style={underlineStyle}>Register</h3>
				<form onSubmit={this.handleSubmit}>
					<label>
						Username:
						<input type="text" value={this.state.username} placeholder="Username" onChange={this.handleChangeUsername} />
					</label>
					<label>
						Password:
						<input type="password" value={this.state.password} placeholder="Password" onChange={this.handleChangeUsername} />
					</label>
					<label>
						Email:
						<input type="email" value={this.state.email} placeholder="Email" onChange={this.handleChangeUsername} />
					</label>
					<input type="submit" value="Submit" />
				</form>

			</div>
		);
	}
}

