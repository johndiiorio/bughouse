import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';
import RatingsChartContainer from '../../containers/profile/RatingsChartContainer';
import './css/profile.css';
import DisplayRatingComponent from './DisplayRatingComponent';

export default function ProfileComponent(props) {
	const user = props.user;
	return (
		<div>
			<HeaderContainer />
			<div className="container-fluid">
				<div className="col-xs-2">
					{user && <div>
						<div className="title-username">
							<h2>
								{ props.user.title && <div className="title">{props.user.title}</div> }
								<div className="username">{props.user.username}</div>
							</h2>
						</div>
						<DisplayRatingComponent
							ratingType="Bullet"
							rating={props.bulletRating}
							rd={props.bulletRd}
						/>
						<DisplayRatingComponent
							ratingType="Blitz"
							rating={props.blitzRating}
							rd={props.blitzRd}
						/>
						<DisplayRatingComponent
							ratingType="Classical"
							rating={props.classicalRating}
							rd={props.classicalRd}
						/>
					</div>}
				</div>
				<div className="col-xs-10">
					<RatingsChartContainer />
				</div>
			</div>
		</div>
	);
}
