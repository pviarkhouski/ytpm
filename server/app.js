const express = require('express');
const authService = require('./auth/auth.service');
const authRoute = require('./auth/auth.route');
const requireAuthorization = require('./auth/auth.middleware');
const playlistRoute = require('./playlist/playlist.route');
const playlistItemsRoute = require('./playlist-items/playlist-items.route');

const API_PREFIX = 'api';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all(`/${API_PREFIX}/*`, requireAuthorization);

app.use('/auth', authRoute);
app.use(`/${API_PREFIX}/playlist`, playlistRoute);
app.use(`/${API_PREFIX}/playlist-items`, playlistItemsRoute);

app.get('/', async (req, res) => {
  if (!await authService.validateToken()) {
    // token is invalid, redirect to /auth
    res.redirect('/auth');
    return;
  }
  res.send(`Signed In: ${authService.getAccessToken()}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});