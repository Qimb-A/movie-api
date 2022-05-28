const { Sequelize } = require('sequelize');

const userDB = new Sequelize('sqlite::memory:');
const movieDB = new Sequelize('sqlite::memory:');

module.exports = {
  userDB,
  movieDB,
};
