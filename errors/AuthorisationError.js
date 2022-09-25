class AuthorisationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorisationError';
    this.statusCode = 401;
  }
}

module.exports = AuthorisationError;
