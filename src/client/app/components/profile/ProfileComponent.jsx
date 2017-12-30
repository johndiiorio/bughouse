import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';

export default class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<HeaderContainer />
			</div>
		);
	}
}
