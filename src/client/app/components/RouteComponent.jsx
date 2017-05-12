import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import axios from 'axios';
import HomeComponent from './HomeComponent';
import AboutComponent from './AboutComponent';
import NotFoundComponent from './NotFoundComponent';
import RegisterComponent from './RegisterComponent';
import GameComponent from './GameComponent';
import GameReviewComponent from './GameReviewComponent';
import ProfileComponent from './ProfileComponent';

function requireAuth(nextState, replace) {
	function redirectRoute() {
		replace({
			pathname: '/login',
			state: { nextPathname: nextState.location.pathname }
		});
	}
	const token = localStorage.getItem('token');
	// Redirect route to login page if the auth token does not exist
	if (!token) {
		redirectRoute();
		return;
	}
	// Verify that the auth token is valid
	axios.post('/api/verification/', { token }, { validateStatus: status => (status >= 200 && status < 300) || (status === 401 || status === 403) })
		.then(res => {
			// Route to login page if the auth token is not valid
			if (!res.data.success) browserHistory.push('/login');
		})
		.catch(console.error);
}

export default function RouteComponent() {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={HomeComponent} />
			<Route path="/about" component={AboutComponent} />
			<Route path="/profile" component={ProfileComponent} />
			<Route path="/register" component={RegisterComponent} />
			<Route path="/game" component={GameComponent} />
			<Route path="/review" component={GameReviewComponent} />
			<Route path="*" component={NotFoundComponent} />
		</Router>
	);
}
