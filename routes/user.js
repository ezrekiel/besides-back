const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Création d'utilisateur, normalement inutile car auth.js le fait mieux
/*
router.post('/', validateToken, async (req, res) => {
	const userName = sanitizeInput(req.body.userName);
	const firstName = sanitizeInput(req.body.firstName);
	const lastName = sanitizeInput(req.body.lastName);
	const birthday = sanitizeInput(req.body.birthday);
	const phoneNumber = sanitizeInput(req.body.phoneNumber);
	const gender = sanitizeInput(req.body.gender);

	if (!userName) return res.status(400).send({ message: 'Error : Missing information.' });

	try {
		const userQuery = await db.query('INSERT INTO users (userName, firstName, lastName, birthday, phoneNumber, gender) VALUES (?, ?, ?, ?, ?)', [userName, firstName, lastName, birthday, phoneNumber, gender]);
		
		if (userQuery.affectedRows > 0) return res.status(200).send({ message: 'user created successfully.'});
		return res.status(500).send({ message: 'Error : Unable to create user.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to create user.', error: err.message });
	}
});
*/

// Récupérer tous les users
router.get('/', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('SELECT users.id AS userID, companyID, username, firstname, lastname FROM users');
		return res.status(200).send(userQuery);

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to fetch users.', error: err.message });
	}
});

// Récupérer un user par son ID
router.get('/:userID', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('SELECT users.id AS userID, companyID, username, firstname, lastname FROM users WHERE id = ?', [req.params.userID]);
		console.log(userQuery);

		if (userQuery.length > 0) return res.status(200).send(userQuery[0]);
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to fetch the user.', error: err.message });
	}
});

// Modifier un user
router.put('/:id', validateToken, async (req, res) => {
    const lastName = sanitizeInput(req.body.lastName);
    const phoneNumber = sanitizeInput(req.body.phoneNumber);
    const employer = sanitizeInput(req.body.employer);
    const username = sanitizeInput(req.body.username);
    const password = sanitizeInput(req.body.password);
    const country = sanitizeInput(req.body.country);
    const city = sanitizeInput(req.body.city);
    const adress = sanitizeInput(req.body.adress);
    const zipCode = sanitizeInput(req.body.zipCode);

    try {
		const hashedPassword = await bcrypt.hash(password, 10);

        const userQuery = await db.query('UPDATE users SET lastName = ?, phoneNumber = ?, employer = ?,  username = ?,  pass = ?,  country = ?,  city = ?,  adress = ?,  zipCode = ? WHERE id = ?', 
            [lastName, phoneNumber, employer, username, hashedPassword, country, city, adress, zipCode, req.params.id]);

        if (userQuery.affectedRows > 0) {
            return res.status(200).send({ message: 'User updated successfully.' });
        }
        return res.status(404).send({ message: 'Error: User not found.' });

    } catch (err) {
        return res.status(500).send({ message: 'Error: Unable to update user.', error: err.message });
    }
});

// Suppression de user
router.delete('/:userID', validateToken, async (req, res) => {
	try {
		const userQuery = await db.query('DELETE FROM users WHERE id = ?', [req.params.userID]);

		if (userQuery.affectedRows > 0) return res.status(200).send({ message: 'user deleted successfully.' });
		return res.status(404).send({ message: 'Error : user not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error : Unable to delete user.', error: err.message });
	}
});

module.exports = router;