import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';
import NotificationSystem from 'react-notification-system';
import HomeComponent from './home/HomeComponent';
import AboutComponent from './about/AboutComponent';
import ResetContainer from '../containers/reset/ResetContainer';
import RegisterContainer from '../containers/register/RegisterContainer';
import LeaderboardContainer from '../containers/leaderboard/LeaderboardContainer';
import LoadingContainer from '../containers/game/LoadingContainer';
import GameContainer from '../containers/game/GameContainer';
import ProfileContainer from '../containers/profile/ProfileContainer';

export default class RouteComponent extends React.Component {
	constructor(props) {
		super(props);
		this.requireAboutToPlay = this.requireAboutToPlay.bind(this);
		this.requireProfileUser = this.requireProfileUser.bind(this);
		this.requireResetToken = this.requireResetToken.bind(this);
		this.requireGame = this.requireGame.bind(this);
		this.requireAuth = this.requireAuth.bind(this);
		this.enterHomeComponent = this.enterHomeComponent.bind(this);
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

	requireAboutToPlay() {
		if (!localStorage.getItem('token') || !this.props.selectedGame.id) {
			browserHistory.push('/');
		}
	}

	requireProfileUser(nextState) {
		const username = nextState.params.splat;
		this.props.updateSelectedProfile(username);
	}

	requireResetToken(nextState) {
		const resetToken = nextState.params.splat;
		if (resetToken) {
			this.props.updateResetToken(resetToken);
			browserHistory.push('/reset/');
		}
	}

	requireGame(nextState) {
		const gameID = nextState.params.splat;
		if (localStorage.getItem('token')) {
			this.props.updateIsPlaying(gameID);
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

	enterHomeComponent() {
		// Clear game information
		this.props.resetGameState();
		this.props.clearSelectedGame();
		return true;
	}

	render() {
		return (
			<div>
				<NotificationSystem ref={c => { this.notificationSystem = c; }} />
				<Router history={browserHistory}>
					<Route path="/about" component={AboutComponent} />
					<Route path="/user/*" component={ProfileContainer} onEnter={this.requireProfileUser} />
					<Route path="/register" component={RegisterContainer} />
					<Route path="/reset/*" component={ResetContainer} onEnter={this.requireResetToken} />
					<Route path="/leaderboard" component={LeaderboardContainer} />
					<Route path="/loading" component={LoadingContainer} onEnter={this.requireAboutToPlay} />
					<Route path="/game/*" component={GameContainer} onEnter={this.requireGame} />
					<Route path="*" component={HomeComponent} onEnter={this.enterHomeComponent} />
				</Router>
			</div>
		);
	}
}
