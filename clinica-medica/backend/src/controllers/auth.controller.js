const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, perfil, cpf, telefone } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensagem: 'E-mail já cadastrado' });

    const usuario = await Usuario.create({ nome, email, senha, perfil, cpf, telefone });

    return res.status(201).json({ mensagem: 'Usuário criado com sucesso', id: usuario._id });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao cadastrar', erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario._id, perfil: usuario.perfil, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, perfil: usuario.perfil, nome: usuario.nome });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao fazer login', erro: err.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-senha');
    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro ao buscar perfil' });
  }
};
