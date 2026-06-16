const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema(
  {
    timeCasa: { type: mongoose.Schema.Types.ObjectId, ref: 'Time', required: true },
    timeVisitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Time', required: true },
    golsCasa: { type: Number, default: 0, min: 0 },
    golsVisitante: { type: Number, default: 0, min: 0 },
    data: { type: Date, required: true },
    estadio: { type: String, default: 'A definir', trim: true },
    status: {
      type: String,
      enum: ['agendada', 'em andamento', 'encerrada'],
      default: 'agendada',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partida', partidaSchema);
