import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';
import NotificationSystem from 'react-notification-system';
import HomeComponent from './home/HomeComponent';
import AboutComponent from './header/AboutComponent';
import NotFoundComponent from './NotFoundComponent';
import RegisterContainer from '../containers/header/RegisterContainer';
import LoadingComponent from './game/LoadingComponent';
import GameContainer from '../containers/game/GameContainer';
import GameReviewComponent from './game/GameReviewComponent';
import ProfileComponent from './header/ProfileComponent';


export default class RouteComponent extends React.Component {
	constructor(props) {
		super(props);
		this.requireGame = this.requireGame.bind(this);
		this.requireAuth = this.requireAuth.bind(this);
	}

	shouldComponentUpdate() {
		// To ignore warning: [react-router] You cannot change 'Router routes'; it will be ignored
		return false;
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEmpty(nextProps.notification)) {
			this.notificationSystem.addNotification(nextProps.notification);
			this.props.clearNotifications();
		}
	}

	requireGame(nextState, replace) {
		if (!this.props.gameExists) {
			replace({
				pathname: '/',
				state: { nextPathname: nextState.location.pathname }
			});
		}
	}

	requireAuth(nextState, replace) {
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
	render() {
		return (
			<div>
				<NotificationSystem ref={c => { this.notificationSystem = c; }} />
				<Router history={browserHistory}>
					<Route path="/" component={HomeComponent} />
					<Route path="/about" component={AboutComponent} />
					<Route path="/profile" component={ProfileComponent} />
					<Route path="/register" component={RegisterContainer} />
					<Route path="/loading" component={LoadingComponent} />
					<Route path="/game" component={GameContainer} onEnter={this.requireGame} />
					<Route path="/review" component={GameReviewComponent} />
					<Route path="*" component={NotFoundComponent} />
				</Router>
			</div>
		);
	}
}
