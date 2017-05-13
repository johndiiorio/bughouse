import React from 'react';
import HeaderComponent from '../header/HeaderComponent';
import GameOverviewComponent from './GameOverviewComponent';

export default function HomeComponent() {
	return (
		<div>
			<HeaderComponent />
			<GameOverviewComponent />
		</div>
	);
}
