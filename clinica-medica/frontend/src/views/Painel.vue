<template>
  <div class="container">
    <div class="navbar">
      <div class="logo">
        <span class="icon">🏥</span> <span class="title">Clínica Saúde+ | Admin</span>
      </div>
      <div class="user-area">
        <span class="greeting">Modo Secretário(a) 📋</span>
        <button @click="auth.logout(); $router.push('/login')" class="btn-sair">Sair 🚪</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="header-section">
        <div>
          <h1 class="page-title">Painel de Atendimentos</h1>
          <p class="subtitle">Visão geral de todos os agendamentos da clínica.</p>
        </div>
      </div>

      <div class="filtros-card">
        <h3 class="filtros-title">🔍 Filtros Rápido</h3>
        <div class="filtros">
          <div class="input-group">
            <input v-model="filtro" placeholder="Buscar por paciente ou médico..." />
          </div>
          <div class="input-group">
            <select v-model="statusFiltro">
              <option value="">📋 Todos os status</option>
              <option value="agendado">🔵 Agendado</option>
              <option value="confirmado">🟢 Confirmado</option>
              <option value="cancelado">🔴 Cancelado</option>
              <option value="realizado">⚪ Realizado</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico / Especialidade</th>
              <th>Data e Hora</th>
              <th>Status do Atendimento</th>
              <th>Clima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="agendamentosFiltrados.length === 0">
              <td colspan="5" class="empty-table">Nenhum atendimento encontrado na busca.</td>
            </tr>
            <tr v-for="ag in agendamentosFiltrados" :key="ag._id" :class="ag.status">
              <td>
                <div class="paciente-nome">{{ ag.paciente?.nome || 'Paciente Excluído' }}</div>
                <div class="paciente-tel">📞 {{ ag.paciente?.telefone || '-' }}</div>
              </td>
              <td>
                <div class="medico-nome">Dr(a). {{ ag.medico }}</div>
                <div class="medico-espec">{{ ag.especialidade }}</div>
              </td>
              <td>
                <div class="data-block">
                  <span class="data-badge">{{ formatarData(ag.data) }}</span>
                  <span class="hora-badge">{{ ag.horario }}</span>
                </div>
              </td>
              <td>
                <select :value="ag.status" class="status-select" :class="ag.status" @change="atualizarStatus(ag._id, $event.target.value)">
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td class="center-align">
                <span v-if="ag.previsaoRain" class="chuva-icon" title="Previsão de chuva">🌧️</span>
                <span v-else class="sol-icon" title="Dia limpo">☀️</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API = 'http://localhost:3000/api'
const auth = useAuthStore()
const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } })
const agendamentos = ref([])
const filtro = ref('')
const statusFiltro = ref('')

onMounted(async () => {
  const { data } = await axios.get(`${API}/agendamentos/todos`, config())
  agendamentos.value = data
})

const agendamentosFiltrados = computed(() =>
  agendamentos.value.filter(a => {
    const texto = `${a.paciente?.nome} ${a.medico}`.toLowerCase()
    const passaFiltro = !filtro.value || texto.includes(filtro.value.toLowerCase())
    const passaStatus = !statusFiltro.value || a.status === statusFiltro.value
    return passaFiltro && passaStatus
  })
)

function formatarData(d) { return new Date(d).toLocaleDateString('pt-BR') }

async function atualizarStatus(id, status) {
  try {
    await axios.patch(`${API}/agendamentos/${id}/status`, { status }, config())
    agendamentos.value = agendamentos.value.map(a => a._id === id ? { ...a, status } : a)
  } catch (e) {
    alert('Erro ao atualizar status do paciente')
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: var(--bg-gradient); padding-bottom: 3rem; }

.navbar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 1.2rem 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10; border-bottom: 3px solid var(--primary-blue); }
.logo .icon { font-size: 1.8rem; }
.logo .title { font-weight: 800; color: var(--primary-blue); font-size: 1.4rem; margin-left: 0.5rem; }
.user-area { display: flex; align-items: center; gap: 1.5rem; }
.greeting { color: var(--text-main); font-size: 1.05rem; font-weight: 600; }
.btn-sair { background: #fef2f2; color: #ef4444; padding: 0.6rem 1.2rem; border-radius: 10px; border: 2px solid #fecaca; cursor: pointer; font-weight: 700; transition: all 0.2s; }
.btn-sair:hover { background: #fee2e2; transform: scale(1.05); }

.content-wrapper { max-width: 1100px; margin: 0 auto; padding: 2.5rem; }

.header-section { margin-bottom: 2rem; }
.page-title { color: var(--primary-blue); font-size: 2.2rem; margin: 0 0 0.4rem 0; font-weight: 800; }
.subtitle { color: var(--text-light); margin: 0; font-size: 1.1rem; }

.filtros-card { background: white; padding: 1.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.04); margin-bottom: 2rem; border-left: 6px solid var(--primary-green); }
.filtros-title { margin: 0 0 1rem 0; color: var(--text-main); font-size: 1.1rem; }
.filtros { display: flex; gap: 1.5rem; }
.filtros .input-group { flex: 1; }
.filtros input, .filtros select { width: 100%; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; font-weight: 500; font-family: 'Inter', sans-serif; color: var(--text-main); background: #f8fafc; outline: none; transition: border-color 0.2s; }
.filtros input:focus, .filtros select:focus { border-color: var(--primary-blue); background: white; }

.table-container { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #e2e8f0; }
table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
th { background: #f8fafc; padding: 1.2rem; text-align: left; border-bottom: 2px solid #e2e8f0; color: var(--text-main); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
td { padding: 1.2rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; transition: background 0.2s; }
tbody tr:hover { background: #f8fafc; }

.empty-table { text-align: center; padding: 4rem; color: var(--text-light); font-size: 1.1rem; }

.paciente-nome, .medico-nome { font-weight: 700; color: var(--text-main); font-size: 1.05rem; margin-bottom: 0.2rem; }
.paciente-tel, .medico-espec { color: var(--text-light); font-size: 0.85rem; font-weight: 500; }

.data-block { display: flex; gap: 0.5rem; align-items: center; }
.data-badge, .hora-badge { background: #f1f5f9; padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: 1px solid #e2e8f0; color: var(--primary-blue); }

.status-select { padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; outline: none; border: 2px solid transparent; width: 140px; transition: all 0.2s; }
.status-select.agendado { background: #e0f2fe; color: #0284c7; border-color: #bae6fd; }
.status-select.confirmado { background: #dcfce7; color: #15803d; border-color: #86efac; }
.status-select.cancelado { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }
.status-select.realizado { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
.status-select:hover { filter: brightness(0.95); }

.center-align { text-align: center; }
.chuva-icon, .sol-icon { font-size: 1.8rem; }
.sol-icon { opacity: 0.4; filter: grayscale(1); }

@media (max-width: 800px) {
  .filtros { flex-direction: column; gap: 1rem; }
  .table-container { overflow-x: auto; }
}
</style>
