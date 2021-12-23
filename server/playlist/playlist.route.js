const express = require('express');
const service = require('./playlist.service');
const router = express.Router();

router.get('/', async (req, res) => {
  let playlists = [];
  try {
    playlists = await service.getList();
  } catch (e) {
    res.status(500).json({error: e.message});
    return;
  }
  res.json(playlists);
});

router.post('/', async (req, res) => {
  const title = req.body['title'];

  if (!title) {
    res.status(400).send();
    return;
  }

  let newItem;
  try {
    newItem = await service.insert(title);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(newItem);
});

router.put('/', async (req, res) => {
  const id = req.body['id'];
  const title = req.body['title'];

  if (!id || !title) {
    res.status(400).send();
    return;
  }

  let updatedItem;
  try {
    updatedItem = await service.update(id, title);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(updatedItem);
});

router.delete('/', async (req, res) => {
  const id = req.query['id'];

  if (!id) {
    res.status(400).send();
    return;
  }

  try {
    const response = await service.delete(id);
    if (response.status !== 204) {
      throw new Error('Failed to delete the playlist');
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.status(204).send();
});

module.exports = router;