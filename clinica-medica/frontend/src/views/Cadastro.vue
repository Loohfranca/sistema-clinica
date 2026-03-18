<template>
  <div class="container">
    <div class="card">
      <div class="logo">
        <span class="icon">🏥</span>
        <h1>Clínica Saúde+</h1>
      </div>
      <h2>Criar sua conta na Plataforma</h2>
      
      <div v-if="sucesso" class="alerta-sucesso">🎉 Que legal! Conta criada com sucesso! <router-link to="/login">Fazer login</router-link></div>
      <div v-if="erro" class="alerta-erro">⚠️ {{ erro }}</div>
      
      <div class="grid-form">
        <div class="input-group full">
          <label>Nome Completo 👤</label>
          <input v-model="form.nome" placeholder="Como devemos te chamar?" />
        </div>
        
        <div class="input-group">
          <label>E-mail 📧</label>
          <input v-model="form.email" type="email" placeholder="Seu melhor e-mail" />
        </div>
        
        <div class="input-group">
          <label>Senha 🔒</label>
          <input v-model="form.senha" type="password" placeholder="Uma senha secreta" />
        </div>
        
        <div class="input-group">
          <label>CPF 🪪</label>
          <input v-model="form.cpf" placeholder="Apenas números" />
        </div>
        
        <div class="input-group">
          <label>Telefone 📱</label>
          <input v-model="form.telefone" placeholder="(11) 90000-0000" />
        </div>
        
        <div class="input-group cep-grupo">
          <label>CEP 🗺️</label>
          <input v-model="form.cep" placeholder="00000-000" @blur="buscarCep" />
          <span v-if="buscandoCep" class="spinner">⏳</span>
        </div>
        
        <div class="input-group">
          <label>Bairro</label>
          <input v-model="form.bairro" placeholder="Preenchimento auto..." readonly />
        </div>
        
        <div class="input-group full">
          <label>Logradouro</label>
          <input v-model="form.logradouro" placeholder="Preenchimento auto..." readonly />
        </div>
        
        <div class="input-group">
          <label>Cidade</label>
          <input v-model="form.cidade" placeholder="Auto..." readonly />
        </div>
        
        <div class="input-group">
          <label>Tipo de Conta 🔑</label>
          <select v-model="form.perfil">
            <option value="paciente">👨‍⚕️ Paciente</option>
            <option value="secretario">📋 Secretário(a)</option>
          </select>
        </div>
      </div>
      
      <button class="btn-primary" @click="cadastrar" :disabled="carregando">
        {{ carregando ? 'Aguarde... 🔄' : 'Finalizar Cadastro 🚀' }}
      </button>
      
      <p class="footer-text">Já faz parte da clínica? <router-link to="/login">Entrar</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const API = 'http://localhost:3000/api'
const form = reactive({ nome: '', email: '', senha: '', cpf: '', telefone: '', cep: '', logradouro: '', bairro: '', cidade: '', estado: '', perfil: 'paciente' })
const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)
const buscandoCep = ref(false)

async function buscarCep() {
  if (form.cep.length < 8) return
  buscandoCep.value = true
  try {
    const { data } = await axios.get(`${API}/cep/${form.cep}`)
    form.logradouro = data.logradouro
    form.bairro = data.bairro
    form.cidade = data.localidade
    form.estado = data.uf
  } catch (e) { /* ignora */ }
  finally { buscandoCep.value = false }
}

async function cadastrar() {
  erro.value = ''
  carregando.value = true
  try {
    await axios.post(`${API}/auth/cadastrar`, form)
    sucesso.value = true
  } catch (e) {
    erro.value = e.response?.data?.mensagem || 'Erro ao cadastrar'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
.card { background: var(--white); padding: 2.5rem; border-radius: 20px; width: 100%; max-width: 650px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border-top: 6px solid var(--primary-green); }
.logo { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.icon { font-size: 2.5rem; }
h1 { color: var(--primary-blue); font-size: 1.8rem; margin: 0; font-weight: 800; }
h2 { color: var(--text-light); font-size: 1.05rem; font-weight: 500; margin-bottom: 2rem; text-align: center; }

.grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.8rem; }
.full { grid-column: 1 / -1; }

.input-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; }
input, select { width: 100%; padding: 0.9rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; transition: border-color 0.2s, background 0.2s; outline: none; background: #f8fafc; font-family: 'Inter', sans-serif;}
input:focus, select:focus { border-color: var(--primary-green); background: white; }
input[readonly] { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; border-color: #f1f5f9; }

.cep-grupo { position: relative; }
.spinner { position: absolute; right: 12px; top: 38px; font-size: 1.2rem; animation: spin 1s linear infinite; }

.btn-primary { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--primary-green), #047857); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.25); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.alerta-erro { background: #fee2e2; color: #b91c1c; padding: 0.8rem 1rem; border-radius: 10px; margin-bottom: 1.5rem; font-weight: 600; border-left: 4px solid #ef4444; }
.alerta-sucesso { background: #dcfce7; color: #15803d; padding: 1.2rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 700; text-align: center; border: 2px dashed #4ade80; font-size: 1.05rem; }

.footer-text { text-align: center; margin-top: 1.8rem; font-size: 0.95rem; font-weight: 500;}
a { color: var(--detail-orange); text-decoration: none; font-weight: 700; transition: color 0.2s;  }
a:hover { color: #c2410c; text-decoration: underline; }

@keyframes spin { 100% { transform: rotate(360deg); } }
@media (max-width: 500px) { .grid-form { grid-template-columns: 1fr; } }
</style>
