const { Model, DataTypes } = require('sequelize');
const { movieDB } = require('../managers/sqlite');

class Actor extends Model {}

Actor.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'ACTOR_NAME_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'ACTOR_NAME_MUST_BE_NOT_EMPTY',
      },
    },
  },
}, {
  sequelize: movieDB,
  modelName: 'Actor',
});

Actor.sync().then(() => {
  console.log('Actor db is synced');
});

module.exports = Actor;
