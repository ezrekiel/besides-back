// ROUTES
const resourceRouter = require('./routes/resource');

const userRouter = require('./routes/user');
const companyRouter = require('./routes/company');
const offerRouter = require('./routes/offer');
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
// app.use('/resource', resourceRouter); route exemple
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/offer', offerRouter);
app.use('/company', companyRouter);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
