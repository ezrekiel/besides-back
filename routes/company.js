const sanitizeInput = require('../utils/sanitizer');
const { validateToken } = require('../utils/jwt');
const db = require('../utils/database');
const express = require('express');
const router = express.Router();

// Create Company
router.post('/', validateToken, async (req, res) => {
    const companyName = sanitizeInput(req.body.companyName);
    const legalStatus = sanitizeInput(req.body.legalStatus);
    const activitySector = sanitizeInput(req.body.activitySector);

    if (!companyName || !legalStatus || !activitySector) {
        return res.status(400).send({ message: 'Error: Missing required information.' });
    }

    try {
        const companyQuery = await db.query('INSERT INTO companies (companyName, legalStatus, activitySector) VALUES (?, ?, ?)', 
            [companyName, legalStatus, activitySector]);

        if (!(companyQuery.affectedRows > 0)) return res.status(500).send({ message: 'Error: Unable to create company.' });

        return res.status(200).send( { 
            message: 'Company created successfully.', 
            company: {
                companyId : companyQuery.insertId.toString(),
                companyName : companyName,
                legalStatus : legalStatus,
                activitySector : activitySector
            }
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error: ' + err.message });
    }
});

// Get All Companies
router.get('/', validateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM companies');
        return res.status(200).send(result);

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to fetch companies.', error: err.message });
    }
});

// Get Company By ID
router.get('/:id', validateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);

        if (result.length > 0) {
            return res.status(200).send(result[0]);
        }
        return res.status(404).send({ message: 'Error: Company not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to fetch the company.', error: err.message });
    }
});

// Edit Company
router.put('/:id', validateToken, async (req, res) => {
    const companyName = sanitizeInput(req.body.companyName);
    const legalStatus = sanitizeInput(req.body.legalStatus);
    const activitySector = sanitizeInput(req.body.activitySector);

    try {
        const companyQuery = await db.query('UPDATE companies SET companyName = ?, legalStatus = ?, activitySector = ? WHERE id = ?', 
            [companyName, legalStatus, activitySector, req.params.id]);

            if (companyQuery.affectedRows > 0) {
                return res.status(200).send({
                    message: 'Company updated successfully.',
                    company: {
                        companyId : req.params.id,
                        companyName : companyName,
                        legalStatus : legalStatus,
                        activitySector : activitySector
                    }
                });
            }
        return res.status(404).send({ message: 'Error: Company not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to update company.', error: err.message });
    }
});

// Delete Company
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM companies WHERE id = ?', [req.params.id]);

        if (result.affectedRows > 0) {
            return res.status(200).send({ message: 'Company deleted successfully.' });
        }
        return res.status(404).send({ message: 'Error: Company not found.' });

    } catch (err) {
        res.status(500).send({ message: 'Error: Unable to delete company.', error: err.message });
    }
});

module.exports = router;
