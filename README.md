# Bughouse Chess #

![Bughouse Chess](https://raw.githubusercontent.com/johndiiorio/bughouse/master/public/img/screenshots/gamepage.png)

This web application is designed for the purpose for chess players to play [Bughouse chess](https://en.wikipedia.org/wiki/Bughouse_chess). It is written with React, Redux, and Bootstrap front-end with a Node.js (Express.js) + Socket.io + Postgres backend. This site also utilizes heavily modified versions of jhlywa's [Chess.js](https://github.com/jhlywa/chess.js) and the [chessboard.js](http://chessboardjs.com/) library. The game notation is specified by the [Bughouse Portable Game Notation standard](http://bughousedb.com/Lieven_BPGN_Standard.txt). This web app is not currently hosted anywhere online and is currently under development.

### Developer installation: ###

1. Install Node and Git
2. Clone this repository
3. Run ```npm install```
4. Create a .env file in the root directory of the project with the following, replacing (?) with the desired information: <br>
5. Install PostgreSQL, start the PostgreSQL server, and connect to it via psql.
6. In psql, run ```CREATE DATABASE bughouse;``` to create the database.
```
SERVER_PORT=?              // The port that the server should run on. 3000 is a good default choice
DB_USER=?                  // The user that should be used to connect to Postgres
DB_DATABASE=?              // The database you just created, so likely bughouse
DB_PASSWORD=?              // The password for your postgres user
DB_HOST=?                  // The host for your postgres db, likely localhost
DB_PORT=?                  // The port for your postgres db, likely 5432
TOKEN_SECRET=?             // Token for authentication. Generate something secure and random
```
7. Run ```npm run createdb``` to create the database schema.
8. Run ```npm run build``` to create the Webpack bundle for production, otherwise run ```npm run dev``` for development.
9. Run ```npm start```

### Contact: ###

Send me an [email](mailto:johnzdiiorio@gmail.com), open a GitHub issue, or make a pull request.
