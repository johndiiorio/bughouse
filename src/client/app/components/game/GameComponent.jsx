import React from 'react';
import GameInfoPanelContainer from '../../containers/game/GameInfoPanelContainer';
import GameBoardsContainer from '../../containers/game/GameBoardsContainer';

export default function GameComponent() {
	return (
		<div className="container-fluid">
			<GameInfoPanelContainer />
			<GameBoardsContainer />
		</div>
	);
}
