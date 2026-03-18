import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    perfil: localStorage.getItem('perfil') || null,
    nome: localStorage.getItem('nome') || null,
  }),
  actions: {
    async login(email, senha) {
      const { data } = await axios.post(`${API}/auth/login`, { email, senha })
      this.token = data.token
      this.perfil = data.perfil
      this.nome = data.nome
      localStorage.setItem('token', data.token)
      localStorage.setItem('perfil', data.perfil)
      localStorage.setItem('nome', data.nome)
    },
    logout() {
      this.token = null
      this.perfil = null
      this.nome = null
      localStorage.clear()
    }
  }
})
