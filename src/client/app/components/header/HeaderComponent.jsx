import React from 'react';
import { Link } from 'react-router';

export default function HeaderComponent(props) {
	const headerStyle = {
		marginTop: '1em'
	};

	const navbarCollapseStyle = {
		paddingTop: '5px',
		paddingBottom: '5px'
	};

	const loggedInStyle = {
		display: props.isLoggedIn ? 'inline' : 'none'
	};

	const loggedOutStyle = {
		display: !props.isLoggedIn ? 'inline' : 'none'
	};

	return (
		<div className="container-fluid" style={headerStyle}>
			<div className="col-md-4">
				<Link to="/"><img src="app/static/img/assets/bug-text.png" alt="Bughouse Chess" width="223px" height="60px" /></Link>
			</div>
			<div className="col-md-7">
				<div className="collapse" style={navbarCollapseStyle}>
					<div className="navbar-right" id="myNavbar">
						<ul className="nav navbar-nav navbar-right">
							<li><Link to="/about">About</Link></li>
							<li style={loggedInStyle}><Link to="/register">Register</Link></li>
							<li style={loggedOutStyle}><Link to="/profile" data-toggle="tooltip" data-placement="bottom" title="Bullet, Blitz, Classical">My Profile</Link></li>
							<li style={loggedInStyle}><Link to="/logout"><span className="glyphicon glyphicon-log-out" />Logout</Link></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

