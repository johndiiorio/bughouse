import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import RatingsChartContainer from '../../containers/profile/RatingsChartContainer';

export default class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<HeaderContainer />
				<div className="container-fluid">
					<div className="col-xs-3">
					</div>
					<div className="col-xs-9">
						<RatingsChartContainer />
					</div>
				</div>
			</div>
		);
	}
}
