const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {
    return next(new AuthorisationError('Необходима авторизация'));
  }

  const token = authorization.replace('token=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    return next(new AuthorisationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
