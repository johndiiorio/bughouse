import React from 'react';
import CreateGameContainer from '../../containers/home/CreateGameContainer';
import JoinGameModalContainer from '../../containers/home/JoinGameModalContainer';
import LoginContainer from '../../containers/home/LoginContainer';
import LobbyContainer from '../../containers/home/LobbyContainer';

export default class OverviewComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.updateDisplayedGames();
	}

	render() {
		const containerStyle = {
			marginTop: '2em'
		};
		return (
			<div className="container-fluid" style={containerStyle}>
				<CreateGameContainer />
				<LoginContainer />
				<LobbyContainer />
				<div className="col-md-1" />
				<JoinGameModalContainer />
			</div>
		);
	}
}
