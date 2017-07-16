import React from 'react';
import { Button, Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import './css/gameActionsPanel.css';

export default class GameActionsPanelComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			resignChoice: false,
			drawChoice: false
		};
	}

	render() {
		let resignPanel = null;
		let drawPanel = null;
		if (!this.state.resignChoice) {
			resignPanel = (
				<Button	bsClass="btn btn-secondary"><Glyphicon glyph="flag" /> Offer resign</Button>
			);
		} else {
			resignPanel = (
				<Dropdown id="resignChoice">
					<Dropdown.Toggle className="btn-secondary-no-hover flash-button">
						<Glyphicon glyph="flag" /> Resign?
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<MenuItem eventKey="1">Accept</MenuItem>
						<MenuItem eventKey="2">Decline</MenuItem>
					</Dropdown.Menu>
				</Dropdown>
			);
		}
		if (!this.state.drawChoice) {
			drawPanel = (
				<Button	bsClass="btn btn-secondary"><Glyphicon glyph="hand-right" /> Offer draw</Button>
			);
		} else {
			drawPanel = (
				<Dropdown id="drawChoice">
					<Dropdown.Toggle className="btn-secondary-no-hover flash-button">
						<Glyphicon glyph="hand-right" /> Draw?
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<MenuItem eventKey="1">Accept</MenuItem>
						<MenuItem eventKey="2">Decline</MenuItem>
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
