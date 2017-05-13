import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import OverviewContainer from '../../containers/home/OverviewContainer';

export default function HomeComponent() {
	return (
		<div>
			<HeaderContainer />
			<OverviewContainer />
		</div>
	);
}
