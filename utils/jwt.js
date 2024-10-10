const jwt = require('jsonwebtoken');

const jwtSecret = process.env.API_KEY;

const validateToken = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')[1];

	if (token) {
		jwt.verify(token, jwtSecret, (err, decoded) => {
			if (err) return res.status(403).send({ message: 'Error : Token is not valid.' });

			req.user = decoded;
			next();
		});
	} else {
		return res.status(401).send({ message: 'Error : A token is required to access this route.' });
	}
};

function generateToken(userInfo) {
	return jwt.sign(userInfo, jwtSecret, { expiresIn: '1h' });
}

module.exports = {
	validateToken,
	generateToken
};