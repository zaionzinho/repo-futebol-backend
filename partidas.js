const express = require('express');
const router = express.Router();
const Partida = require('../models/Partida');
const Time = require('../models/Time');

// GET todas
router.get('/', async (req, res) => {
  try {
    const partidas = await Partida.find()
      .populate('timeCasa', 'nome escudo cidade')
      .populate('timeVisitante', 'nome escudo cidade')
      .sort({ data: -1 });
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por id
router.get('/:id', async (req, res) => {
  try {
    const partida = await Partida.findById(req.params.id)
      .populate('timeCasa')
      .populate('timeVisitante');
    if (!partida) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json(partida);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST criar
router.post('/', async (req, res) => {
  try {
    const partida = new Partida(req.body);
    await partida.save();
    const populated = await partida.populate([
      { path: 'timeCasa', select: 'nome escudo' },
      { path: 'timeVisitante', select: 'nome escudo' },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT atualizar (e atualiza stats dos times se encerrada)
router.put('/:id', async (req, res) => {
  try {
    const antiga = await Partida.findById(req.params.id);
    if (!antiga) return res.status(404).json({ error: 'Partida não encontrada' });

    const partida = await Partida.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('timeCasa', 'nome escudo')
      .populate('timeVisitante', 'nome escudo');

    // Atualiza estatísticas se o status mudou para encerrada
    if (req.body.status === 'encerrada' && antiga.status !== 'encerrada') {
      const { golsCasa, golsVisitante, timeCasa, timeVisitante } = partida;
      if (golsCasa > golsVisitante) {
        await Time.findByIdAndUpdate(timeCasa._id, { $inc: { vitorias: 1 } });
        await Time.findByIdAndUpdate(timeVisitante._id, { $inc: { derrotas: 1 } });
      } else if (golsVisitante > golsCasa) {
        await Time.findByIdAndUpdate(timeVisitante._id, { $inc: { vitorias: 1 } });
        await Time.findByIdAndUpdate(timeCasa._id, { $inc: { derrotas: 1 } });
      } else {
        await Time.findByIdAndUpdate(timeCasa._id, { $inc: { empates: 1 } });
        await Time.findByIdAndUpdate(timeVisitante._id, { $inc: { empates: 1 } });
      }
    }

    res.json(partida);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const partida = await Partida.findByIdAndDelete(req.params.id);
    if (!partida) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json({ message: 'Partida removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
