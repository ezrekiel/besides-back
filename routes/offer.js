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
    const salary = sanitizeInput(req.body.salary);
    const id_company = sanitizeInput(req.body.id_company);  // Assuming the company ID is provided

    if (!title || !libelle || !jobType || !workingTime || !salary || !id_company) {
        return res.status(400).send({ message: 'Error: Missing information.' });
    }

    try {
        const result = await db.query('INSERT INTO jobAds (title, libelle, jobType, workingTime, salary, postedAt, id_company) VALUES (?, ?, ?, ?, ?, NOW(), ?)', 
        [title, libelle, jobType, workingTime, salary, id_company]);

        if (result.affectedRows > 0) {
            return res.status(200).send({ message: 'Job ad created successfully.' });
        }
        return res.status(500).send({ message: 'Error: Unable to create job ad.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to create job ad.', error: err.message });
    }
});

// Get All Job Ads
router.get('/', validateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM jobAds');
        return res.status(200).send(result);

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to fetch job ads.', error: err.message });
    }
});

// Get Job Ad by ID
router.get('/:id', validateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM jobAds WHERE id = ?', [req.params.id]);

        if (result.length > 0) {
            return res.status(200).send(result[0]);
        }
        return res.status(404).send({ message: 'Error: Job ad not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to fetch the job ad.', error: err.message });
    }
});

// Edit a Job Ad
router.put('/:id', validateToken, async (req, res) => {
    const title = sanitizeInput(req.body.title);
    const libelle = sanitizeInput(req.body.libelle);
    const jobType = sanitizeInput(req.body.jobType);
    const workingTime = sanitizeInput(req.body.workingTime);
    const salary = sanitizeInput(req.body.salary);

    if (!title || !libelle || !jobType || !workingTime || !salary) {
        return res.status(400).send({ message: 'Error: Missing information.' });
    }

    try {
        const result = await db.query('UPDATE jobAds SET title = ?, libelle = ?, jobType = ?, workingTime = ?, salary = ? WHERE id = ?', 
        [title, libelle, jobType, workingTime, salary, req.params.id]);

        if (result.affectedRows > 0) {
            return res.status(200).send({ message: 'Job ad updated successfully.' });
        }
        return res.status(404).send({ message: 'Error: Job ad not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to update job ad.', error: err.message });
    }
});

// Delete a Job Ad
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM jobAds WHERE id = ?', [req.params.id]);

        if (result.affectedRows > 0) {
            return res.status(200).send({ message: 'Job ad deleted successfully.' });
        }
        return res.status(404).send({ message: 'Error: Job ad not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to delete job ad.', error: err.message });
    }
});

module.exports = router;
