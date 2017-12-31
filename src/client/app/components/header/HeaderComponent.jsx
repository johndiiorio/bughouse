import React from 'react';
import { Link } from 'react-router';

export default function HeaderComponent(props) {
	const headerStyle = {
		marginTop: '1em',
		marginBottom: '2em'
	};
	const linksContainerStyle = {
		marginTop: '5px',
		marginRight: '20px'
	};
	const displayAlwaysStyle = {
		marginLeft: '30px',
		display: 'inline'
	};
	const loggedInStyle = {
		marginLeft: '30px',
		display: props.isLoggedIn ? 'inline' : 'none'
	};
	const loggedOutStyle = {
		marginLeft: '30px',
		display: !props.isLoggedIn ? 'inline' : 'none'
	};

	function logout() {
		localStorage.removeItem('token');
		props.updateCurrentUser({});
	}

	return (
		<div className="container-fluid" style={headerStyle}>
			<div className="col-md-1">
				<Link to="/"><img src="/app/static/img/assets/bug-text.png" alt="Bughouse Chess" width="223px" height="60px" /></Link>
			</div>
			<div className="col-md-10" style={linksContainerStyle}>
				<div className="pull-right">
					<h4 style={displayAlwaysStyle}><Link to="/about">About</Link></h4>
					<h4 style={loggedOutStyle}><Link to="/register">Register</Link></h4>
					<h4 style={loggedInStyle}><Link to={`/user/${props.username}`}>{props.username}</Link></h4>
					<h4 style={displayAlwaysStyle}><Link to="/leaderboard">Leaderboard</Link></h4>
					<h4 style={loggedInStyle}><Link to="/" onClick={logout}>Logout</Link></h4>
				</div>
			</div>
		</div>
	);
}

