const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Dados em memória ──────────────────────────────────────────
let times = [
  { id: '1', nome: 'Flamengo', cidade: 'Rio de Janeiro', escudo: '🔴', fundacao: 1895, vitorias: 0, empates: 0, derrotas: 0 },
  { id: '2', nome: 'Corinthians', cidade: 'São Paulo', escudo: '⚫', fundacao: 1910, vitorias: 0, empates: 0, derrotas: 0 },
];
let partidas = [];
let nextTimeId = 3;
let nextPartidaId = 1;

function gerarId(counter) { return String(counter); }

// ── TIMES ─────────────────────────────────────────────────────

// GET todos os times
app.get('/api/times', (req, res) => {
  res.json(times);
});

// GET time por id
app.get('/api/times/:id', (req, res) => {
  const time = times.find(t => t.id === req.params.id);
  if (!time) return res.status(404).json({ error: 'Time não encontrado' });
  res.json(time);
});

// POST criar time
app.post('/api/times', (req, res) => {
  const { nome, cidade, escudo = '⚽', fundacao } = req.body;
  if (!nome || !cidade) return res.status(400).json({ error: 'Nome e cidade são obrigatórios' });
  const time = { id: gerarId(nextTimeId++), nome, cidade, escudo, fundacao: fundacao || null, vitorias: 0, empates: 0, derrotas: 0 };
  times.push(time);
  res.status(201).json(time);
});

// PUT atualizar time
app.put('/api/times/:id', (req, res) => {
  const idx = times.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Time não encontrado' });
  times[idx] = { ...times[idx], ...req.body, id: req.params.id };
  res.json(times[idx]);
});

// DELETE time
app.delete('/api/times/:id', (req, res) => {
  const idx = times.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Time não encontrado' });
  times.splice(idx, 1);
  res.json({ message: 'Time removido' });
});

// ── PARTIDAS ──────────────────────────────────────────────────

function populatePartida(p) {
  return {
    ...p,
    timeCasa: times.find(t => t.id === p.timeCasaId) || { id: p.timeCasaId, nome: '?', escudo: '?' },
    timeVisitante: times.find(t => t.id === p.timeVisitanteId) || { id: p.timeVisitanteId, nome: '?', escudo: '?' },
  };
}

// GET todas as partidas
app.get('/api/partidas', (req, res) => {
  res.json(partidas.map(populatePartida).reverse());
});

// GET partida por id
app.get('/api/partidas/:id', (req, res) => {
  const p = partidas.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Partida não encontrada' });
  res.json(populatePartida(p));
});

// POST criar partida
app.post('/api/partidas', (req, res) => {
  const { timeCasaId, timeVisitanteId, golsCasa = 0, golsVisitante = 0, data, estadio = 'A definir', status = 'agendada' } = req.body;
  if (!timeCasaId || !timeVisitanteId || !data) return res.status(400).json({ error: 'Times e data são obrigatórios' });
  if (timeCasaId === timeVisitanteId) return res.status(400).json({ error: 'Os times devem ser diferentes' });
  const partida = { id: gerarId(nextPartidaId++), timeCasaId, timeVisitanteId, golsCasa, golsVisitante, data, estadio, status };
  partidas.push(partida);
  res.status(201).json(populatePartida(partida));
});

// PUT atualizar partida
app.put('/api/partidas/:id', (req, res) => {
  const idx = partidas.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Partida não encontrada' });

  const antiga = partidas[idx];
  partidas[idx] = { ...antiga, ...req.body, id: req.params.id };
  const atualizada = partidas[idx];

  // Atualiza stats dos times ao encerrar
  if (req.body.status === 'encerrada' && antiga.status !== 'encerrada') {
    const idxCasa = times.findIndex(t => t.id === atualizada.timeCasaId);
    const idxVisit = times.findIndex(t => t.id === atualizada.timeVisitanteId);
    if (atualizada.golsCasa > atualizada.golsVisitante) {
      if (idxCasa !== -1) times[idxCasa].vitorias++;
      if (idxVisit !== -1) times[idxVisit].derrotas++;
    } else if (atualizada.golsVisitante > atualizada.golsCasa) {
      if (idxVisit !== -1) times[idxVisit].vitorias++;
      if (idxCasa !== -1) times[idxCasa].derrotas++;
    } else {
      if (idxCasa !== -1) times[idxCasa].empates++;
      if (idxVisit !== -1) times[idxVisit].empates++;
    }
  }

  res.json(populatePartida(atualizada));
});

// DELETE partida
app.delete('/api/partidas/:id', (req, res) => {
  const idx = partidas.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Partida não encontrada' });
  partidas.splice(idx, 1);
  res.json({ message: 'Partida removida' });
});

// ── Start ─────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'API Futebol OK!' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
