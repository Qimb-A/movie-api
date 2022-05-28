const jwt = require('jsonwebtoken');
const { jwt: { salt } } = require('config');

const createToken = (data = {}) => jwt.sign({ data }, salt, { expiresIn: '12h' });
const verifyToken = (token) => jwt.verify(token, salt);

module.exports = {
  createToken,
  verifyToken,
};
