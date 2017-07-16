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
		this.handleOfferResign = this.handleOfferResign.bind(this);
		this.handleOfferDraw = this.handleOfferDraw.bind(this);
		this.handleAcceptResign = this.handleAcceptResign.bind(this);
		this.handleDeclineResign = this.handleDeclineResign.bind(this);
		this.handleAcceptDraw = this.handleAcceptDraw.bind(this);
		this.handleDeclineDraw = this.handleDeclineDraw.bind(this);
	}

	handleOfferResign() {
		socketGame.emit('offer resign', { id: this.props.id, userPosition: this.props.userPosition });
		this.props.updateDisplayResignChoice(false);
	}

	handleOfferDraw() {
		socketGame.emit('offer draw', { id: this.props.id, userPosition: this.props.userPosition });
		this.props.updateDisplayDrawChoice(false);
	}

	handleAcceptResign() {
		socketGame.emit('accept resign', { id: this.props.id, userPosition: this.props.userPosition });
		this.setState({ resignChoiceDisabled: true });
	}

	handleDeclineResign() {
		socketGame.emit('decline resign', { id: this.props.id, userPosition: this.props.userPosition });
		this.setState({ resignChoiceDisabled: true });
	}

	handleAcceptDraw() {
		socketGame.emit('accept draw', { id: this.props.id, userPosition: this.props.userPosition });
		this.setState({ drawChoiceDisabled: true });
	}

	handleDeclineDraw() {
		socketGame.emit('decline draw', { id: this.props.id, userPosition: this.props.userPosition });
		this.setState({ drawChoiceDisabled: true });
	}

	render() {
		let resignPanel = null;
		let drawPanel = null;
		if (!this.props.displayResignChoice) {
			resignPanel = (
				<Button
					bsClass="btn btn-secondary"
					onClick={this.handleOfferResign}
					disabled={this.state.offerResignDisabled}
				>
					<Glyphicon glyph="flag" /> Offer resign
				</Button>
			);
		} else {
			resignPanel = (
				<Dropdown id="resignChoice" disabled={this.state.resignChoiceDisabled}>
					<Dropdown.Toggle className="btn-secondary-no-hover flash-button">
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
					<Dropdown.Toggle className="btn-secondary-no-hover flash-button">
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
