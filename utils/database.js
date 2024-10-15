const mariadb = require('mariadb');

const pool = mariadb.createPool({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: process.env.DATABASE_PASSWORD,
	database: 'besides',
	connectionLimit: 5
});

async function query(sql, values) {
	let sqlConnection;

	try {
		sqlConnection = await pool.getConnection();
		return await sqlConnection.query(sql, values);
	} finally {
		if (sqlConnection) sqlConnection.end();
	}
}

async function getHashedPasswordForUser(username) {
	try {
		const result = await query('SELECT pass FROM users WHERE username=?', [username]);
		if (result.length > 0) return result[0].pass;
		else return '';
	} catch (error) {
		console.error('Error in getHashedPasswordForUser:', error);
		throw error;
	}
}


module.exports = {
	query,
	getHashedPasswordForUser
};
