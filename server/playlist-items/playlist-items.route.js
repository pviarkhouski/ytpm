const express = require('express');
const service = require('./playlist-items.service');
const router = express.Router();

router.get('/', async (req, res) => {
  const playlistId = req.query['playlistId'];
  if (!playlistId) {
    res.status(400).send();
    return;
  }

  let playlistItems = [];
  try {
    playlistItems = await service.getList(playlistId);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(playlistItems);
});

router.post('/', async (req, res) => {
  const playlistId = req.body['playlistId'];
  const position = req.body['position'] || 0;
  const videoId = req.body['videoId'];

  if (!playlistId || !videoId) {
    res.status(400).send();
    return;
  }

  let newItem;
  try {
    newItem = await service.insert(playlistId, position, videoId);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(newItem);
});

router.put('/', async (req, res) => {
  const playlistItemId = req.body['playlistItemId'];
  const playlistId = req.body['playlistId'];
  const position = req.body['position'] || 0;
  const videoId = req.body['videoId'];

  if (!playlistItemId || !playlistId || !videoId) {
    res.status(400).send();
    return;
  }

  let updatedItem;
  try {
    updatedItem = await service.update(playlistItemId, playlistId, position, videoId);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(updatedItem);
});

router.delete('/', async (req, res) => {
  const playlistItemId = req.query['playlistItemId'];

  if (!playlistItemId) {
    res.status(400).send();
    return;
  }

  try {
    const response = await service.delete(playlistItemId);
    if (response.status !== 204) {
      throw new Error('Failed to delete an item from the playlist');
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.status(204).send();
});

module.exports = router;