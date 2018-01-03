import React from 'react';
import { Button } from 'react-bootstrap';
import HeaderContainer from '../../containers/header/HeaderContainer';
import RatingsChartContainer from '../../containers/profile/RatingsChartContainer';
import DisplayRatingComponent from './DisplayRatingComponent';
import PreviousGameComponent from './PreviousGameComponent';
import './css/profile.css';

export default class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);
		this.toggleShowGames = this.toggleShowGames.bind(this);
		this.state = {
			showGames: false
		};
	}

	toggleShowGames() {
		this.setState({ showGames: !this.state.showGames });
	}

	render() {
		const user = this.props.user;
		return (
			<div>
				<HeaderContainer />
				{ user ? (
					<div className="container-fluid">
						<div className="col-xs-2 shaded-box">
							<div>
								<div className="title-username">
									<h2>
										{user.title && <div className="title">{user.title}</div>}
										<div className="username">{user.username}</div>
									</h2>
								</div>
								<DisplayRatingComponent
									ratingType="Bullet"
									rating={this.props.bulletRating}
									rd={this.props.bulletRd}
								/>
								<DisplayRatingComponent
									ratingType="Blitz"
									rating={this.props.blitzRating}
									rd={this.props.blitzRd}
								/>
								<DisplayRatingComponent
									ratingType="Classical"
									rating={this.props.classicalRating}
									rd={this.props.classicalRd}
								/>
								<Button
									className="toggle-games-button"
									bsClass="btn btn-secondary"
									onClick={this.toggleShowGames}
								>
									{ this.state.showGames ? 'Hide games' : 'Show games' }
								</Button>
							</div>
						</div>
						<div className="col-xs-10">
							{ !this.state.showGames &&
								<div className="shaded-box">
									<RatingsChartContainer />
								</div>}
							{ user && this.state.showGames &&
								<div>
									{user.gamesList.length === 0 ? (
										<h1 className="center-text">No games found</h1>
									) : (
										<div>
											{user.gamesList.map((game, index) =>
												<PreviousGameComponent key={index} game={game} />
											)}
										</div>
									)}
								</div>
							}
						</div>
					</div>
				) : (
					<h1 className="center-text">No user found</h1>
				)}
			</div>
		);
	}
}
