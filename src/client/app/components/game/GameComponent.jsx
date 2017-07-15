import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import GameInfoPanelContainer from '../../containers/game/GameInfoPanelContainer';
import GameBoardsContainer from '../../containers/game/GameBoardsContainer';

export default class GameComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderGameBoards: false
		};
	}

	componentWillMount() {
		this.props.getGameInfo(this.props.params.splat);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ renderGameBoards: nextProps.renderGameBoards });
	}

	render() {
		return (
			<div>
				<HeaderContainer />
				{ this.state.renderGameBoards &&
				<div className="container-fluid">
					<GameInfoPanelContainer />
					<GameBoardsContainer />
				</div>
				}
			</div>
		);
	}
}
