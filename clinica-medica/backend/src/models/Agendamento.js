const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  medico: { type: String, required: true },
  especialidade: { type: String, required: true },
  data: { type: Date, required: true },
  horario: { type: String, required: true },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'realizado'],
    default: 'agendado'
  },
  observacoes: { type: String },
  previsaoRain: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Agendamento', agendamentoSchema);
