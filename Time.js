const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    cidade: { type: String, required: true, trim: true },
    escudo: { type: String, default: '⚽' }, // emoji ou URL
    fundacao: { type: Number },
    vitorias: { type: Number, default: 0 },
    derrotas: { type: Number, default: 0 },
    empates: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Time', timeSchema);
