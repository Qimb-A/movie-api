const User = require('../models/user');
const errorHandler = require('../helpers/errorHandler');
const { createToken } = require('../helpers/JWT');

const create = async (req, res) => {
  const { body } = req;
  if (body.password === body.confirmPassword) {
    await User.create(body)
      .then(() => {
        res.status(201).send({ status: 1, token: createToken(body) });
      })
      .catch((err) => {
        res.status(400).send(errorHandler(err));
      });
  } else {
    res.send(400).send({
      status: 0,
      fields: {
        password: 'must be equal to confirmPassword',
        confirmPassword: 'must be equal to password',
      },
      code: 'password must be equal',
    });
  }
};

const sessions = async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ where: body });
  if (user) {
    res.send({ status: 1, token: createToken(body) });
  } else {
    res.status(400).send({
      status: 0,
      error: {
        fields: {
          email: 'AUTHENTICATION_FAILED',
          password: 'AUTHENTICATION_FAILED',
        },
        code: 'AUTHENTICATION_FAILED',
      },
    });
  }
};

module.exports = {
  create,
  sessions,
};
