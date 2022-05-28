const { Model, DataTypes } = require('sequelize');
const { userDB } = require('../managers/sqlite');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'EMAIL_NOT_UNIQUE',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'EMAIL_MUST_BE_NOT_NULL',
      },
      isEmail: {
        msg: 'MUST_BE_EMAIL',
      },
      notEmpty: {
        msg: 'EMAIL_MUST_BE_NOT_EMPTY',
      },
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'NAME_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'NAME_MUST_BE_NOT_EMPTY',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'PASSWORD_MUST_BE_NOT_NULL',
      },
      notEmpty: {
        msg: 'PASSWORD_MUST_BE_NOT_EMPTY',
      },
    },
  },
}, {
  sequelize: userDB,
  modelName: 'User',
});

userDB.sync().then(() => {
  console.log('user db is synced');
}).then(() => {
  User.create({ email: 'petro@gmail.com', password: 'super-password', name: 'petro' });
});

module.exports = User;
