import React from 'react';
import { Button, Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import { socketGame } from '../../../socket';
import './css/gameActionsPanel.css';

export default class GameActionsPanelComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			offerResignDisabled: false,
			offerDrawDisabled: false,
			resignChoiceDisabled: false,
			drawChoiceDisabled: false
		};
		this.emitData = {
			id: this.props.id,
			userPosition: this.props.userPosition,
			token: localStorage.getItem('token')
		};
		this.handleOfferResign = this.handleOfferResign.bind(this);
		this.handleOfferDraw = this.handleOfferDraw.bind(this);
		this.handleAcceptResign = this.handleAcceptResign.bind(this);
		this.handleDeclineResign = this.handleDeclineResign.bind(this);
		this.handleAcceptDraw = this.handleAcceptDraw.bind(this);
		this.handleDeclineDraw = this.handleDeclineDraw.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayResignChoice) {
			this.setState({ resignChoiceDisabled: false });
		} else {
			this.setState({ offerResignDisabled: false });
		}
		if (nextProps.displayDrawChoice) {
			this.setState({ drawChoiceDisabled: false });
		} else {
			this.setState({ offerDrawDisabled: false });
		}
	}

	handleOfferResign() {
		socketGame.emit('offer resign', this.emitData);
		this.props.updateDisplayResignChoice(false);
		this.setState({ offerResignDisabled: true });
	}

	handleOfferDraw() {
		socketGame.emit('offer draw', this.emitData);
		this.props.updateDisplayDrawChoice(false);
		this.setState({ offerDrawDisabled: true });
	}

	handleAcceptResign() {
		socketGame.emit('accept resign', this.emitData);
		this.setState({ resignChoiceDisabled: true });
	}

	handleDeclineResign() {
		socketGame.emit('decline resign', this.emitData);
		this.setState({ resignChoiceDisabled: true });
	}

	handleAcceptDraw() {
		socketGame.emit('accept draw', this.emitData);
		this.setState({ drawChoiceDisabled: true });
	}

	handleDeclineDraw() {
		socketGame.emit('decline draw', this.emitData);
		this.setState({ drawChoiceDisabled: true });
	}

	render() {
		let resignPanel = null;
		let drawPanel = null;
		let resignDropdownButtonClassName = 'btn-secondary-no-hover';
		if (!this.state.resignChoiceDisabled) resignDropdownButtonClassName += ' flash-button';
		let drawDropdownButtonClassName = 'btn-secondary-no-hover';
		if (!this.state.drawChoiceDisabled) drawDropdownButtonClassName += ' flash-button';

		if (!this.props.displayResignChoice) {
			resignPanel = (
				<Button
					bsClass="btn btn-secondary leftActionButton"
					onClick={this.handleOfferResign}
					disabled={this.state.offerResignDisabled}
				>
					<Glyphicon glyph="flag" /> Offer resign
				</Button>
			);
		} else {
			resignPanel = (
				<Dropdown id="resignChoice" disabled={this.state.resignChoiceDisabled} className="leftActionButton">
					<Dropdown.Toggle className={resignDropdownButtonClassName}>
						<Glyphicon glyph="flag" /> Resign?
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<MenuItem eventKey="1" onClick={this.handleAcceptResign}>Accept</MenuItem>
						<MenuItem eventKey="2" onClick={this.handleDeclineResign}>Decline</MenuItem>
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!this.props.displayDrawChoice) {
			drawPanel = (
				<Button
					bsClass="btn btn-secondary"
					onClick={this.handleOfferDraw}
					disabled={this.state.offerDrawDisabled}
				>
					<Glyphicon glyph="hand-right" /> Offer draw
				</Button>
			);
		} else {
			drawPanel = (
				<Dropdown id="drawChoice" disabled={this.state.drawChoiceDisabled}>
					<Dropdown.Toggle className={drawDropdownButtonClassName}>
						<Glyphicon glyph="hand-right" /> Draw?
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<MenuItem eventKey="1" onClick={this.handleAcceptDraw}>Accept</MenuItem>
						<MenuItem eventKey="2" onClick={this.handleDeclineDraw}>Decline</MenuItem>
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		return (
			<div className="gameActionsPanelContainer">
				{ resignPanel }
				{ drawPanel }
			</div>
		);
	}
}
