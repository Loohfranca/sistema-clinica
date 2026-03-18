<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-blue: #0284c7;
  --primary-green: #10b981;
  --primary-green-hover: #059669;
  --detail-orange: #f97316;
  --bg-gradient: linear-gradient(135deg, #e0f2fe 0%, #d1fae5 100%);
  --text-main: #334155;
  --text-light: #64748b;
  --white: #ffffff;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: var(--bg-gradient);
  background-attachment: fixed;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.4s ease-out;
}
</style>
