import React from 'react';

export default class JoinGameModalComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="modal fade" id="gameModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-sm">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h3 className="modal-title" id="myModalLabel">Join this game</h3>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-xs-6">
									<button type="button" id="joinPlayer2" className="btn btn-secondary centerDiv"
											ng-click="joinPlayer($event)">Join this side
									</button>
								</div>
								<div className="col-xs-6">
									<button type="button" id="joinPlayer3" className="btn btn-secondary centerDiv"
											ng-click="joinPlayer($event)">Join this side
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-6">
									<img className="centerDiv" style="margin-top: 3px; margin-bottom: 3px"
										 src="../../app/static/img/assets/initialBoardWhite.png" alt="Chess Board" width="100px" height="100px" />
								</div>
								<div className="col-xs-6">
									<img className="centerDiv" style="margin-top: 3px; margin-bottom: 3px"
										 src="../../app/static/img/assets/initialBoardBlack.png" alt="Chess Board" width="100px" height="100px" />
								</div>
							</div>
							<div className="row">
								<div className="col-xs-6">
									<button type="button" id="joinPlayer1" className="btn btn-secondary centerDiv"
											ng-click="joinPlayer($event)">Join this side
									</button>
								</div>
								<div className="col-xs-6">
									<button type="button" id="joinPlayer4" className="btn btn-secondary centerDiv"
											ng-click="joinPlayer($event)">Join this side
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
