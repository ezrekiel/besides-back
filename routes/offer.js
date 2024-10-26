const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

// Create a Job Ad
router.post('/', validateToken, async (req, res) => {
	const title = sanitizeInput(req.body.title);
	const libelle = sanitizeInput(req.body.libelle);
	const jobType = sanitizeInput(req.body.jobType);
	const workingTime = sanitizeInput(req.body.workingTime);
	const contractType = sanitizeInput(req.body.contractType);
	const salary = sanitizeInput(req.body.salary);
	const country = sanitizeInput(req.body.country);
	const city = sanitizeInput(req.body.city);
	const adress = sanitizeInput(req.body.adress);
	const zipCode = sanitizeInput(req.body.zipCode);
	const companyID = sanitizeInput(req.body.companyID);

	if (!title || !libelle || !jobType || !workingTime || !contractType || !salary || !country || !city || !adress || !zipCode || !companyID) {
		return res.status(400).send({ message: 'Error: Missing information.' });
	}

	try {
		const jobQuery = await db.query('INSERT INTO offers (title, libelle, jobType, workingTime, contractType, salary, postedAt, country, city, adress, zipCode, companyID) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)', 
		[title, libelle, jobType, workingTime, contractType, salary, country, city, adress, zipCode ,companyID]);

		if (jobQuery.affectedRows > 0) {
			return res.status(200).send({
				message: 'Job offer created successfully.',
				offer: {
					jobAdID : jobQuery.insertId.toString(),
					title : title,
					libelle : libelle,
					jobType : jobType,
					workingTime : workingTime,
					salary : salary,
					country : country,
					city : city,
					adress : adress,
					zipCode : zipCode,
					companyID : companyID
				}
			});
		}
		return res.status(500).send({ message: 'Error: Unable to create job offer.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to create job offer.', error: err.message });
	}
});

// Get All Job offers
router.get('/', validateToken, async (req, res) => {
	try {
		const offerQuery = await db.query('SELECT offers.id AS offerID, title, companyName, libelle, postedAt, jobType, workingTime, contractType, salary, adress, zipCode, country, city, GROUP_CONCAT(offerApplications.applicantID) AS applicantIDs FROM offers LEFT JOIN companies ON offers.companyID = companies.id LEFT JOIN offerApplications ON offers.id = offerApplications.offersID GROUP BY offers.id, title, companyName, libelle, postedAt, jobType, workingTime, contractType, salary, adress, zipCode, country, city;');
		return res.status(200).send(offerQuery);

	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to fetch job offers.', error: err.message });
	}
});

// Get Job offers by title
router.get('/title/:title', validateToken, async (req, res) => {
	try {
		const offerQuery = await db.query('SELECT offers.id AS offerID, title, companyName, libelle, postedAt, jobType, workingTime, contractType, salary, adress, zipCode, country, city FROM offers LEFT JOIN companies ON offers.companyID = companies.id WHERE offers.title LIKE ?;', [`%${req.params.title}%`]);
		return res.status(200).send(offerQuery);

	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to fetch job offers.', error: err.message });
	}
});

// Get Job offers by search (title, company, jobType, contractType, etc.)
router.get('/search', validateToken, async (req, res) => {
	const searchQuery = sanitizeInput(req.query.query);
	try {
		const sqlFormatedQuery = `%${searchQuery}%`;
		const offerQuery = await db.query(`
			SELECT offers.id AS offerID, title, companyName, libelle, postedAt, jobType, workingTime, contractType, salary, adress, zipCode, country, city 
			FROM offers 
			LEFT JOIN companies ON offers.companyID = companies.id 
			WHERE 
				offers.title LIKE ? OR
				companies.companyName LIKE ? OR
				offers.jobType LIKE ? OR
				offers.contractType LIKE ? OR
				offers.libelle LIKE ?;
		`, [sqlFormatedQuery, sqlFormatedQuery, sqlFormatedQuery, sqlFormatedQuery, sqlFormatedQuery]);

		return res.status(200).send(offerQuery);
	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to fetch job offers.', error: err.message });
	}
});

router.post('/apply', validateToken, async (request, response) => {
	const userID = sanitizeInput(request.query.userID);
	const offerID = sanitizeInput(request.query.offerID);
	const message = sanitizeInput(request.query.message);

	if (!userID || !offerID ) return response.status(400).send({ message: 'Error: Missing information.' });

	try {
		const jobQuery = await db.query('INSERT INTO offerApplications (offersID, applicantID, motivationLetter) VALUES (?, ?, ?);', [offerID, userID, message]);

		if (!jobQuery.affectedRows > 0) return response.status(500).send({ message: 'Error: Unable to apply to the offer.' });
		
		return response.status(200).send({ message: 'Offer applied successfully.'});
	} catch (err) {
		return response.status(500).send({ message: 'Error: Unable to apply to offer.', error: err.message });
	}
});

// Get Job Ad by ID
router.get('/:id', validateToken, async (req, res) => {
	try {
		const offerQuery = await db.query('SELECT offers.id AS offerID, title, companyName, libelle, postedAt, jobType, workingTime, contractType, salary, adress, zipCode, country, city FROM offers LEFT JOIN companies ON offers.companyID = companies.id WHERE offers.id = ?', [req.params.id]);

		if (offerQuery.length > 0) return res.status(200).send(offerQuery[0]);
		return res.status(404).send({ message: 'Error: Job ad not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to fetch the job ad.', error: err.message });
	}
});

// Edit a Job Ad
router.put('/:id', validateToken, async (req, res) => {
	const title = sanitizeInput(req.body.title);
	const libelle = sanitizeInput(req.body.libelle);
	const jobType = sanitizeInput(req.body.jobType);
	const workingTime = sanitizeInput(req.body.workingTime);
	const contractType = sanitizeInput(req.body.contractType);
	const salary = sanitizeInput(req.body.salary);
	const country = sanitizeInput(req.body.country);
	const city = sanitizeInput(req.body.city);
	const adress = sanitizeInput(req.body.adress);
	const zipCode = sanitizeInput(req.body.zipCode);

	try {
		const offerQuery = await db.query('UPDATE offers SET title = ?, libelle = ?, jobType = ?, workingTime = ?, contractType = ?, salary = ?, country = ?, city = ?, adress = ?, zipCode = ? WHERE id = ?',
		[title, libelle, jobType, workingTime, contractType, salary, country, city, adress, zipCode, req.params.id]);

		if (!(offerQuery.affectedRows > 0)) return res.status(404).send({ message: 'Error: Offer not found.' });

		if (offerQuery.affectedRows > 0) {
			return res.status(200).send({
				message: 'Job offer updated successfully.',
				offer: {
					jobAdID : req.params.id,
					title : title,
					libelle : libelle,
					jobType : jobType,
					workingTime : workingTime,
					salary : salary,
					country : country,
					city : city,
					adress : adress,
					zipCode : zipCode
				}
			});
		}
	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to update offer.', error: err.message });
	}
});

// Delete a Job Ad
router.delete('/:id', validateToken, async (req, res) => {
	try {
		const offerQuery = await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);

		if (offerQuery.affectedRows > 0) {
			return res.status(200).send({ message: 'Job ad deleted successfully.' });
		}
		return res.status(404).send({ message: 'Error: Job ad not found.' });

	} catch (err) {
		return res.status(500).send({ message: 'Error: Unable to delete job ad.', error: err.message });
	}
});

module.exports = router;
