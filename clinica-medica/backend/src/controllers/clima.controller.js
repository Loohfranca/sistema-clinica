const axios = require('axios');

exports.previsao = async (req, res) => {
  try {
    const { cidade, data } = req.query;
    const { data: clima } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cidade},BR&appid=${process.env.OPENWEATHER_API_KEY}&lang=pt_br&units=metric`
    );

    const dataConsulta = new Date(data);
    const previsoes = clima.list.filter(item => {
      const d = new Date(item.dt * 1000);
      return d.toDateString() === dataConsulta.toDateString();
    });

    const temChuva = previsoes.some(p =>
      p.weather[0].main === 'Rain' || p.weather[0].main === 'Thunderstorm'
    );

    return res.json({
      cidade,
      data,
      temChuva,
      previsoes: previsoes.map(p => ({
        hora: new Date(p.dt * 1000).getHours() + 'h',
        descricao: p.weather[0].description,
        temp: p.main.temp
      }))
    });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao buscar clima' });
  }
};
