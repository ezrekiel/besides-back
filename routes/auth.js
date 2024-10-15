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
		const userDetails = await getUserDetails(username);
		const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
		const expiryDate = new Date((Date.now() - timeZoneOffset) + 3600000).toISOString();
		return res.status(200).send({ message: 'Login successful!', token: token, user: userDetails, expiryDate: expiryDate });
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

router.post('/signup', async (req, res) => {
	try {
		const firstName = sanitizeInput(req.body.firstName);
		const lastName = sanitizeInput(req.body.lastName);
		const username = sanitizeInput(req.body.username);
		const password = sanitizeInput(req.body.password);
		const phoneNumber = sanitizeInput(req.body.phoneNumber);

		/*
		const gender = sanitizeInput(req.body.gender);
		const birthday = sanitizeInput(req.body.birthday);
		const employer = sanitizeInput(req.body.employer);
		const country = sanitizeInput(req.body.country);
		const city = sanitizeInput(req.body.city);
		const adress = sanitizeInput(req.body.adress);
		const zipCode = sanitizeInput(req.body.zipCode);*/

		// Du coup faut bien que tu wrap tout dans des guillemets sinon ça pete
		// On peut faire un test pour voir ce que ça chope
		// Ah je vois le soucis
		// En gros 0 == false en JS (oui c'est un langage de con)
		// Par contre pas de soucis pour le typage, j'ai checké la BDD et tout est bien typé
		// Faudra juste que tout soit wrap dans des "" côté front & postman

		// || !birthday || !gender || !employer || !country || !city || !adress || !zipCode
		if (!firstName || !lastName || !username || !password || !phoneNumber ) return res.status(400).send({ message: 'Error : Missing credentials.' });
		if(!isUsernameValid(username)) return res.status(400).send({ message: 'Error : Invalid username.' });
		
		const hashedPassword = await bcrypt.hash(password, 10);

		const signupQuery = await db.query('INSERT INTO users (username, pass, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?, ?);', 
			[username, hashedPassword, firstName, lastName, phoneNumber]
		);
		//, birthday, gender, employer, country, city, adress, zipCode

		if (!(signupQuery.affectedRows > 0)) return res.status(500).send({ message: 'Error : Unable to create User.' });


		// Ici, je te conseille VIVEMENT d'ajouter les détails de l'utilisateur que tu viens de créer, donc tous les champs d'avant
		// Ca peut se faire de pleins de façons différentes mais la strat la plus économe en ressources et en appelle BDD
		// C'est la technique full roumain
		// Observe
		return res.status(200).send(
			{ 
				message: 'User created successfully.', 
				user: {
					userId : signupQuery.insertId.toString(), 
					userlogin : username,
					firstname : firstName,
					lastname : lastName,
					birthdaydate : birthday,
					phonenumber : phoneNumber,
					gender : gender,
					employer : employer,
					country : country,
					city : city,
					adress : adress,
					zipcode : zipCode
					//
					// Ect, ect
					// En soit ça fonctionne parce qu'on a les données et qu'on les a nettoyées avec le SanitizeInput
					// Mais en vrai c'est pas non plus zinzin safety wise
					// Mais en soit c'est des données qu'on insère dans la bdd donc bon....
					// Sinon l'autre strat c'est d'insérer le nouvel utilisateur, PUIS faire une requête pour choper ses infos
					// Pour ensuite renvoyer la data au front
				} 
			});
	} catch(error) {
		return res.status(500).send({ message: 'Error : ' + error });
	}
});

async function getUserDetails(username) {
	const userDetailsQuery = await db.query('SELECT users.id AS userID, companyID, username, firstname, lastname FROM users WHERE username = ?', [username]);
	if (!(userDetailsQuery.length > 0)) return {};
	return userDetailsQuery[0];
}

function isUsernameValid(username) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,5}$/;
	return regex.test(username);
}

module.exports = router;