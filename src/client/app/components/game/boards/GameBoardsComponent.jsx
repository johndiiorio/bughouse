import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Chessground } from 'chessground';
import UserLinkComponent from '../../common/UserLinkComponent';
import ReserveContainer from '../../../containers/game/boards/ReserveContainer';
import { socketGame } from '../../../socket';
import Clock from '../../../util/Clock';
import playSound from '../../../util/sound';
import './css/gameBoards.css';

export default class GameBoardsComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getDurationFormat = this.getDurationFormat.bind(this);
		this.selectPromotionPiece = this.selectPromotionPiece.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.onDropFromBoard = this.onDropFromBoard.bind(this);
		this.onDropFromReserve = this.onDropFromReserve.bind(this);
		this.updateGame = this.updateGame.bind(this);
		this.parseAndUpdateMoves = this.parseAndUpdateMoves.bind(this);
		this.snapbackMove = this.snapbackMove.bind(this);
		this.handleGameOver = this.handleGameOver.bind(this);
		this.board1 = null;
		this.board2 = null;
		this.tmpPromotionPiece = null;
		this.tmpSourceSquare = null;
		this.tmpTargetSquare = null;
		this.squaresToHighlight = [];
		this.timer1 = null;
		this.timer2 = null;
		this.timer3 = null;
		this.timer4 = null;
		socketGame.on('update game', this.updateGame);
		socketGame.on('snapback move', this.snapbackMove);
		socketGame.on('game over', data => {
			playSound('notify');
			this.handleGameOver(data.termination);
		});
	}

	componentDidMount() {
		socketGame.emit('room', this.props.game.id);

		// Clocks
		const minutesInMilliseconds = this.props.game.minutes * 60 * 1000;
		const incrementInMilliseconds = this.props.game.increment * 1000;
		this.timer1 = new Clock(minutesInMilliseconds, incrementInMilliseconds, socketGame, this.props.game.id);
		this.timer2 = new Clock(minutesInMilliseconds, incrementInMilliseconds, socketGame, this.props.game.id);
		this.timer3 = new Clock(minutesInMilliseconds, incrementInMilliseconds, socketGame, this.props.game.id);
		this.timer4 = new Clock(minutesInMilliseconds, incrementInMilliseconds, socketGame, this.props.game.id);
		function format(display) {
			return (minutes, seconds, deciseconds) => {
				const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
				const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
				if (minutes === 0 && seconds === 0 && deciseconds === 0) {
					display.style.backgroundColor = '#a00000';
				}
				if (minutes < 1 && seconds < 10) {
					display.style.width = '168px';
					display.innerHTML = `${minutesDisplay}:${secondsDisplay}.${deciseconds}`;
				} else {
					display.innerHTML = `${minutesDisplay}:${secondsDisplay}`;
				}
			};
		}
		if (this.props.userPosition === 1) {
			this.timer1.onTick(format(document.getElementById('left-game-bottom-clock')));
			this.timer2.onTick(format(document.getElementById('left-game-top-clock')));
			this.timer3.onTick(format(document.getElementById('right-game-top-clock')));
			this.timer4.onTick(format(document.getElementById('right-game-bottom-clock')));
		} else if (this.props.userPosition === 2) {
			this.timer1.onTick(format(document.getElementById('left-game-top-clock')));
			this.timer2.onTick(format(document.getElementById('left-game-bottom-clock')));
			this.timer3.onTick(format(document.getElementById('right-game-bottom-clock')));
			this.timer4.onTick(format(document.getElementById('right-game-top-clock')));
		} else if (this.props.userPosition === 3) {
			this.timer1.onTick(format(document.getElementById('right-game-top-clock')));
			this.timer2.onTick(format(document.getElementById('right-game-bottom-clock')));
			this.timer3.onTick(format(document.getElementById('left-game-bottom-clock')));
			this.timer4.onTick(format(document.getElementById('left-game-top-clock')));
		} else {
			this.timer1.onTick(format(document.getElementById('right-game-bottom-clock')));
			this.timer2.onTick(format(document.getElementById('right-game-top-clock')));
			this.timer3.onTick(format(document.getElementById('left-game-top-clock')));
			this.timer4.onTick(format(document.getElementById('left-game-bottom-clock')));
		}

		// Hydrate state
		axios.get(`/api/games/state/${this.props.game.id}`)
			.then(res => {
				const data = res.data;
				if (data.moves) this.parseAndUpdateMoves(data.moves);
				this.props.updateReserves(data.leftReserveWhite, data.leftReserveBlack, data.rightReserveWhite, data.rightReserveBlack);

				// Hydrate resign and draw action buttons
				const resignState = data.resignState.split(',').map(Number);
				const drawState = data.drawState.split(',').map(Number);
				if ((this.props.userPosition === 1 && resignState[3] === 1)
					|| (this.props.userPosition === 2 && resignState[2] === 1)
					|| (this.props.userPosition === 3 && resignState[1] === 1)
					|| (this.props.userPosition === 4 && resignState[0] === 1)) {
					this.props.updateDisplayResignChoice(true);
				}
				if ((drawState[0] === 1 || drawState[1] === 1 || drawState[2] === 1 || drawState[3] === 1) && drawState[this.props.userPosition - 1] !== 1) {
					this.props.updateDisplayDrawChoice(true);
				}

				// Game boards
				const playingConfig = {
					predroppable: {
						enabled: true,
					},
					movable: {
						color: (this.props.userPosition === 1 || this.props.userPosition === 3) ? 'white' : 'black',
					},
					events: {
						move: this.onDropFromBoard,
						dropNewPiece: this.onDropFromReserve
					},
					animation: {
						enabled: false
					},
					viewOnly: false
				};
				const viewOnlyConfig = {
					viewOnly: true,
					disableContextMenu: true
				};
				const board1Config = this.props.isPlaying ? playingConfig : viewOnlyConfig;
				const leftConfig = {
					fen: data.leftFens[data.leftFens.length - 1],
					lastMove: data.leftLastMove,
					turnColor: data.leftColorToPlay
				};
				const rightConfig = {
					fen: data.rightFens[data.rightFens.length - 1],
					lastMove: data.rightLastMove,
					turnColor: data.rightColorToPlay
				};
				if (this.props.userPosition === 1 || this.props.userPosition === 2) {
					this.board1 = Chessground(document.getElementById('board1'), _.assign({}, leftConfig, board1Config));
					this.board2 = Chessground(document.getElementById('board2'), _.assign({}, rightConfig, viewOnlyConfig));
				} else {
					this.board1 = Chessground(document.getElementById('board1'), _.assign({}, rightConfig, board1Config));
					this.board2 = Chessground(document.getElementById('board2'), _.assign({}, leftConfig, viewOnlyConfig));
				}
				if (this.props.userPosition === 1 || this.props.userPosition === 3) {
					this.board2.toggleOrientation();
				} else {
					this.board1.toggleOrientation();
				}

				// Hydrate clocks
				const currentTime = Date.now();
				if (data.leftLastTime) {
					const diffTime = currentTime - data.leftLastTime;
					if (data.leftColorToPlay === 'white') {
						this.timer1.toggle(data.clocks[0] + diffTime);
						this.timer2.setDuration(minutesInMilliseconds - data.clocks[1]);
					} else {
						this.timer1.setDuration(minutesInMilliseconds - data.clocks[0]);
						this.timer2.toggle(data.clocks[1] + diffTime);
					}
				}
				if (data.rightLastTime) {
					const diffTime = currentTime - data.rightLastTime;
					if (data.rightColorToPlay === 'white') {
						this.timer3.toggle(data.clocks[2] + diffTime);
						this.timer4.setDuration(minutesInMilliseconds - data.clocks[3]);
					} else {
						this.timer3.setDuration(minutesInMilliseconds - data.clocks[2]);
						this.timer4.toggle(data.clocks[3] + diffTime);
					}
				}
				if (data.termination) {
					this.handleGameOver(data.termination);
				}
			}).catch(console.error);
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEmpty(nextProps.pieceToDragFromReserve)) {
			const mouseEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			});
			this.board1.dragNewPiece(nextProps.pieceToDragFromReserve, mouseEvent);
			this.props.updatePieceToDragFromReserve({});
		}
	}

	getDurationFormat(duration) {
		let minutes = Math.floor(duration / 60);
		minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
		let seconds = duration % 60;
		seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${seconds}`;
	}

	selectPromotionPiece(piece) {
		const mapping = { pawn: 'p', knight: 'n', bishop: 'b', rook: 'r', queen: 'q' };
		this.tmpPromotionPiece = mapping[piece.role];
		this.board1.newPiece(piece, this.tmpTargetSquare);
		document.getElementById('whitePromotion').style.display = 'none';
		document.getElementById('blackPromotion').style.display = 'none';
		this.handleMove(this.tmpSourceSquare, this.tmpTargetSquare, piece);
	}

	handleMove(source, target, piece) {
		if (source !== 'spare') {
			this.board1.move(source, target);
		}
		const data = {
			id: this.props.game.id,
			userPosition: this.props.userPosition,
			move: {
				source,
				target,
				piece,
				promotion: this.tmpPromotionPiece
			},
			token: localStorage.getItem('token')
		};
		socketGame.emit('update game', data);
		this.tmpPromotionPiece = null;
	}

	onDropFromBoard(source, target) {
		const piece = this.board1.state.pieces[target];
		// check if move is a pawn promotion, validate on server
		if (source !== 'spare' && piece.role === 'pawn' && (target.charAt(1) === '1' || target.charAt(1) === '8')) {
			const putData = { source, target, piece, userPosition: this.props.userPosition };
			axios.put(`/api/games/validate/pawnpromotion/${this.props.game.id}`, putData)
				.then(response => {
					const data = response.data;
					if (data.valid) {  // promotion is allowed, display popup to select piece
						const letter = target.charAt(0);
						let targetColumn;
						if (letter === 'a') targetColumn = 1;
						else if (letter === 'b') targetColumn = 2;
						else if (letter === 'c') targetColumn = 3;
						else if (letter === 'd') targetColumn = 4;
						else if (letter === 'e') targetColumn = 5;
						else if (letter === 'f') targetColumn = 6;
						else if (letter === 'g') targetColumn = 7;
						else targetColumn = 8;
						if (piece.color.charAt(0) === 'w') {
							document.getElementById('whitePromotion').style.display = 'block';
							document.getElementById('whitePromotion').style.transform = `translate(${(targetColumn * 62.5) - 62.5}px)`;
						} else {
							targetColumn = 9 - targetColumn;
							document.getElementById('blackPromotion').style.display = 'block';
							document.getElementById('blackPromotion').style.transform = `translate(${(targetColumn * 62.5) - 62.5}px)`;
						}
						this.tmpSourceSquare = source;
						this.tmpTargetSquare = target;
						delete this.board1.state.pieces[this.tmpSourceSquare];
					}
					this.board1.set({ fen: data.fen });
				})
				.catch(console.error('Error validating pawn promotion'));
		} else { // not a promotion, handle move normally
			this.handleMove(source, target, piece);
		}
	}

	onDropFromReserve(piece, target) {
		this.handleMove('spare', target, piece);
	}

	updateGame(data) {
		this.squaresToHighlight = data.move.source !== 'spare' ? [data.move.source, data.move.target] : [data.move.target];
		const boardStateWithTurnColor = {
			fen: data.fens[data.fens.length - 1],
			lastMove: this.squaresToHighlight,
			turnColor: data.turn
		};
		const boardStateWithoutTurnColor = {
			fen: data.fens[data.fens.length - 1],
			lastMove: this.squaresToHighlight
		};
		function handleSound() {
			if (data.capture) {
				playSound('capture');
			} else {
				playSound('move');
			}
		}
		if (this.props.userPosition === 1 || this.props.userPosition === 2) {
			if (data.boardNum === 1) {
				this.board1.set(boardStateWithTurnColor);
				this.updateTimers1And2(data.clocks, data.turn);
				handleSound();
			} else {
				this.board2.set(boardStateWithoutTurnColor);
				this.updateTimers3And4(data.clocks, data.turn);
			}
		} else {
			if (data.boardNum === 1) {
				this.board2.set(boardStateWithoutTurnColor);
				this.updateTimers1And2(data.clocks, data.turn);
			} else {
				this.board1.set(boardStateWithTurnColor);
				this.updateTimers3And4(data.clocks, data.turn);
				handleSound();
			}
		}
		this.props.updateReserves(data.leftReserveWhite, data.leftReserveBlack, data.rightReserveWhite, data.rightReserveBlack);
		this.props.updateClocks(data.clocks);
		this.parseAndUpdateMoves(data.moves);
		this.board1.playPremove();
		this.board1.playPredrop();
	}

	updateTimers1And2(clocks, turn) {
		if (!this.timer1.isRunning() && !this.timer2.isRunning() && turn === 'black') { // Start clocks at end of white's first move
			this.timer2.toggle(clocks[0]);
		} else if (!this.timer1.isRunning() && !this.timer2.isRunning() && turn === 'white') {
			// do nothing
		} else { // Not end of first full move, toggle both clocks
			this.timer1.toggle(clocks[0]);
			this.timer2.toggle(clocks[1]);
		}
	}

	updateTimers3And4(clocks, turn) {
		if (!this.timer3.isRunning() && !this.timer4.isRunning() && turn === 'black') { // Start clocks at end of white's first move
			this.timer4.toggle(clocks[2]);
		} else if (!this.timer3.isRunning() && !this.timer4.isRunning() && turn === 'white') {
			// do nothing
		} else { // Not first move, toggle both clocks
			this.timer3.toggle(clocks[2]);
			this.timer4.toggle(clocks[3]);
		}
	}

	parseAndUpdateMoves(moves) {
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

	snapbackMove(data) {
		const oldTurnColor = this.board1.state.turnColor === 'white' ? 'black' : 'white';
		this.board1.set({ fen: data.fen, lastMove: this.squaresToHighlight, turnColor: oldTurnColor });
	}

	handleGameOver(gameTermination) {
		this.board1.stop();
		this.board2.stop();
		this.timer1.running = false;
		this.timer2.running = false;
		this.timer3.running = false;
		this.timer4.running = false;
		this.props.updateGameTermination(gameTermination);
	}

	render() {
		return (
			<div>
				<div className="col-md-4">
					<h3>
						<UserLinkComponent user={this.props.display.player2} rating={this.props.display.player2.rating} />
					</h3>
					<div className="container-fluid align-reserve-clock-top">
						<ReserveContainer clickable={false} floatRight={false} margin="bottom" reservePosition={2} />
						<div id="left-game-top-clock">
							{this.getDurationFormat(this.props.game.minutes * 60)}
						</div>
					</div>
					<div id="whitePromotion" className="promotion-box">
						<img src="/app/static/img/pieces/wQ.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'queen' })}
						/>
						<img src="/app/static/img/pieces/wN.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'knight' })}
						/>
						<img src="/app/static/img/pieces/wR.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'rook' })}
						/>
						<img src="/app/static/img/pieces/wB.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'white', role: 'bishop' })}
						/>
					</div>
					<div id="blackPromotion" className="promotion-box">
						<img src="/app/static/img/pieces/bQ.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'queen' })}
						/>
						<img src="/app/static/img/pieces/bN.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'knight' })}
						/>
						<img src="/app/static/img/pieces/bR.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'rook' })}
						/>
						<img src="/app/static/img/pieces/bB.svg"
							className="promotionPiece"
							onClick={() => this.selectPromotionPiece({ color: 'black', role: 'bishop' })}
						/>
					</div>
					<div id="board1" className="boardContainer" />
					<div className="align-reserve-clock-bottom">
						<ReserveContainer clickable floatRight={false} margin="top" reservePosition={1} />
						<h3 id="left-game-bottom-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
					<h3 className="left-game-bottom-username">
						<UserLinkComponent user={this.props.display.player1} rating={this.props.display.player1.rating} />
					</h3>
				</div>
				<div className="col-md-4 rightGame">
					<h3 className="right-game-top-username">
						<UserLinkComponent user={this.props.display.player3} rating={this.props.display.player3.rating} />
					</h3>
					<div className="container-fluid align-reserve-clock-top">
						<h3 id="right-game-top-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
						<ReserveContainer clickable={false} floatRight margin="bottom" reservePosition={3} />
					</div>
					<div id="board2" className="boardContainer" />
					<div className="align-reserve-clock-bottom">
						<ReserveContainer clickable={false} floatRight margin="top" reservePosition={4} />
						<h3 id="right-game-bottom-clock">{this.getDurationFormat(this.props.game.minutes * 60)}</h3>
					</div>
					<h3 className="right-game-bottom-username">
						<UserLinkComponent user={this.props.display.player4} rating={this.props.display.player4.rating} />
					</h3>
				</div>
			</div>
		);
	}
}
