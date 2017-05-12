const pgp = require('pg-promise')();
const path = require('path');
const config = require('../config');

const db = pgp(config.database);
const sqlFilesDir = path.join(__dirname, '..', 'sql');
const loadedSqlFiles = {};

function sqlFile(filePath) {
	const sqlFilePath = path.join(sqlFilesDir, filePath);
	if (loadedSqlFiles[sqlFilePath] === undefined) {
		loadedSqlFiles[sqlFilePath] = new pgp.QueryFile(path.join(sqlFilesDir, filePath), { minify: true });
	}
	return loadedSqlFiles[sqlFilePath];
}

/**
 * Returns a promise to create the database schema.
 * @return {Promise<void>}
 */
async function createSchema() {

}

function stopDB() {
	pgp.end();
}

module.exports = {
	db,
	sqlFile,
	createSchema,
	pgp,
	stopDB
};
