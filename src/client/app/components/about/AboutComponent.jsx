import React from 'react';
import HeaderContainer from '../../containers/header/HeaderContainer';

export default function AboutComponent() {
	const componentStyle = {
		marginTop: '2em'
	};

	return (
		<div>
			<HeaderContainer />
			<div className="container-fluid" style={componentStyle}>
				<div className="col-md-12">
					<h3>About the Bughouse variant</h3>
					<p>
						Bughouse is a chess variant played on two chessboards by four players in teams of two. Each team member
						faces one opponent of the other team. Partners are next to each other and one player has black, while the
						other has white. Each player plays the opponent as in a standard chess game, with the exception of the rules
						specified below.
					</p>
					<br />
					<h3>Rules</h3>
					<p>
						If a player captures a piece, that piece is immediately passed to their partner. The partner keeps these
						pieces in
						reserve and may, instead of playing a regular move, place one of these pieces on the board (similar to shogi
						and crazyhouse). Pieces in reserve may be placed on any vacant square, including squares where the
						piece delivers check or checkmate. However, pawns may not be dropped on the first or last rank. Dropped
						pawns may promote, but all promoted pawns convert back to pawns when captured. A pawn placed on the second
						rank may move two squares on its first move.
					</p>
					<p>
						Bughouse chess is usually played with chess clocks to prevent players from waiting indefinitely for a piece.
						This is why this website only allows timed games. At the start of the game, the clock starts for the players
						with the white pieces.
					</p>
					<p>
						The match ends when either of the games on the two boards ends. A game is won when one player gets
						checkmated, resigns, or forfeits on time. The match can be drawn by agreement or when two players run out of
						time or are checkmated simultaneously.
					</p>
					<br />
					<h3>About the Site</h3>
					<p>
						This web app is designed for the purpose of for chess players to play <a href="https://en.wikipedia.org/wiki/Bughouse_chess" target="_blank" rel="noopener noreferrer">Bughouse chess</a>. It is written
						with React + Redux + Bootstrap front-end with a Node.js (Express.js) + Socket.io + PostgreSQL backend. This
						site also utilizes a heavily modified version of jhlywa&apos;s <a href="https://github.com/jhlywa/chess.js/blob/master/README.md" target="_blank" rel="noopener noreferrer">Chess.js</a> and
						the <a href="https://github.com/ornicar/chessground" target="_blank" rel="noopener noreferrer">Chessground</a> library. The game notation is specified by the
						<a href="http://bughousedb.com/Lieven_BPGN_Standard.txt" target="_blank" rel="noopener noreferrer"> Bughouse Portable Game Notation standard</a>.
					</p>
					<br />
					<h3>Contribute and Contact</h3>
					<p>
						The source code of this web app is located <a href="https://github.com/johndiiorio/bughouse" target="_blank" rel="noopener noreferrer">here</a>. Send me an email, open a GitHub issue, or make a pull request.
					</p>
				</div>
			</div>
		</div>
	);
}
