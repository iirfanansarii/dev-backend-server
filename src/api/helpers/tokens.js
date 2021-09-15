const jwt = require('jsonwebtoken');

exports.createAccessToken = (email, id, secretKey) => {
  const accessToken = jwt.sign({ email, id }, secretKey);
  return accessToken;
};

exports.createRefreshToken = (email, id, secretKey) => {
  const refreshToken = jwt.sign({ email, id }, secretKey);
  return refreshToken;
};
