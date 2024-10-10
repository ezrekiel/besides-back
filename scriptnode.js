const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Utilisation de mysql2 pour MariaDB avec les promesses
const app = express();

app.use(cors());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Besides',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route pour récupérer une annonce d'emploi spécifique avec les informations de l'entreprise
app.get('/api/job/:id', async (req, res) => {
    const jobId = req.params.id;

    try {
        // Requête pour récupérer l'annonce et les informations de l'entreprise associée
        const [rows] = await pool.query(`
            SELECT 
                jobAds.id, jobAds.title, jobAds.libelle, jobAds.postedAt, jobAds.jobType, jobAds.workingTime, jobAds.salary, 
                companies.companyName, companies.activitySector, adresses.city, adresses.country
            FROM jobAds, companies, adresses
            WHERE jobAds.id_company = companies.id
            AND companies.id_adress = adresses.id
            AND jobAds.id = 1;
        `, [jobId]);

        if (rows.length > 0) {
            res.json(rows[0]); // Retourner les données de l'annonce avec les informations de l'entreprise
        } else {
            res.status(404).json({ error: 'Job not found' }); // 404 si l'annonce n'est pas trouvée
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); // Erreur 500 en cas de problème avec la base de données
    }
});

// Route pour récupérer toutes les annonces d'emploi
app.get('/api/jobs', async (req, res) => {
    try {
        // Requête pour récupérer toutes les annonces
        const [rows] = await pool.query(`
            SELECT 
                jobAds.id, jobAds.title, jobAds.libelle, jobAds.postedAt, jobAds.jobType, jobAds.workingTime, jobAds.salary,
                companies.companyName
            FROM jobAds
            JOIN companies ON jobAds.id_company = companies.id
        `);

        res.json(rows); // Retourner la liste des annonces
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); // Erreur 500 si problème de base de données
    }
});

// Lancement du serveur
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
