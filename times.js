const express = require('express');
const router = express.Router();
const Time = require('../models/Time');

// GET todos
router.get('/', async (req, res) => {
  try {
    const times = await Time.find().sort({ nome: 1 });
    res.json(times);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por id
router.get('/:id', async (req, res) => {
  try {
    const time = await Time.findById(req.params.id);
    if (!time) return res.status(404).json({ error: 'Time não encontrado' });
    res.json(time);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST criar
router.post('/', async (req, res) => {
  try {
    const time = new Time(req.body);
    await time.save();
    res.status(201).json(time);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT atualizar
router.put('/:id', async (req, res) => {
  try {
    const time = await Time.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!time) return res.status(404).json({ error: 'Time não encontrado' });
    res.json(time);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const time = await Time.findByIdAndDelete(req.params.id);
    if (!time) return res.status(404).json({ error: 'Time não encontrado' });
    res.json({ message: 'Time removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
