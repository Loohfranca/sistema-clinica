<div align="center">
  <h1>🏥 Clínica Saúde+</h1>
  <p><strong>Sistema Completo de Agendamento Médico</strong></p>
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</div>

<br>

## 📝 Sobre o Projeto
Este é um trabalho prático focado em informatizar o processo de agendamento de consultas de uma clínica médica. O sistema oferece uma interface moderna para **pacientes** marcarem suas consultas e um **painel de controle** para os **secretários** administrarem os atendimentos do dia a dia.

---

## 🌟 Funcionalidades Implementadas
Atendendo a todos os requisitos solicitados:
- **🔒 Cadastro e login seguro:** Autenticação utilizando JWT (JSON Web Tokens) e hash de senhas criptografadas com `Bcryptjs`.
- **📅 Controle de conflitos:** Agendamento de consultas com bloqueio em tempo real caso o médico já tenha um paciente alocado para aquele horário e data.
- **🗺️ Autocomplete de Endereço:** Ferramenta integrada com a API *ViaCEP*. O paciente informa apenas o CEP e os demais dados do domicílio são autocompletados.
- **🌧️ Alerta Meteorológico Inteligente:** Conexão nativa com a API *OpenWeatherMap*. Se há previsão confirmada de chuva para o dia do médico, um alerta em azul surge automaticamente nas telas avisando o paciente.
- **⚙️ Painel Web Administrativo:** Abas protegidas que listam todas as consultas da clínica, com suporte a filtros de busca e gestão de Status ("Confirmado", "Realizado", "Cancelado").

---

## 💻 Tecnologias e Arquitetura

O projeto divide-se em um esquema **Front-end** e **Back-end API**:

- **Front-end:** Criado e empacotado através do **Vite**. A interface baseia-se em componentes dinâmicos de **Vue.js**, o roteamento seguro com **Vue Router 4** e o estado e tokens da sessão guardados pelo **Pinia**. Estilização 100% manual e responsiva.
- **Back-end:** Construído encima de **Node.js** e **Express**. Controladores independentes dividem as tarefas. Todas as chamadas para a base de dados são feitas através do ORM **Mongoose**.
- **Database:** O armazenamento é distribuído em nuvem, rodando através do **MongoDB Atlas**. 

---

## 🚀 Como Executar o Projeto

Certifique-se de ter o `Node.js` e o `npm` (ambos atuais) instalados na sua máquina.

### 1️⃣ Iniciando o Back-end
1. Navegue até a pasta do back-end através do terminal:
   ```bash
   cd clinica-medica/backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo com nome `.env` caso não exista, e configure suas chaves do MongoDB e da API de clima:
   ```env
   PORT=3000
   MONGO_URI=Sua_Url_Do_MongoDb_Atlas
   JWT_SECRET=Uma_Chave_Aleatoria_Para_Tokens
   OPENWEATHER_API_KEY=Sua_Key_De_Acesso_API_Tempo
   ```
4. Rode as rotas:
   ```bash
   npm run dev
   ```

### 2️⃣ Iniciando o Front-end
Para as interfaces rodarem paralelamente em outro terminal:
1. Abra um segundo terminal e dirija-se à UI:
   ```bash
   cd clinica-medica/frontend
   ```
2. Instale também os pacotes visuais necessários:
   ```bash
   npm install
   ```
3. Rode toda interface Vite (por segurança, usa preferencialmente a porta `5175`):
   ```bash
   npm run dev
   ```

Tudo pronto! Seu navegador irá entregar a tela de boas-vindas da "Clínica Saúde+" em instantes! 🎉

---
<div align="center">
Feito com dedicação ✨
</div>
