const express = require('express');
const authService = require('./auth.service');
const router = express.Router();

router.get('/', (req, res) => {
  const authorizeUrl = authService.getAuthorizeUrl();
  res.redirect(authorizeUrl);
});

router.get('/oauth2callback', async (req, res) => {
  if (req.query['error']) {
    res.send(req.query.error);
    return;
  }

  // acquire the code from the querystring
  const code = req.query.code;
  await authService.setCredentials(code);

  res.redirect('../');
});

module.exports = router;