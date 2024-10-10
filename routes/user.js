const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

//Create user
router.post('/', validateToken, async (req, res) => {
	const firstName = sanitizeInput(req.body.userName);
	const lastName = sanitizeInput(req.body.userName);
	const birthday = sanitizeInput(req.body.userName);
	const phoneNumber = sanitizeInput(req.body.userName);
	const gender = sanitizeInput(req.body.userName);

	if (!userName) return res.status(400).send({ message: 'Error : Missing information.' });

	try {
		const result = await db.query('INSERT INTO users (firstName, lastName, birthday, phoneNumber, gender) VALUES (?, ?, ?, ?, ?)', [userName]);
		
		if (result.affectedRows > 0) return res.status(200).send({ message: 'user created successfully.'});
		return res.status(500).send({ message: 'Error : Unable to create user.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to create user.', error: err.message });
	}
});

//Get All Users
router.get('/', validateToken, async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM users');
		return res.status(200).send(result);

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch users.', error: err.message });
	}
});

//Get User By ID
router.get('/:userID', validateToken, async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM users WHERE userID = ?', [req.params.userID]);

		if (result.length > 0) return res.status(200).send(result[0]);
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch the user.', error: err.message });
	}
});

//Edit User
router.put('/:userID', validateToken, async (req, res) => {
	const userName = sanitizeInput(req.body.userName);

	try {
		const result = await db.query('UPDATE users SET userName = ? WHERE userID = ?', [chatName, req.params.userID]);

		if (result.affectedRows > 0) return res.status(200).send({ message: 'user updated successfully.' });
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to update user.', error: err.message });
	}
});

//Delete User
router.delete('/:userID', validateToken, async (req, res) => {
	try {
		const result = await db.query('DELETE FROM users WHERE userID = ?', [req.params.userID]);

		if (result.affectedRows > 0) return res.status(200).send({ message: 'user deleted successfully.' });
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to delete user.', error: err.message });
	}
});

module.exports = router;