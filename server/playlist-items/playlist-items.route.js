const express = require('express');
const service = require('./playlist-items.service');
const router = express.Router();

const DEFAULT_LIMIT = 25;
const DEFAULT_ITEM_POSITION = 0;

router.get('/', async (req, res) => {
  let { playlistId, limit, pageToken } = req.query;

  if (!playlistId) {
    res.status(400).send();
    return;
  }

  limit = limit ? parseInt(limit) : DEFAULT_LIMIT;

  let response;
  try {
    response = await service.getList(playlistId, limit, pageToken);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(response);
});

router.post('/', async (req, res) => {
  let { playlistId, position, videoId } = req.body;
  position = position ? parseInt(position) : DEFAULT_ITEM_POSITION;

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
  let { playlistItemId, playlistId, position, videoId } = req.body;
  position = position ? parseInt(position) : DEFAULT_ITEM_POSITION;

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
  const { playlistItemId } = req.query;

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