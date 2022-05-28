const { verifyToken } = require('../helpers/JWT');

module.exports = async (req, res, next) => {
  let error;
  try {
    const token = req.header('Authorization');
    verifyToken(token);
  } catch (e) {
    res.status(401).send({
      status: 0,
      error: {
        fields: {
          token: 'REQUIRED',
        },
        code: 'FORMAT_ERROR',
      },
    });
    error = true;
  }
  if (!error) next();
};
