import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import GameSidebarComponent from './sidebar/GameSidebarComponent';
import GameBoardsContainer from '../../containers/game/boards/GameBoardsContainer';

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
					<GameSidebarComponent />
					<GameBoardsContainer isPlaying={this.props.isPlaying} />
				</div>
				}
			</div>
		);
	}
}
