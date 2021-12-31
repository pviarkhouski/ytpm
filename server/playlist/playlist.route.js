const express = require('express');
const service = require('./playlist.service');
const router = express.Router();

const DEFAULT_LIMIT = 25;

router.get('/', async (req, res) => {
  let response;
  let { limit, pageToken } = req.query;
  limit = limit ? parseInt(limit) : DEFAULT_LIMIT;

  try {
    response = await service.getList(limit, pageToken);
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
  res.json(response);
});

router.post('/', async (req, res) => {
  const { title } = req.body;

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
  const { id, title } = req.body;

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
  const { id } = req.query;

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