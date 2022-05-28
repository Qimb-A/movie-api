const { Model, DataTypes } = require('sequelize');
const { movieDB } = require('../managers/sqlite');
const Actor = require('./actor');

class Movie extends Model {}

Movie.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'MOVIE_EXISTS',
    },
    validate: {
      notNull: {
        msg: 'TITLE_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'TITLE_MUST_BE_NOT_EMPTY',
      },
    },
  },
  year: {
    type: DataTypes.NUMBER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'YEAR_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'YEAR_MUST_BE_NOT_EMPTY',
      },
    },
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'FORMAT_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'FORMAT_MUST_BE_NOT_EMPTY',
      },
    },
  },
  source: {
    type: DataTypes.STRING,
  },
}, {
  sequelize: movieDB,
  modelName: 'Movie',
});

movieDB.sync().then(() => {
  console.log('user db is synced');
}).then(() => {
});

Movie.belongsToMany(Actor, { through: 'ActorMovies', as: 'actors' });
Actor.belongsToMany(Movie, { through: 'ActorMovies', as: 'movie' });

module.exports = Movie;
