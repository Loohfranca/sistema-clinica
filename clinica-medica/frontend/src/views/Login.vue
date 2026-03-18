<template>
  <div class="container">
    <div class="card">
      <div class="logo">
        <span class="icon">🏥</span>
        <h1>Clínica Saúde+</h1>
      </div>
      <h2>Acesso à Plataforma</h2>
      <div v-if="erro" class="alerta-erro">⚠️ {{ erro }}</div>
      
      <div class="input-group">
        <label>E-mail 📧</label>
        <input v-model="email" type="email" placeholder="Digite seu e-mail" />
      </div>
      
      <div class="input-group">
        <label>Senha 🔒</label>
        <input v-model="senha" type="password" placeholder="Sua senha secreta" />
      </div>
      
      <button class="btn-primary" @click="fazerLogin" :disabled="carregando">
        {{ carregando ? 'Entrando... 🔄' : 'Entrar na Conta 🚀' }}
      </button>
      
      <p class="footer-text">Não possui conta? <router-link to="/cadastro">Cadastre-se grátis</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function fazerLogin() {
  erro.value = ''
  carregando.value = true
  try {
    await auth.login(email.value, senha.value)
    if (auth.perfil === 'secretario') router.push('/painel')
    else router.push('/meus-agendamentos')
  } catch (e) {
    erro.value = e.response?.data?.mensagem || 'Erro ao processar login'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.card { background: var(--white); padding: 2.5rem; border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border-top: 6px solid var(--primary-green); }
.logo { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.icon { font-size: 2.5rem; }
h1 { color: var(--primary-blue); font-size: 1.8rem; margin: 0; font-weight: 800; }
h2 { color: var(--text-light); font-size: 1rem; font-weight: 500; margin-bottom: 2rem; text-align: center; }
.input-group { margin-bottom: 1.2rem; }
label { display: block; font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.4rem; }
input { width: 100%; padding: 0.9rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; transition: border-color 0.2s, background 0.2s; outline: none; background: #f8fafc; font-family: 'Inter', sans-serif; }
input:focus { border-color: var(--primary-blue); background: white; }
.btn-primary { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--primary-blue), #0ea5e9); color: white; border: none; border-radius: 12px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 15px rgba(2, 132, 199, 0.25); margin-top: 0.5rem; }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.alerta-erro { background: #fee2e2; color: #b91c1c; padding: 0.8rem 1rem; border-radius: 10px; margin-bottom: 1.5rem; font-weight: 600; border-left: 4px solid #ef4444; }
.footer-text { text-align: center; margin-top: 1.8rem; font-size: 0.95rem; font-weight: 500;}
a { color: var(--detail-orange); text-decoration: none; font-weight: 700; transition: color 0.2s; }
a:hover { color: #c2410c; text-decoration: underline; }
</style>
