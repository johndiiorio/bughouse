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
					<h3>About this site</h3>
					<p>
						This site app is designed for the purpose of for chess players to play
						<a href="https://en.wikipedia.org/wiki/Bughouse_chess" target="_blank" rel="noopener noreferrer"> Bughouse chess</a>.
						This site will always remain free, without ads, and without premium accounts.
					</p>
					<br />
					<h3>About the Bughouse chess variant</h3>
					<p>
						Bughouse is a chess variant played on two chessboards by four players in teams of two. Each team member
						faces one opponent of the other team. Partners are next to each other and one player has black, while the
						other has white. Each player plays the opponent as in a standard chess game, with the exception of the rules
						specified below.
					</p>
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
					<h3>Register a title</h3>
					<p>
						The only titles recognized are CM, FM, IM, GM, WCM, WFM, WIM, WGM, NM, and WNM.
						Take a picture of an official ID document send it to us. Include a link to your FIDE card and your username.
					</p>
					<br />
					<h3>Contact</h3>
					<p>
						For any questions about the site or if you wish to register a title, <a href="mailto:bughousechess.org@gmail.com" target="_top">send us an email</a>.
					</p>
					<br />
					<h3>Contribute</h3>
					<p>
						The source code of this web app is located <a href="https://github.com/johndiiorio/bughouse" target="_blank" rel="noopener noreferrer">here</a>.
						It is written with React + Redux + Bootstrap front-end with a Node.js (Express.js) + Socket.io + PostgreSQL backend.
						This site also utilizes a heavily modified version of jhlywa&apos;s
						<a href="https://github.com/jhlywa/chess.js/blob/master/README.md" target="_blank" rel="noopener noreferrer"> Chess.js</a> and
						the <a href="https://github.com/ornicar/chessground" target="_blank" rel="noopener noreferrer">Chessground</a> library.
						The game notation is specified by the <a href="http://bughousedb.com/Lieven_BPGN_Standard.txt" target="_blank" rel="noopener noreferrer">
						Bughouse Portable Game Notation standard</a>.
					</p>
					<p>
						Contributions are always welcome.
						Open a GitHub issue or make a pull request to the repository.
						If you have any questions, feel free to contact us.
					</p>
					<br />
					<h3>Terms of Service</h3>
					<p>
						This site&apos;s source code is licensed under the GNU GPL 3.0 license.
						Users may not cheat (use an engine, opening book, or another user) while playing a game.
						Users may not artificially boost their own or another user&apos;s rating.
						Users may not pretend to be at an ability below their actual rating.
						Users may not harass other users or break into another user&apos;s account.
						Users may not impersonate another person; however, pseudonyms are allowed.
						Users may not perform any attack (e.g. SQL injection, DDoS, man in the middle, etc.) against this site.
						Users who do not comply with these terms of service will be banned.
					</p>
				</div>
			</div>
		</div>
	);
}
