<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('jwt_token', response.data.token);
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = 'Credenciales incorrectas. Inténtalo de nuevo.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="page-root">

    <div class="fixed-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="scrollable-content">

      <div class="glass-card fade-in-up">
        <router-link to="/" class="back-link">
          <span class="arrow">←</span> Volver
        </router-link>

        <div class="ghost-animation">👻</div>

        <h1>Bienvenido</h1>
        <p class="subtitle">Inicia sesión en GhostFollow</p>

        <form @submit.prevent="handleLogin">

          <div class="input-wrapper">
            <span class="icon">✉️</span>
            <input v-model="email" type="email" placeholder="Correo electrónico" required class="styled-input" />
          </div>

          <div class="input-wrapper">
            <span class="icon">🔒</span>
            <input v-model="password" type="password" placeholder="Contraseña" required class="styled-input" />
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Entrando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div v-if="errorMsg" class="error-box">
          {{ errorMsg }}
        </div>

        <div class="footer-links">
          <p>¿No tienes cuenta?</p>
          <router-link to="/register" class="register-link">Regístrate gratis</router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page-root {
  width: 100%;
  font-family: 'Segoe UI', sans-serif;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  z-index: -1;
  overflow: hidden;
}

.scrollable-content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: moveBlob 10s infinite alternate ease-in-out;
}

.blob-1 {
  width: 80vw;
  height: 80vw;
  background-color: #ffc1e3;
  top: -20%;
  left: -20%;
}

.blob-2 {
  width: 70vw;
  height: 70vw;
  background-color: #fff0f5;
  bottom: -20%;
  right: -20%;
  animation-delay: -5s;
}

@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(20px, 20px) scale(1.1);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.15);
  width: 100%;
  max-width: 380px;
  position: relative;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-link {
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: #c2185b;
  font-size: 0.9em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: translateX(-3px);
  color: #880e4f;
}

.ghost-animation {
  font-size: 4em;
  margin-top: 10px;
  margin-bottom: 5px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 5px 5px rgba(233, 30, 99, 0.2));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

h1 {
  margin: 0;
  color: #880e4f;
  font-size: 1.8em;
  font-weight: 800;
}

.subtitle {
  color: #c2185b;
  margin-top: 5px;
  margin-bottom: 30px;
  font-size: 0.95em;
  opacity: 0.8;
}

.input-wrapper {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}

.icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
  pointer-events: none;
  opacity: 0.7;
}

.styled-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  color: #880e4f;
  box-sizing: border-box;
  transition: all 0.3s ease;
  outline: none;
}

.styled-input:focus {
  background: white;
  border-color: #e91e63;
  box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.1);
}

.styled-input::placeholder {
  color: #d81b60;
  opacity: 0.5;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover {
  background-color: #c2185b;
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background-color: #f48fb1;
  cursor: wait;
}

.error-box {
  background: #ffebee;
  color: #d32f2f;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  font-size: 0.9em;
  font-weight: 600;
  border: 1px solid #ffcdd2;
}

.footer-links {
  margin-top: 25px;
  font-size: 0.95em;
  color: #c2185b;
}

.register-link {
  color: #e91e63;
  text-decoration: none;
  font-weight: 800;
  display: inline-block;
  margin-top: 5px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
