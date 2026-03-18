const Agendamento = require('../models/Agendamento');
const axios = require('axios');

// Verifica horário disponível
exports.verificarHorario = async (req, res) => {
  try {
    const { data, horario, medico } = req.query;
    const conflito = await Agendamento.findOne({
      medico,
      data: new Date(data),
      horario,
      status: { $nin: ['cancelado'] }
    });
    return res.json({ disponivel: !conflito });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao verificar horário' });
  }
};

// Criar agendamento
exports.criar = async (req, res) => {
  try {
    const { medico, especialidade, data, horario, observacoes } = req.body;

    // Verifica conflito
    const conflito = await Agendamento.findOne({
      medico, data: new Date(data), horario, status: { $nin: ['cancelado'] }
    });
    if (conflito) return res.status(409).json({ mensagem: 'Horário indisponível' });

    // Verifica clima
    let previsaoRain = false;
    try {
      const dataConsulta = new Date(data);
      const hoje = new Date();
      const diff = Math.ceil((dataConsulta - hoje) / (1000 * 60 * 60 * 24));

      if (diff <= 5) {
        const clima = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=São Paulo,BR&appid=${process.env.OPENWEATHER_API_KEY}&lang=pt_br`
        );
        const previsoes = clima.data.list.filter(item => {
          const d = new Date(item.dt * 1000);
          return d.toDateString() === dataConsulta.toDateString();
        });
        previsaoRain = previsoes.some(p =>
          p.weather[0].main === 'Rain' || p.weather[0].main === 'Thunderstorm'
        );
      }
    } catch (e) { /* silencia erro de clima */ }

    const agendamento = await Agendamento.create({
      paciente: req.usuario.id,
      medico, especialidade, data, horario, observacoes, previsaoRain
    });

    return res.status(201).json({ agendamento, alertaChuva: previsaoRain });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao criar agendamento', erro: err.message });
  }
};

// Listar agendamentos do paciente logado
exports.meus = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ paciente: req.usuario.id })
      .sort({ data: 1 });
    return res.json(agendamentos);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao listar' });
  }
};

// Listar todos (admin)
exports.todos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('paciente', 'nome email telefone')
      .sort({ data: 1 });
    return res.json(agendamentos);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao listar' });
  }
};

// Atualizar status (admin)
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ag = await Agendamento.findByIdAndUpdate(id, { status }, { new: true });
    return res.json(ag);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao atualizar' });
  }
};

// Cancelar (paciente)
exports.cancelar = async (req, res) => {
  try {
    const ag = await Agendamento.findOneAndUpdate(
      { _id: req.params.id, paciente: req.usuario.id },
      { status: 'cancelado' },
      { new: true }
    );
    if (!ag) return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
    return res.json(ag);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao cancelar' });
  }
};
