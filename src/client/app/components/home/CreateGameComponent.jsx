import React from 'react';
import _ from 'lodash';
import Slider from 'react-rangeslider';
import Toggle from 'react-toggle';
import 'react-rangeslider/lib/index.css';
import 'react-toggle/style.css';

export default class CreateGameComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minutes: 5,
			increment: 5,
			ratingRange: 0,
			randomSwitch: true,
			mode: true
		};
		this.createGame = this.createGame.bind(this);
		this.handleMinutesChange = this.handleMinutesChange.bind(this);
		this.handleIncrementChange = this.handleIncrementChange.bind(this);
		this.handleRandomSwitchChange = this.handleRandomSwitchChange.bind(this);
		this.handleModeSwitchChange = this.handleModeSwitchChange.bind(this);
		this.handleRatingRangeChange = this.handleRatingRangeChange.bind(this);
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

	/**
	 * @param {string} side Can be 'white', 'black', or 'random'
	 */
	createGame(side) {
		const gameInfo = {
			minutes: this.state.minutes,
			increment: this.state.increment,
			joinRandom: this.state.randomSwitch,
			status: 'open',
			mode: this.state.mode ? 'Rated' : 'Casual',
			ratingRange: this.state.ratingRange
		};
		if (side === 'random') {
			side = Math.floor(Math.random() * 2) === 0 ? 'white' : 'black';
		}
		if (side === 'white') {
			gameInfo.player1 = this.props.currentUser;
			gameInfo.player2 = null;
		} else {
			gameInfo.player1 = null;
			gameInfo.player2 = this.props.currentUser;
		}
		gameInfo.player3 = null;
		gameInfo.player4 = null;
		this.props.createGame(gameInfo);
	}

	render() {
		const createGameContainerStyle = {
			display: !_.isEmpty(this.props.currentUser) ? 'block' : 'none'
		};
		const underlineStyle = {
			textDecoration: 'underline'
		};
		return (
			<div className="col-md-3" style={createGameContainerStyle}>
				<h3 className="brighter-color" style={underlineStyle}>Create a new game:</h3>
				<p className="brighter-color" type="text" id="minutesDisplay">Minutes: {this.state.minutes}</p>
				<Slider min={1} max={20} value={this.state.minutes} onChange={this.handleMinutesChange} />
				<br />
				<p className="brighter-color" type="text" id="incrementDisplay">Increment (seconds): 5</p>
				<Slider min={1} max={30} value={this.state.increment} onChange={this.handleIncrementChange} />
				<br />
				<p className="brighter-color" type="text" id="ratingDisplay">Rating Range: {this.state.rating}</p>
				<Slider min={-500} max={500} step={10} value={this.state.ratingRange} onChange={this.handleRatingRangeChange} />
				<br />
				<p className="brighter-color noBottomMargin">Players join random sides?</p>
				<Toggle defaultChecked={this.state.randomSwitch} icons={false} onChange={this.handleRandomSwitchChange}	/>
				<br /><br />
				<p className="noBottomMargin brighter-color">Rated game?</p>
				<Toggle defaultChecked={this.state.mode} icons={false} onChange={this.handleModeSwitchChange} />
				<br /><br />
				<p className="brighter-color">Choose your side and create game!</p>
				<div className="btn-group" role="group">
					<button className="btn btn-secondary" onClick={this.createGame('white')}>White</button>
					<button className="btn btn-secondary" onClick={this.createGame('random')}>Random</button>
					<button className="btn btn-secondary" onClick={this.createGame('black')}>Black</button>
				</div>
			</div>
		);
	}
}
