const sanitizeInput = require('../utils/sanitizer');
const { generateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/signin', async (req, res) => {
	try {
		const username = sanitizeInput(req.body.username);
		const password = sanitizeInput(req.body.password);
		if (!username || !password) return res.status(400).send({ message: 'Error : Missing credentials.' });

		const hashedPassword = await db.getHashedPasswordForUser(username);
		const bcryptResult = await bcrypt.compare(password, hashedPassword);
		if (!bcryptResult) return res.status(401).send({ message: 'Invalid credentials!' });

		const token = generateToken({ username });
		const userDetails = getUserDetails(username);
		const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
		const expiryDate = new Date((Date.now() - timeZoneOffset) + 3600000).toISOString();
		return res.status(200).send({ message: 'Login successful!', token: token, user: userDetails, expiryDate: expiryDate });
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

router.post('/signup', async (req, res) => {
	try {
		const firstname = sanitizeInput(req.body.firstname);
		const lastname = sanitizeInput(req.body.lastname);
		const username = sanitizeInput(req.body.username);
		const password = sanitizeInput(req.body.password);

		if (!username || !password || !firstname || !lastname) return res.status(400).send({ message: 'Error : Missing credentials.' });
		if(!isUsernameValid(username)) return res.status(400).send({ message: 'Error : Invalid username.' });
		
		const hashedPassword = await bcrypt.hash(password, 10);

		const signupQuery = await db.query('INSERT INTO users (username, pass, firstname, lastname) VALUES (?, ?, ?, ?);', [username, hashedPassword, firstname, lastname]);
		if (!(signupQuery.affectedRows > 0)) return res.status(500).send({ message: 'Error : Unable to create User.' });

		return res.status(200).send({ message: 'User created successfully.', user: {userId : signupQuery.insertId.toString(), userlogin : username } });
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

async function getUserDetails(username) {
	const userDetailsQuery = await db.query('SELECT * FROM users WHERE username = ?', [username]);
	if (!(userDetailsQuery.length > 0)) return {};

	return userDetailsQuery[0];
}

function isUsernameValid(username) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,5}$/;
	return regex.test(username);
}

module.exports = router;