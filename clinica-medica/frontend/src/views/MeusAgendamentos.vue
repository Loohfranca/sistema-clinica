<template>
  <div class="container">
    <div class="navbar">
      <div class="logo">
        <span class="icon">🏥</span> <span class="title">Clínica Saúde+</span>
      </div>
      <div class="user-area">
        <span class="greeting">Olá, <b>{{ auth.nome || 'Paciente' }}</b> 👋</span>
        <button @click="auth.logout(); $router.push('/login')" class="btn-sair">Sair 🚪</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="header-section">
        <div>
          <h1 class="page-title">Meus Agendamentos</h1>
          <p class="subtitle">Gerencie suas consultas médicas aqui.</p>
        </div>
        <router-link to="/agendamento" class="btn-novo">➕ Nova Consulta</router-link>
      </div>

      <div v-if="agendamentos.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Você não tem consultas</h3>
        <p>Clique em "Nova Consulta" para marcar um horário com nossos especialistas.</p>
      </div>

      <div class="grid-cards">
        <div v-for="ag in agendamentos" :key="ag._id" class="consulta-card" :class="ag.status">
          <div class="card-header">
            <span class="badge" :class="ag.status">{{ ag.status.toUpperCase() }}</span>
            <button v-if="ag.status === 'agendado'" @click="cancelar(ag._id)" class="btn-cancelar">❌ Cancelar</button>
          </div>
          
          <div class="card-body">
            <h3 class="especialidade">{{ ag.especialidade }}</h3>
            <p class="medico">👨‍⚕️ Dr(a). {{ ag.medico }}</p>
            
            <div class="data-hora">
              <span class="date">📅 {{ formatarData(ag.data) }}</span>
              <span class="time">⏰ {{ ag.horario }}</span>
            </div>
          </div>

          <div v-if="ag.previsaoRain" class="chuva-alert">
            <span class="rain-icon">🌧️</span> Alerta de chuva: Não esqueça o guarda-chuva!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API = 'http://localhost:3000/api'
const auth = useAuthStore()
const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } })
const agendamentos = ref([])

onMounted(async () => {
  const { data } = await axios.get(`${API}/agendamentos/meus`, config())
  agendamentos.value = data
})

function formatarData(d) {
  return new Date(d).toLocaleDateString('pt-BR')
}

async function cancelar(id) {
  if (!confirm('Poxa vida! Tem certeza que deseja cancelar esta consulta? 🥺')) return
  try {
    await axios.patch(`${API}/agendamentos/${id}/cancelar`, {}, config())
    agendamentos.value = agendamentos.value.map(a =>
      a._id === id ? { ...a, status: 'cancelado' } : a
    )
  } catch (e) {
    alert('Erro ao cancelar')
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: var(--bg-gradient); padding-bottom: 3rem; }

.navbar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 1.2rem 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10; border-bottom: 3px solid var(--primary-green); }
.logo .icon { font-size: 1.8rem; }
.logo .title { font-weight: 800; color: var(--primary-blue); font-size: 1.4rem; margin-left: 0.5rem; }
.user-area { display: flex; align-items: center; gap: 1.5rem; }
.greeting { color: var(--text-main); font-size: 1.05rem; }
.btn-sair { background: #fef2f2; color: #ef4444; padding: 0.6rem 1.2rem; border-radius: 10px; border: 2px solid #fecaca; cursor: pointer; font-weight: 700; transition: all 0.2s; }
.btn-sair:hover { background: #fee2e2; transform: scale(1.05); }

.content-wrapper { max-width: 950px; margin: 0 auto; padding: 2.5rem; }

.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
.page-title { color: var(--primary-blue); font-size: 2.2rem; margin: 0 0 0.4rem 0; font-weight: 800; }
.subtitle { color: var(--text-light); margin: 0; font-size: 1.1rem; }

.btn-novo { background: linear-gradient(135deg, var(--detail-orange), #ea580c); color: white; padding: 1rem 1.8rem; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1.1rem; box-shadow: 0 6px 15px rgba(234, 88, 12, 0.3); transition: transform 0.2s, box-shadow 0.2s; }
.btn-novo:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(234, 88, 12, 0.4); }

.empty-state { text-align: center; padding: 5rem 2rem; background: white; border-radius: 20px; border: 3px dashed #cbd5e1; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.empty-icon { font-size: 4.5rem; margin-bottom: 1.5rem; opacity: 0.8; }
.empty-state h3 { color: var(--primary-blue); font-size: 1.5rem; margin: 0 0 0.8rem 0; font-weight: 700;}
.empty-state p { color: var(--text-light); font-size: 1.1rem; margin: 0; }

.grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }

.consulta-card { background: white; border-radius: 18px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); overflow: hidden; border-left: 8px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; }
.consulta-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }

.consulta-card.agendado { border-left-color: var(--primary-blue); }
.consulta-card.confirmado { border-left-color: var(--primary-green); }
.consulta-card.cancelado { border-left-color: #ef4444; opacity: 0.8; }
.consulta-card.realizado { border-left-color: #64748b; }

.card-header { display: flex; justify-content: space-between; padding: 1.2rem 1.5rem; border-bottom: 2px solid #f8fafc; background: #f8fafc; align-items: center; }
.badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.5px; }
.badge.agendado { background: #e0f2fe; color: #0284c7; }
.badge.confirmado { background: #dcfce7; color: #15803d; }
.badge.cancelado { background: #fee2e2; color: #b91c1c; }
.badge.realizado { background: #f1f5f9; color: #334155; }

.btn-cancelar { background: white; border: 2px solid #fecaca; color: #ef4444; padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; }
.btn-cancelar:hover { background: #fee2e2; transform: scale(1.05); }

.card-body { padding: 1.5rem; }
.especialidade { margin: 0 0 0.5rem 0; color: var(--text-main); font-size: 1.4rem; font-weight: 800; }
.medico { margin: 0 0 1.5rem 0; color: var(--text-light); font-size: 1.05rem; }

.data-hora { display: flex; gap: 1rem; }
.date, .time { background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 10px; font-size: 0.95rem; font-weight: 700; color: var(--text-main); border: 1px solid #e2e8f0; }

.chuva-alert { background: #e0f2fe; padding: 1rem 1.5rem; font-size: 0.9rem; color: #0369a1; font-weight: 700; display: flex; align-items: center; gap: 0.6rem; border-top: 2px dashed #bae6fd; }
.rain-icon { font-size: 1.4rem; }

@media (max-width: 600px) {
  .header-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .grid-cards { grid-template-columns: 1fr; }
  .navbar { padding: 1rem; }
  .user-area { display: none; }
}
</style>
