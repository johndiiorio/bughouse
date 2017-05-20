import React from 'react';
import axios from 'axios';
import { socketGame } from '../../socket';

export default class GameBoardsComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getRating = this.getRating.bind(this);
		this.getDurationFormat = this.getDurationFormat.bind(this);
		this.selectPromotionPiece = this.selectPromotionPiece.bind(this);
		this.addPieceToSquare = this.addPieceToSquare.bind(this);
		this.deletePieceFromSquare = this.deletePieceFromSquare.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.onDragStart = this.handleMove.bind(this);
		this.onDrop = this.handleMove.bind(this);
		this.updateMoves = this.updateMoves.bind(this);
		this.board1 = null;
		this.board2 = null;
		this.board1Turn = 'w';
		this.userPosition = null;
		this.tmpPromotionPiece = null;
		this.tmpSourceSquare = null;
		this.tmpTargetSquare = null;
		this.gameOver = false;
	}

	componentDidMount() {
		const cfg1 = {
			draggable: true,
			position: 'start',
			sparePieces: true,
			showNotation: false,
			snapbackSpeed: 0,
			snapSpeed: 0,
			appearSpeed: 0,
			onDragStart: this.onDragStart,
			onDrop: this.onDrop
		};
		const cfg2 = {
			draggable: false,
			position: 'start',
			sparePieces: true,
			showNotation: false
		};
		/*eslint-disable */ // Needed for global ChessBoard object from the chessboardjs library
		this.board1 = ChessBoard('board1', cfg1);
		this.board2 = ChessBoard('board2', cfg2);
		/*eslint-enable */
	}

	getRating(player) {
		if (this.props.game.minutes < 3) return this.props.game[player].ratingBullet;
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) return this.props.game[player].ratingBlitz;
		return this.props.game[player].ratingClassical;
	}

	getDurationFormat(duration) {
		const minutes = Math.floor(duration / 60);
		let seconds = duration % 60;
		seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${seconds}`;
	}

	selectPromotionPiece(piece) {
		this.tmpPromotionPiece = piece.charAt(1).toLowerCase();
		this.addPieceToSquare(this.tmpTargetSquare, piece);
		document.getElementById('whitePromotion').style.display = 'none';
		document.getElementById('blackPromotion').style.display = 'none';
		this.handleMove(this.tmpSourceSquare, this.tmpTargetSquare, piece);
	}

	addPieceToSquare(square, piece) {
		const newPosition = this.board1.position();
		newPosition[square] = piece;
		this.board1.position(newPosition);
	}

	deletePieceFromSquare(square) {
		const newPosition = this.board1.position();
		delete newPosition[square];
		this.board1.position(newPosition);
	}

	handleMove(source, target, piece) {
		// Update UI without validating
		if (source === 'spare') {
			this.addPieceToSquare(target, piece);
		} else {
			this.deletePieceFromSquare(source);
			this.addPieceToSquare(target, piece);
		}
		const data = { id: this.props.game.id, userPosition: this.userPosition, move: { source, target, piece, promotion: this.tmpPromotionPiece } };
		socketGame.emit('update game', data);
		// yourOpponentTimer.toggle();
		// yourTimer.toggle();
	}

	// check if moving piece is allowed
	onDragStart(source, piece) {
		return !(((this.userPosition === 1 || this.userPosition === 3) && piece.charAt(0) !== 'w') || ((this.userPosition === 2 || this.userPosition === 4) && piece.charAt(0) !== 'b') || (this.board1Turn !== piece.charAt(0)) || this.gameOver);
	}

	onDrop(source, target, piece) {
		// check if move is a pawn promotion, validate on server
		if (source !== 'spare' && piece.charAt(1).toLowerCase() === 'p' && (target.charAt(1) === '1' || target.charAt(1) === '8')) {
			const putData = { source: source, target: target, piece: piece, userPosition: this.userPosition };
			axios.put(`/api/games/validate/pawnpromotion/${this.props.game.id}`, putData)
				.then(response => () => {
					const data = response.data;
					if (data.valid) {  // promotion is allowed, display popup to select piece
						const letter = target.charAt(0);
						let targetColumn;
						if (letter === 'a') targetColumn = 1;
						else if (letter === 'b') targetColumn = 1;
						else if (letter === 'c') targetColumn = 1;
						else if (letter === 'd') targetColumn = 1;
						else if (letter === 'e') targetColumn = 1;
						else if (letter === 'f') targetColumn = 1;
						else if (letter === 'g') targetColumn = 1;
						else targetColumn = 8;
						if (piece.charAt(0) === 'w') {
							document.getElementById('whitePromotion').style.display = 'block';
							document.getElementById('whitePromotion').style.transform = `translate(${(targetColumn * 62) - 60}px, 64px)`;
						} else {
							targetColumn = 9 - targetColumn;
							document.getElementById('blackPromotion').style.display = 'block';
							document.getElementById('blackPromotion').style.transform = `translate(${(targetColumn * 62) - 60}px, 64px)`;
						}
						this.tmpSourceSquare = source;
						this.tmpTargetSquare = target;
						this.deletePieceFromSquare(this.tmpSourceSquare);
					}
					this.board1.position(data.fen);
					return 'snapback'; // remove the pawn being promoted or snapback the invalid piece move
				})
				.catch(console.log('Error validating pawn promotion'));
		} else { // not a promotion, handle move normally
			this.handleMove(source, target, piece);
		}
	}

	updateMoves(moves) {
		const arrMoves = moves.trim().split(' ');
		for (let i = 0; i < arrMoves.length; i += 2) {
			const playerLetter = arrMoves[i].charAt(arrMoves[i].length - 2);
			const moveNumber = arrMoves[i].substring(0, arrMoves[i].length - 2);
			const moveStr = arrMoves[i + 1];
			if (!this.props.moves[parseInt(moveNumber) - 1]) {
				this.props.moves[parseInt(moveNumber) - 1] = {};
			}
			this.props.moves[parseInt(moveNumber) - 1].number = moveNumber;
			if (playerLetter === 'A') {
				this.props.moves[moveNumber - 1].player1 = moveStr;
			} else if (playerLetter === 'a') {
				this.props.moves[moveNumber - 1].player2 = moveStr;
			} else if (playerLetter === 'B') {
				this.props.moves[moveNumber - 1].player3 = moveStr;
			} else {
				this.props.moves[moveNumber - 1].player4 = moveStr;
			}
		}
		document.getElementById('movesTableTBody').scrollTop = document.getElementById('movesTableTBody').style.height;
	}

	render() {
		const boardWidthStyle = {
			width: '500px'
		};
		return (
			<div>
				<div id="game-left" className="col-md-4">
					<div className="container-fluid align-name-clock-top">
						<h3 className="left-game-top-username">
							{`${this.props.game.player2.username} (${this.getRating('player2')})`}
						</h3>
						<h3 id="yourOpponentTime" className="left-game-clock">
							{this.getDurationFormat(this.props.game.minutes * 60)}
						</h3>
					</div>
					<div id="yourOpponentReserve" />
					<div id="whitePromotion" className="promotion_box">
						<img src="../../app/static/img/chesspieces/wikipedia/wQ.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('wQ')} />
						<img src="../../app/static/img/chesspieces/wikipedia/wN.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('wN')} />
						<img src="../../app/static/img/chesspieces/wikipedia/wR.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('wR')} />
						<img src="../../app/static/img/chesspieces/wikipedia/wB.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('wB')} />
					</div>
					<div id="blackPromotion" className="promotion_box">
						<img src="../../app/static/img/chesspieces/wikipedia/bQ.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('bQ')} />
						<img src="../../app/static/img/chesspieces/wikipedia/bN.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('bN')} />
						<img src="../../app/static/img/chesspieces/wikipedia/bR.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('bR')} />
						<img src="../../app/static/img/chesspieces/wikipedia/bB.png" className="promotion_piece" onClick={() => this.selectPromotionPiece('bB')} />
					</div>
					<div id="board1" style={boardWidthStyle} />
					<div id="yourReserve" />
					<div className="align-name-clock-bottom">
						<h3 className="left-game-bottom-username">
							{`${this.props.game.player1.username} (${this.getRating('player1')})`}</h3>
						<h3 id="yourTime" className="left-game-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
				</div>
				<div id="game-right" className="col-md-4">
					<div className="container-fluid align-name-clock-top">
						<h3 className="right-game-top-username">
							{`${this.props.game.player3.username} (${this.getRating('player3')})`}
						</h3>
						<h3 id="opponentAcrossTime" className="right-game-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
					<div id="opponentAcrossReserve" />
					<div id="board2" style={boardWidthStyle} />
					<div id="teammateReserve" />
					<div className="align-name-clock-bottom">
						<h3 className="right-game-bottom-username">
							{`${this.props.game.player4.username} (${this.getRating('player4')})`}</h3>
						<h3 id="teammateTime" className="right-game-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
				</div>
			</div>
		);
	}
}
