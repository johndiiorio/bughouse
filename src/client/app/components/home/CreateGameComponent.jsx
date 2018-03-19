import React from 'react';
import _ from 'lodash';
import Slider from 'react-rangeslider';
import Toggle from 'react-toggle';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../../static/css/react-toggle-custom.css';
import '../../static/css/react-rangeslider-custom.css';

export default class CreateGameComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minutes: 5,
			increment: 5,
			ratingRange: 250,
			randomSwitch: true,
			mode: true
		};
		this.createGame = this.createGame.bind(this);
		this.handleMinutesChange = this.handleMinutesChange.bind(this);
		this.handleIncrementChange = this.handleIncrementChange.bind(this);
		this.handleRandomSwitchChange = this.handleRandomSwitchChange.bind(this);
		this.handleModeSwitchChange = this.handleModeSwitchChange.bind(this);
		this.handleRatingRangeChange = this.handleRatingRangeChange.bind(this);
		this.formatRatingRange = this.formatRatingRange.bind(this);
		this.getUserRating = this.getUserRating.bind(this);
	}

	handleMinutesChange(value) {
		this.setState({ minutes: value });
	}

	handleIncrementChange(value) {
		this.setState({ increment: value });
	}

	handleRatingRangeChange(value) {
		this.setState({ ratingRange: value });
	}

	handleRandomSwitchChange(e) {
		this.setState({ randomSwitch: e.target.checked });
	}

	handleModeSwitchChange(e) {
		this.setState({ mode: e.target.checked });
	}

	getUserRating() {
		let userRating;
		if (this.state.minutes < 3) {
			userRating = this.props.currentUser.ratingBullet;
		} else if (this.state.minutes >= 3 && this.state.minutes <= 8) {
			userRating = this.props.currentUser.ratingBlitz;
		} else {
			userRating = this.props.currentUser.ratingClassical;
		}
		return userRating;
	}

	formatRatingRange() {
		const userRating = this.getUserRating();
		if (this.state.ratingRange === 0) {
			return `Rating range: ${Math.round(userRating)}`;
		}
		return `Rating range: ${Math.round(userRating - this.state.ratingRange)} to ${Math.round(userRating + this.state.ratingRange)}`;
	}

	/**
	 * @param {string} side Can be 'white', 'black', or 'random'
	 */
	createGame(side) {
		const userRating = this.getUserRating();
		const gameInfo = {
			minutes: this.state.minutes,
			increment: this.state.increment,
			joinRandom: this.state.randomSwitch,
			mode: this.state.mode ? 'Rated' : 'Casual',
			ratingRange: `${userRating - this.state.ratingRange} - ${userRating + this.state.ratingRange}`,
			token: localStorage.getItem('token')
		};
		if (side === 'random') {
			side = Math.floor(Math.random() * 2) === 0 ? 'white' : 'black';
		}
		if (side === 'white') {
			gameInfo.player1 = this.props.currentUser.id;
			gameInfo.player2 = null;
		} else {
			gameInfo.player1 = null;
			gameInfo.player2 = this.props.currentUser.id;
		}
		this.props.createGame(gameInfo);
	}

	render() {
		const containerStyle = {
			maxWidth: 600
		};
		const underlineStyle = {
			textDecoration: 'underline'
		};
		return (
			<div>
				{!_.isEmpty(this.props.currentUser) &&
				<div className="col-md-2" style={containerStyle}>
					<h3 style={underlineStyle}>Create a new game:</h3>
					<p type="text" id="minutesDisplay">Minutes: {this.state.minutes}</p>
					<Slider min={1} max={20} tooltip={false} value={this.state.minutes} onChange={this.handleMinutesChange} />
					<br />
					<p type="text" id="incrementDisplay">Increment
						(seconds): {this.state.increment}</p>
					<Slider min={0} max={30} tooltip={false} value={this.state.increment}
						onChange={this.handleIncrementChange}
					/>
					<br />
					<p type="text" id="ratingDisplay">{this.formatRatingRange()}</p>
					<Slider min={0} max={500} step={10} tooltip={false} value={this.state.ratingRange}
						onChange={this.handleRatingRangeChange}
					/>
					<br />
					<p className="noBottomMargin">Players join random sides?</p>
					<Toggle defaultChecked={this.state.randomSwitch} icons={false} onChange={this.handleRandomSwitchChange} />
					<br /><br />
					<p className="noBottomMargin">Rated game?</p>
					<Toggle defaultChecked={this.state.mode} icons={false} onChange={this.handleModeSwitchChange} />
					<br /><br />
					<p>Choose your side and create game!</p>
					<ButtonGroup>
						<Button bsClass="btn btn-secondary" onClick={() => this.createGame('white')}>White</Button>
						<Button bsClass="btn btn-secondary" onClick={() => this.createGame('random')}>Random</Button>
						<Button bsClass="btn btn-secondary" onClick={() => this.createGame('black')}>Black</Button>
					</ButtonGroup>
				</div>
				}
			</div>
		);
	}
}
