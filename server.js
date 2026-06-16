require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const timesRoutes = require('./routes/times');
const partidasRoutes = require('./routes/partidas');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/times', timesRoutes);
app.use('/api/partidas', partidasRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Futebol funcionando!' });
});

// Conectar ao MongoDB e iniciar servidor
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado!');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao conectar MongoDB:', err));
