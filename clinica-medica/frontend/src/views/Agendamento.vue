<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h2>📅 Novo Agendamento</h2>
        <router-link to="/meus-agendamentos" class="link-voltar">🔙 Voltar</router-link>
      </div>
      
      <div v-if="alertaChuva" class="alerta-chuva bounce">
        <h3>🌧️ Cuidado com a chuva!</h3>
        <p>A previsão do tempo indica que deve chover muito no dia e hora da sua consulta. Leve guarda-chuva e saia de casa mais cedo!</p>
      </div>
      
      <div v-if="erro" class="alerta-erro">⚠️ {{ erro }}</div>
      <div v-if="sucesso" class="alerta-sucesso">✅ Consulta agendada com sucesso!</div>

      <div class="form-body">
        <div class="input-group">
          <label>🩺 Especialidade</label>
          <select v-model="form.especialidade">
            <option>Clínico Geral</option>
            <option>Cardiologia</option>
            <option>Dermatologia</option>
            <option>Ortopedia</option>
            <option>Pediatria</option>
          </select>
        </div>

        <div class="input-group">
          <label>👨‍⚕️ Médico</label>
          <input v-model="form.medico" placeholder="Nome do médico (apenas letras)" />
        </div>

        <div class="grid-2">
          <div class="input-group">
            <label>📆 Data</label>
            <input v-model="form.data" type="date" :min="dataMinima" @change="verificarHorario" />
          </div>

          <div class="input-group">
            <label>⏰ Horário</label>
            <select v-model="form.horario" @change="verificarHorario">
              <option v-for="h in horarios" :key="h">{{ h }}</option>
            </select>
          </div>
        </div>

        <div v-if="horarioOcupado" class="alerta-aviso">
          ⛔ Oops! Esse horário já está ocupado. Por favor, escolha outro.
        </div>

        <div class="input-group">
          <label>📝 Observações (Opcional)</label>
          <textarea v-model="form.observacoes" placeholder="Sente alguma dor? Quer relatar algo?"></textarea>
        </div>

        <button class="btn-primary" @click="agendar" :disabled="carregando || horarioOcupado">
          {{ carregando ? 'Processando... 🔄' : 'Confirmar Agendamento ✨' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API = 'http://localhost:3000/api'
const auth = useAuthStore()
const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } })

const form = reactive({ especialidade: 'Clínico Geral', medico: '', data: '', horario: '08:00', observacoes: '' })
const horarios = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00']
const horarioOcupado = ref(false)
const alertaChuva = ref(false)
const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const dataMinima = computed(() => new Date().toISOString().split('T')[0])

async function verificarHorario() {
  if (!form.data || !form.horario || !form.medico) return
  try {
    const { data } = await axios.get(`${API}/agendamentos/verificar`, {
      params: { data: form.data, horario: form.horario, medico: form.medico },
      ...config()
    })
    horarioOcupado.value = !data.disponivel
  } catch (e) { /* ignora */ }
}

async function agendar() {
  erro.value = ''
  sucesso.value = false
  carregando.value = true
  alertaChuva.value = false
  try {
    const { data } = await axios.post(`${API}/agendamentos`, form, config())
    sucesso.value = true
    alertaChuva.value = data.alertaChuva
  } catch (e) {
    erro.value = e.response?.data?.mensagem || 'Erro ao agendar'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
.card { background: var(--white); padding: 2.5rem; border-radius: 20px; width: 100%; max-width: 550px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border-top: 6px solid var(--primary-blue); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
h2 { color: var(--primary-blue); margin: 0; font-size: 1.6rem; font-weight: 800; }
.link-voltar { color: var(--text-light); text-decoration: none; font-weight: 700; font-size: 0.95rem; transition: color 0.2s, background 0.2s; background: #f8fafc; padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid #e2e8f0; }
.link-voltar:hover { background: #e2e8f0; color: #0f172a; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }

.input-group { margin-bottom: 1.2rem; }
label { display: block; font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; }
input, select, textarea { width: 100%; padding: 0.9rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; transition: border-color 0.2s; outline: none; background: #f8fafc; font-family: 'Inter', sans-serif; }
input:focus, select:focus, textarea:focus { border-color: var(--primary-blue); background: white; }
textarea { height: 90px; resize: vertical; }

.btn-primary { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--detail-orange), #ea580c); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 15px rgba(234, 88, 12, 0.25); margin-top: 0.5rem; }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(234, 88, 12, 0.35); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; background: #94a3b8; }

.alerta-chuva { background: #e0f2fe; border-left: 5px solid var(--primary-blue); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; color: #0369a1; }
.alerta-chuva h3 { margin: 0 0 0.3rem 0; font-size: 1.05rem; }
.alerta-chuva p { margin: 0; font-size: 0.9rem; opacity: 0.9; }

.alerta-erro { background: #fee2e2; color: #b91c1c; padding: 0.8rem 1rem; border-radius: 10px; margin-bottom: 1.2rem; font-weight: 600; border-left: 4px solid #ef4444;}
.alerta-sucesso { background: #dcfce7; color: #15803d; padding: 1.2rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 700; text-align: center; font-size: 1.1rem; border: 2px dashed #4ade80; }
.alerta-aviso { background: #fef9c3; color: #a16207; padding: 0.8rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-weight: 600; border-left: 4px solid #eab308; }

@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.bounce { animation: bounce 2s infinite ease-in-out; }
</style>
