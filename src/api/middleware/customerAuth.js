const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenExpiryTime = process.env.CUSTOMER_TOKEN_EXPIRY_TIME;
const { DATETIMETOEPOC, differentiate } = require('../helpers/datetime');

const {
  tokenHasExpired,
  tokenNotFound,
  invalidToken,
} = require('../constants/index');

const customerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(
      token,
      process.env.CUSTOMER_ACCESS_SECRET,
      async (err, decodedToken) => {
        const tokenCreationtime = decodedToken.iat;
        const { id } = decodedToken;
        const tokenCurrentTime = DATETIMETOEPOC(new Date()) / 1000;
        const tokenCreationTimeValue = tokenCreationtime.valueOf();
        const exp = differentiate(tokenCurrentTime, tokenCreationTimeValue);
        const tokenExpTimes = exp / 60;
        const tokenExpTime = parseInt(tokenExpTimes, 10);
        if (err) {
          return res.status(403).json({
            message: invalidToken,
            error: err,
          });
        }
        if (tokenExpTime <= tokenExpiryTime) {
          req.userId = id;
          return next();
        }
        return res.status(403).json({
          message: tokenHasExpired,
          tokenLife: tokenExpTime,
        });
      },
    );
  } else {
    return res.status(403).json({
      message: tokenNotFound,
    });
  }
  return null;
};

module.exports = customerAuth;
