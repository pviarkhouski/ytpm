const express = require('express');
const service = require('./auth.service');
const router = express.Router();

router.get('/', (req, res) => {
  const authorizeUrl = service.getAuthorizeUrl();
  res.redirect(authorizeUrl);
});

router.get('/oauth2callback', async (req, res) => {
  if (req.query['error']) {
    res.status(500).send(req.query.error);
    return;
  }

  // acquire the code from the querystring
  const code = req.query['code'];
  if (!code) {
    res.status(500).send();
    return;
  }

  const tokens = await service.getTokens(code);
  service.setCredentials(tokens);
  res.redirect('../');
});

module.exports = router;