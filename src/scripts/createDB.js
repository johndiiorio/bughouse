const logger = require('../server/logger');
const { createSchema, pgp } = require('../server/models/database');

(async function createSchemaWrapper() {
	try {
		await createSchema();
		logger.log('Schema created');
	} catch (err) {
		logger.error(`Error creating schema: ${err}`);
	} finally {
		pgp.end();
	}
}());
