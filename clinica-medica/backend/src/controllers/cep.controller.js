const axios = require('axios');

exports.buscarCep = async (req, res) => {
  try {
    const { cep } = req.params;
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return res.status(400).json({ mensagem: 'CEP inválido' });

    const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (data.erro) return res.status(404).json({ mensagem: 'CEP não encontrado' });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao buscar CEP' });
  }
};
