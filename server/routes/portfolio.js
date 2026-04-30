const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const { authenticate, optionalAuth } = require('../middleware/auth');

function toDto(p) {
  if (!p) return null;
  return {
    id: p._id.toString(),
    userId: (p.user?._id ?? p.user)?.toString?.() ?? String(p.user ?? ''),
    title: p.title,
    description: p.description,
    imageUris: p.imageUris ?? [],
    imageUri: (p.imageUris && p.imageUris[0]) || undefined,
    location: p.location,
    completedAt: p.completedAt,
    category: p.category,
    createdAt: p.createdAt,
  };
}

// GET /api/portfolio — my portfolio items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Portfolio.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items.map(toDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to list portfolio', message: error.message });
  }
});

// GET /api/portfolio/user/:userId — public portfolio for user
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const items = await Portfolio.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(items.map(toDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load portfolio', message: error.message });
  }
});

// POST /api/portfolio
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, imageUris, imageUri, location, completedAt, category } = req.body || {};
    if (!title || String(title).trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const images = Array.isArray(imageUris) ? imageUris : (imageUri ? [imageUri] : []);
    const doc = await Portfolio.create({
      user: req.userId,
      title: String(title).trim(),
      description,
      imageUris: images,
      location,
      completedAt,
      category
    });
    res.status(201).json(toDto(doc));
  } catch (error) {
    res.status(400).json({ error: 'Failed to create portfolio item', message: error.message });
  }
});

// PUT /api/portfolio/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const doc = await Portfolio.findOne({ _id: req.params.id, user: req.userId });
    if (!doc) return res.status(404).json({ error: 'Portfolio item not found' });
    const fields = ['title', 'description', 'imageUris', 'location', 'completedAt', 'category'];
    for (const k of fields) if (k in req.body) doc[k] = req.body[k];
    await doc.save();
    res.json(toDto(doc));
  } catch (error) {
    res.status(400).json({ error: 'Failed to update portfolio item', message: error.message });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Portfolio item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete portfolio item', message: error.message });
  }
});

module.exports = router;
