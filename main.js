// ROUTES
const resourceRouter = require('./routes/resource');
const authRouter = require('./routes/auth');

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4444;

app.use((req, res, next) => {
	bodyParser.json()(req, res, err => {
		if (err) return res.status(400).send({ message: 'Error : Bad JSON formatting.' });

		next();
	});
});
app.use(cors());

// Routes
app.use('/resource', resourceRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
