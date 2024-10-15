const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

//Create Resource
router.post('/', validateToken, async (req, res) => {
	const resourceName = sanitizeInput(req.body.resourceName);

	if (!resourceName) return res.status(400).send({ message: 'Error : Missing information.' });

	try {
		const resourceQuery = await db.query('INSERT INTO resource (resourceName) VALUES (?)', [resourceName]);
		
		if (resourceQuery.affectedRows > 0) return res.status(200).send({ message: 'resource created successfully.'});
		return res.status(500).send({ message: 'Error : Unable to create resource.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to create resource.', error: err.message });
	}
});

//Get All Resources
router.get('/', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('SELECT * FROM resource');
		return res.status(200).send(resourceQuery);

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch resources.', error: err.message });
	}
});

//Get Resource By ID
router.get('/:resourceID', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('SELECT * FROM resource WHERE resourceID = ?', [req.params.resourceID]);

		if (resourceQuery.length > 0) return res.status(200).send(resourceQuery[0]);
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to fetch the resource.', error: err.message });
	}
});

//Edit Resource
router.put('/:resourceID', validateToken, async (req, res) => {
	const resourceName = sanitizeInput(req.body.resourceName);

	try {
		const resourceQuery = await db.query('UPDATE resource SET resourceName = ? WHERE resourceID = ?', [chatName, req.params.resourceID]);

		if (resourceQuery.affectedRows > 0) return res.status(200).send({ message: 'resource updated successfully.' });
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to update resource.', error: err.message });
	}
});

//Delete Resource
router.delete('/:resourceID', validateToken, async (req, res) => {
	try {
		const resourceQuery = await db.query('DELETE FROM resource WHERE resourceID = ?', [req.params.resourceID]);

		if (resourceQuery.affectedRows > 0) return res.status(200).send({ message: 'resource deleted successfully.' });
		return res.status(404).send({ message: 'Error : resource not found.' });

	} catch (err) {
		res.status(500).send({ message: 'Error : Unable to delete resource.', error: err.message });
	}
});

module.exports = router;