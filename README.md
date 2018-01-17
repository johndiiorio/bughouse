# Bughouse Chess #

![Bughouse Chess - Game page](https://raw.githubusercontent.com/johndiiorio/bughouse/master/src/client/app/static/img/screenshots/gamePage.png)
![Bughouse Chess - Lobby page](https://raw.githubusercontent.com/johndiiorio/bughouse/master/src/client/app/static/img/screenshots/lobbyPage.png)

This web application is designed for the purpose for chess players to play [Bughouse chess](https://en.wikipedia.org/wiki/Bughouse_chess). It is written with React, Redux, and Bootstrap front-end with a Node.js (Express.js) + Socket.io + Postgres backend. This site also utilizes a heavily modified version of jhlywa's [Chess.js](https://github.com/jhlywa/chess.js) and the [Chessground](https://github.com/ornicar/chessground) library. The game notation is specified by the [Bughouse Portable Game Notation standard](http://bughousedb.com/Lieven_BPGN_Standard.txt). This web app is hosted online at [bughousechess.org](https://bughousechess.org) and is currently under development.

### Developer installation: ###

1. Install Node and Git
2. Clone this repository
3. Run ```npm install```
4. Install PostgreSQL, start the PostgreSQL server, and connect to it via psql.
5. In psql, run ```CREATE DATABASE bughouse;``` to create the database.
6. Create a .env file in the root directory of the project with the following, replacing (?) with the desired information: <br>
```
BUGHOUSE_SERVER_PORT=?              // The port that the server should run on. 3000 is a good default choice
BUGHOUSE_DB_USER=?                  // The user that should be used to connect to Postgres
BUGHOUSE_DB_DATABASE=?              // The database you just created, so likely bughouse
BUGHOUSE_DB_PASSWORD=?              // The password for your postgres user
BUGHOUSE_DB_HOST=?                  // The host for your postgres db, likely localhost
BUGHOUSE_DB_PORT=?                  // The port for your postgres db, likely 5432
BUGHOUSE_TOKEN_SECRET=?             // Token for authentication. Generate something secure and random
BUGHOUSE_LOG_FILE=?                 // Path to log file, defaults to ./log.txt
BUGHOUSE_EMAIL_ADDRESS=?            // Email address to send emails from
BUGHOUSE_EMAIL_PASSWORD=?           // Email password corresponding to the address above
BUGHOUSE_DOMAIN_NAME=?              // Domain name
```
7. Run ```npm run createdb``` to create the database schema.
8. Run ```npm run build``` to create the Webpack bundle for production, otherwise run ```npm run dev``` for development.
9. Run ```npm start```

### Contact: ###

Send me an [email](mailto:bughousechess.org@gmail.com), open a GitHub issue, or make a pull request.
