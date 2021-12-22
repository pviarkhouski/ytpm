const express = require('express');
const authService = require('./auth/auth.service');
const authRoute = require('./auth/auth.route');

const app = express();
const port = 8080;

app.use('/auth', authRoute);

app.get('/', async (req, res) => {
  if (!await authService.validateToken()) {
    // token is invalid, redirect to /auth
    res.redirect('/auth');
    return;
  }

  let playlistsRes;
  try {
    playlistsRes = await authService.getYoutubeApi().playlists.list({
      mine: true,
      part: 'snippet,contentDetails'
    });
  } catch (e) {
    res.send(e.message);
    return;
  }

  const playlists = playlistsRes.data.items;
  res.send(playlists);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});