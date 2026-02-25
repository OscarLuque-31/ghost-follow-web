<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const accountName = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false); // ESTADO PARA EL OJITO
const isLoading = ref(false);
const statusMsg = ref('');
const isError = ref(false);
const router = useRouter();

const passwordRules = computed(() => {
  const pwd = password.value;
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
  };
});

const isPasswordValid = computed(() => {
  const r = passwordRules.value;
  return r.length && r.uppercase && r.number;
});

const handleRegister = async () => {
  if (!isPasswordValid.value) {
    statusMsg.value = "⚠️ La contraseña no cumple los requisitos.";
    isError.value = true;
    return;
  }

  isLoading.value = true;
  isError.value = false;

  try {
    statusMsg.value = 'Creando cuenta...';

    const response = await api.post('/auth/register', {
      email: email.value,
      password: password.value,
      instagramUsername: accountName.value
    });

    localStorage.setItem('jwt_token', response.data.token);
    statusMsg.value = '✅ ¡Cuenta lista! Entrando...';

    setTimeout(() => {
      router.push({ path: '/dashboard', query: { welcome: 'true' } });
    }, 1000);

  } catch (error: any) {
    isError.value = true;
    statusMsg.value = error.response?.data?.message || '❌ Error al crear la cuenta.';
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
          <span class="arrow">←</span> Inicio
        </router-link>

        <div class="ghost-animation">👻</div>

        <h1>Crear Cuenta</h1>
        <p class="subtitle">Analiza tu Instagram hoy</p>

        <form @submit.prevent="handleRegister">
          <div class="form-fields-container">
            <div class="input-wrapper">
              <span class="icon">👤</span>
              <input v-model="accountName" type="text" placeholder="Usuario IG (ej: @tunombre)" required
                class="styled-input" />
            </div>

            <div class="input-wrapper">
              <span class="icon">✉️</span>
              <input v-model="email" type="email" placeholder="Correo Electrónico" required class="styled-input" />
            </div>

            <div class="input-wrapper">
              <span class="icon">🔒</span>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Contraseña segura"
                class="styled-input pr-10" :class="{ 'input-error': password && !isPasswordValid }" />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '🙈' }}
              </button>
            </div>

            <transition name="expand">
              <div v-if="password" class="password-checklist">
                <p class="requirements-title">Seguridad de la contraseña:</p>
                <ul>
                  <li :class="{ 'met': passwordRules.length }">
                    <span class="check-icon">{{ passwordRules.length ? '✅' : '○' }}</span> Mín. 8 caracteres
                  </li>
                  <li :class="{ 'met': passwordRules.uppercase }">
                    <span class="check-icon">{{ passwordRules.uppercase ? '✅' : '○' }}</span> Una letra mayúscula
                  </li>
                  <li :class="{ 'met': passwordRules.number }">
                    <span class="check-icon">{{ passwordRules.number ? '✅' : '○' }}</span> Un número
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading || !isPasswordValid || !email || !accountName">
            <span v-if="isLoading" class="loader"></span>
            {{ isLoading ? 'Procesando...' : 'Crear Cuenta' }}
          </button>
        </form>

        <transition name="fade">
          <div v-if="statusMsg" :class="['status-box', isError ? 'msg-error' : 'msg-success']">
            {{ statusMsg }}
          </div>
        </transition>

        <div class="footer-links">
          <p>¿Ya tienes cuenta?</p>
          <router-link to="/login" class="login-link">Inicia sesión aquí</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.page-root {
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #fbcfe8 100%);
  z-index: -1;
  overflow: hidden;
}

.scrollable-content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: moveBlob 12s infinite alternate ease-in-out;
}

.blob-1 {
  width: 70vw;
  height: 70vw;
  background-color: #f9a8d4;
  top: -10%;
  left: -10%;
}

.blob-2 {
  width: 60vw;
  height: 60vw;
  background-color: #fdf2f8;
  bottom: -10%;
  right: -10%;
  animation-delay: -6s;
}

@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(30px, 30px) scale(1.05);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px -10px rgba(233, 30, 99, 0.2);
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
}

.back-link {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  text-decoration: none;
  color: #9d174d;
  font-size: 0.9em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  z-index: 10;
}

.back-link:hover {
  transform: translateX(-4px);
  color: #be185d;
}

.ghost-animation {
  font-size: 3.5em;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 8px rgba(233, 30, 99, 0.25));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

h1 {
  margin: 0;
  color: #831843;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #be185d;
  margin-top: 5px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-fields-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
  color: #9d174d;
  opacity: 0.8;
  pointer-events: none;
  z-index: 2;
}

/* ESTILOS DEL INPUT Y EL OJITO */
.styled-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  background: white;
  color: #4c1d95;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.styled-input:focus {
  border-color: #f472b6;
  box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.15);
  transform: translateY(-1px);
}

.styled-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.styled-input.pr-10 {
  padding-right: 3rem;
}

/* Espacio para el ojito */
.input-error {
  border-color: #f87171 !important;
  background-color: #fef2f2 !important;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 5;
  padding: 0;
}

.toggle-password:hover {
  opacity: 1;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  max-height: 200px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-width: 0;
}

.password-checklist {
  background: white;
  padding: 1rem;
  border-radius: 16px;
  text-align: left;
  border: 1px solid #fbcfe8;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.requirements-title {
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: #be185d;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.password-checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-checklist li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.password-checklist li.met {
  color: #10b981;
}

.check-icon {
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e91e63 0%, #db2777 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #f48fb1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-box {
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
}

.msg-error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.msg-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.footer-links {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.login-link {
  color: #db2777;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  margin-top: 6px;
  transition: color 0.2s;
}

.login-link:hover {
  color: #9d174d;
  text-decoration: underline;
}

.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 480px) {
  .scrollable-content {
    align-items: flex-start;
    padding-top: 2rem;
  }

  .glass-card {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }

  h1 {
    font-size: 1.6rem;
  }

  .back-link {
    top: 1rem;
    left: 1rem;
  }

  .styled-input {
    font-size: 1rem;
  }
}
</style>
