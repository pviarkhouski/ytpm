const authService = require('./auth.service');

const requireAuthorization = async (req, res, next) => {
  // for debug only
  if (req.query['access_token']) {
    await authService.setCredentials({access_token: req.query['access_token']});
  }

  const userSignedIn = !!authService.getAccessToken();
  if (userSignedIn) {
    next();
  } else {
    res.status(403).send();
  }
};

module.exports = requireAuthorization;