import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import RatingsChartContainer from '../../containers/profile/RatingsChartContainer';
import UserLinkComponent from '../common/UserLinkComponent';

export default function ProfileComponent(props) {
	const user = props.user;
	return (
		<div>
			<HeaderContainer />
			<div className="container-fluid">
				<div className="col-xs-3">
					{user && <div>
						<h2>
							<UserLinkComponent user={user} />
						</h2>
						<div>
							<h3>Bullet</h3>
							<h4>{props.bulletRating}</h4>
							<h4>{props.bulletRd}</h4>
						</div>
						<div>
							<h3>Blitz</h3>
							<h4>{props.blitzRating}</h4>
							<h4>{props.blitzRd}</h4>
						</div>
						<div>
							<h3>Bullet</h3>
							<h4>{props.classicalRating}</h4>
							<h4>{props.classicalRd}</h4>
						</div>
					</div>}
				</div>
				<div className="col-xs-9">
					<RatingsChartContainer />
				</div>
			</div>
		</div>
	);
}
