const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  perfil: { type: String, enum: ['paciente', 'secretario'], default: 'paciente' },
  cpf: { type: String },
  telefone: { type: String },
  cep: { type: String },
  logradouro: { type: String },
  bairro: { type: String },
  cidade: { type: String },
  estado: { type: String },
}, { timestamps: true });

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;
  this.senha = await bcrypt.hash(this.senha, 10);
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
