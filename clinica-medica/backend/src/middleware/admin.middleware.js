module.exports = (req, res, next) => {
  if (req.usuario.perfil !== 'secretario') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
  }
  next();
};
