import React from 'react';
import axios from 'axios';
import { Chessground } from 'chessground';
import ReserveContainer from '../../containers/game/ReserveContainer';
import { socketGame } from '../../socket';
import playSound from '../../util/sound';

export default class GameBoardsComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getRating = this.getRating.bind(this);
		this.getDurationFormat = this.getDurationFormat.bind(this);
		this.selectPromotionPiece = this.selectPromotionPiece.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onDropFromReserve = this.onDropFromReserve.bind(this);
		this.updateMoves = this.updateMoves.bind(this);
		this.updateGame = this.updateGame.bind(this);
		this.snapbackMove = this.snapbackMove.bind(this);
		this.handleGameOver = this.handleGameOver.bind(this);
		this.board1 = null;
		this.board2 = null;
		this.tmpPromotionPiece = null;
		this.tmpSourceSquare = null;
		this.tmpTargetSquare = null;
		socketGame.on('update game', this.updateGame);
		socketGame.on('snapback move', this.snapbackMove);
		socketGame.on('game over', this.handleGameOver);
	}

	componentDidMount() {
		socketGame.emit('room', this.props.game.id);
		const board1Config = {
			predroppable: {
				enabled: true,
			},
			movable: {
				color: (this.props.userPosition === 1 || this.props.userPosition === 3) ? 'white' : 'black',
			},
			events: {
				move: this.onDrop,
				dropNewPiece: this.onDropFromReserve
			}
		};
		const board2Config = {
			viewOnly: true,
			disableContextMenu: true,
		};

		this.board1 = Chessground(document.getElementById('board1'), board1Config);
		this.board2 = Chessground(document.getElementById('board2'), board2Config);

		if (this.props.userPosition === 1 || this.props.userPosition === 3) {
			this.board2.toggleOrientation();
		} else {
			this.board1.toggleOrientation();
		}
		if (this.props.userPosition === 2 || this.props.userPosition === 3) {
			document.getElementById('left-game-top-username').style.color = '#46BCDE';
			document.getElementById('left-game-bottom-username').style.color = '#FB667A';
			document.getElementById('right-game-top-username').style.color = '#46BCDE';
			document.getElementById('right-game-bottom-username').style.color = '#FB667A';
		}
	}

	getRating(player) {
		if (this.props.game.minutes < 3) return player.ratingBullet;
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) return player.ratingBlitz;
		return player.ratingClassical;
	}

	getDurationFormat(duration) {
		const minutes = Math.floor(duration / 60);
		let seconds = duration % 60;
		seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${seconds}`;
	}

	selectPromotionPiece(piece) {
		this.tmpPromotionPiece = piece;
		this.newPiece(piece, this.tmpTargetSquare);
		document.getElementById('whitePromotion').style.display = 'none';
		document.getElementById('blackPromotion').style.display = 'none';
		this.handleMove(this.tmpSourceSquare, this.tmpTargetSquare, piece);
	}

	handleMove(source, target, piece) {
		// Update UI without validating
		if (source === 'spare') {
			// TODO is this necessary?
			this.board1.newPiece(piece, target);
		} else {
			this.board1.move(source, target);
		}
		const data = { id: this.props.game.id, userPosition: this.props.userPosition, move: { source, target, piece, promotion: this.tmpPromotionPiece } };
		socketGame.emit('update game', data);
		// yourOpponentTimer.toggle();
		// yourTimer.toggle();
	}

	onDrop(source, target) {
		const piece = this.board1.state.pieces[target];
		// check if move is a pawn promotion, validate on server
		if (source !== 'spare' && piece.role === 'pawn' && (target.charAt(1) === '1' || target.charAt(1) === '8')) {
			const putData = { source: source, target: target, piece: piece, userPosition: this.props.userPosition };
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

	onDropFromReserve(role, position) {

	}

	updateMoves(moves) {
		const newMoves = this.props.moves;
		const arrMoves = moves.trim().split(' ');
		for (let i = 0; i < arrMoves.length; i += 2) {
			const playerLetter = arrMoves[i].charAt(arrMoves[i].length - 2);
			const moveNumber = arrMoves[i].substring(0, arrMoves[i].length - 2);
			const moveStr = arrMoves[i + 1];
			if (!newMoves[parseInt(moveNumber) - 1]) {
				newMoves[parseInt(moveNumber) - 1] = {};
			}
			newMoves[parseInt(moveNumber) - 1].number = moveNumber;
			if (playerLetter === 'A') {
				newMoves[moveNumber - 1].player1 = moveStr;
			} else if (playerLetter === 'a') {
				newMoves[moveNumber - 1].player2 = moveStr;
			} else if (playerLetter === 'B') {
				newMoves[moveNumber - 1].player3 = moveStr;
			} else {
				newMoves[moveNumber - 1].player4 = moveStr;
			}
		}
		this.props.updateMoves(newMoves);
		document.getElementById('movesTableTBody').scrollTop = document.getElementById('movesTableTBody').style.height;
	}

	updateGame(data) {
		if (this.props.userPosition === 1 || this.props.userPosition === 2) {
			if (data.boardNum === 1) {
				this.board1.set({ fen: data.fen, turnColor: data.turn });
				if (data.capture) {
					playSound('capture');
				} else {
					playSound('move');
				}
			} else {
				this.board2.set({ fen: data.fen });
			}
			// this.board1.updateSparePieces('white', data.leftReserveWhite);
			// this.board1.updateSparePieces('black', data.leftReserveBlack);
			// this.board2.updateSparePieces('white', data.rightReserveWhite);
			// this.board2.updateSparePieces('black', data.rightReserveBlack);
		} else {
			if (data.boardNum === 1) {
				this.board2.set({ fen: data.fen });
			} else {
				this.board1.set({ fen: data.fen, turnColor: data.turn });
				if (data.capture) {
					playSound('capture');
				} else {
					playSound('move');
				}
			}
			// this.board1.updateSparePieces('white', data.rightReserveWhite);
			// this.board1.updateSparePieces('black', data.rightReserveBlack);
			// this.board2.updateSparePieces('white', data.leftReserveWhite);
			// this.board2.updateSparePieces('black', data.leftReserveBlack);
		}
		this.updateMoves(data.moves);
	}

	snapbackMove(data) {
		const oldTurnColor = this.board1.state.turnColor === 'white' ? 'black' : 'white';
		this.board1.set({ fen: data.fen, turnColor: oldTurnColor });
	}

	handleGameOver() {
		this.board1.stop();
		this.board2.stop();
	}

	render() {
		const boardStyle = {
			width: 500,
			height: 500
		};
		const rightGameStyle = {
			width: 500,
			height: 500,
			paddingLeft: 0,
			paddingRight: 0
		};
		return (
			<div>
				<div className="col-md-4">
					<h3 id="left-game-top-username">{`${this.props.display.player2.username} (${this.getRating(this.props.display.player2)})`}</h3>
					<div className="container-fluid align-reserve-clock-top">
						<ReserveContainer clickable={false} floatRight={false} margin="bottom" reserveColorFromPosition1="black" />
						<h3 id="left-game-top-clock">
							{this.getDurationFormat(this.props.game.minutes * 60)}
						</h3>
					</div>
					<div id="whitePromotion" className="promotion-box">
						<img src="../../app/static/img/pieces/wikipedia/wQ.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'pawn' })}
						/>
						<img src="../../app/static/img/pieces/wN.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'knight' })}
						/>
						<img src="../../app/static/img/pieces/wR.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'rook' })}
						/>
						<img src="../../app/static/img/pieces/wB.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'bishop' })}
						/>
					</div>
					<div id="blackPromotion" className="promotion-box">
						<img src="../../app/static/img/pieces/bQ.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'pawn' })}
						/>
						<img src="../../app/static/img/pieces/bN.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'knight' })}
						/>
						<img src="../../app/static/img/pieces/bR.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'rook' })}
						/>
						<img src="../../app/static/img/pieces/bB.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'bishop' })}
						/>
					</div>
					<div id="board1" style={boardStyle} />
					<div className="align-reserve-clock-bottom">
						<ReserveContainer clickable floatRight={false} margin="top" reserveColorFromPosition1="white" />
						<h3 id="left-game-bottom-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
					<h3 id="left-game-bottom-username">{`${this.props.display.player1.username} (${this.getRating(this.props.display.player1)})`}</h3>
				</div>
				<div className="col-md-4" style={rightGameStyle}>
					<h3 id="right-game-top-username">{`${this.props.display.player3.username} (${this.getRating(this.props.display.player3)})`}</h3>
					<div className="container-fluid align-reserve-clock-top">
						<h3 id="right-game-top-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
						<ReserveContainer clickable={false} floatRight margin="bottom" reserveColorFromPosition1="white" />
					</div>
					<div id="board2" style={boardStyle} />
					<div className="align-reserve-clock-bottom">
						<ReserveContainer clickable={false} floatRight margin="top" reserveColorFromPosition1="black" />
						<h3 id="right-game-bottom-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
					<h3 id="right-game-bottom-username">{`${this.props.display.player4.username} (${this.getRating(this.props.display.player4)})`}</h3>
				</div>
			</div>
		);
	}
}
