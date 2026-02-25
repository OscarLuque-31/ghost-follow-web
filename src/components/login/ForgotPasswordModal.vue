<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const emit = defineEmits(['close'])

const step = ref(1)
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMsg = ref('')

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Mínimo 8 caracteres.'
  if (!/[A-Z]/.test(password)) return 'Debe contener una letra mayúscula.'
  if (!/[0-9]/.test(password)) return 'Debe contener un número.'
  return null
}

const requestResetCode = async () => {
  if (!email.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    step.value = 2
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Error al enviar el correo.'
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  if (code.value.length !== 6) {
    errorMsg.value = 'El código debe tener 6 dígitos.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await api.post('/auth/verify-code', { email: email.value, code: code.value })
    step.value = 3
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Código incorrecto o caducado.'
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    return
  }
  const validationError = validatePassword(newPassword.value)
  if (validationError) {
    errorMsg.value = validationError
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await api.post('/auth/reset-password', {
      email: email.value,
      code: code.value,
      newPassword: newPassword.value
    })
    step.value = 4
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Error al cambiar la contraseña.'
  } finally {
    loading.value = false
  }
}

const goBack = (toStep: number) => {
  errorMsg.value = ''
  step.value = toStep
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card fade-in">

      <button v-if="step !== 4" class="close-btn" @click="$emit('close')">&times;</button>

      <div v-if="step === 1" class="step-container">
        <div class="icon-header">🔒</div>
        <h2>Recuperar Contraseña</h2>
        <p class="subtitle">Ingresa tu correo electrónico y te enviaremos un código de 6 dígitos para restablecer tu
          acceso.</p>

        <form @submit.prevent="requestResetCode">
          <div class="input-wrapper">
            <span class="icon">✉️</span>
            <input v-model="email" type="email" placeholder="tu@correo.com" required class="styled-input"
              :disabled="loading" />
          </div>

          <transition name="fade">
            <div v-if="errorMsg" class="status-box msg-error">{{ errorMsg }}</div>
          </transition>

          <button type="submit" class="btn-primary" :disabled="loading || !email">
            <span v-if="loading" class="loader"></span>
            {{ loading ? 'Enviando...' : 'Enviar Código' }}
          </button>
        </form>
      </div>

      <div v-else-if="step === 2" class="step-container">
        <div class="icon-header">✉️</div>
        <h2>Revisa tu bandeja</h2>
        <p class="subtitle">Hemos enviado un código a <strong>{{ email }}</strong></p>

        <form @submit.prevent="verifyCode">
          <div class="input-wrapper">
            <input v-model="code" type="text" maxlength="6" placeholder="••••••" required
              class="styled-input code-input" :disabled="loading" />
          </div>

          <transition name="fade">
            <div v-if="errorMsg" class="status-box msg-error">{{ errorMsg }}</div>
          </transition>

          <button type="submit" class="btn-primary" :disabled="loading || code.length !== 6">
            <span v-if="loading" class="loader"></span>
            {{ loading ? 'Verificando...' : 'Verificar Código' }}
          </button>
        </form>
        <button class="btn-text back-step" @click="goBack(1)" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor" class="back-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Usar otro correo
        </button>
      </div>

      <div v-else-if="step === 3" class="step-container">
        <div class="icon-header">🔑</div>
        <h2>Crea nueva contraseña</h2>
        <p class="subtitle">Código verificado. Ingresa tu nueva contraseña segura.</p>

        <form @submit.prevent="resetPassword">
          <div class="input-wrapper" style="margin-bottom: 1rem;">
            <span class="icon">🔒</span>
            <input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="Nueva contraseña"
              required class="styled-input pr-10" :disabled="loading" />
            <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.8" stroke="currentColor" class="eye-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                stroke="currentColor" class="eye-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>

          <div class="input-wrapper">
            <span class="icon">✓</span>
            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirma contraseña" required class="styled-input pr-10" :disabled="loading" />
            <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.8" stroke="currentColor" class="eye-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                stroke="currentColor" class="eye-icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>

          <transition name="fade">
            <div v-if="errorMsg" class="status-box msg-error">{{ errorMsg }}</div>
          </transition>

          <button type="submit" class="btn-primary mt-4" :disabled="loading || !newPassword || !confirmPassword">
            <span v-if="loading" class="loader"></span>
            {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </form>
      </div>

      <div v-else-if="step === 4" class="step-container success-container">
        <div class="success-icon">✅</div>
        <h2>¡Actualizada!</h2>
        <p class="subtitle">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button class="btn-primary" @click="$emit('close')">Volver al Login</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  padding: 2.5rem 2rem;
  position: relative;
  box-shadow: 0 20px 40px -5px rgba(233, 30, 99, 0.15);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e91e63;
}

.icon-header {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #831843;
  margin-top: 0;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.input-wrapper {
  position: relative;
  width: 100%;
  text-align: left;
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

.styled-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
  color: #4c1d95;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.styled-input:focus {
  background: white;
  border-color: #f472b6;
  box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.15);
}

.styled-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.styled-input.pr-10 {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 5;
}

.eye-icon {
  width: 22px;
  height: 22px;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.toggle-password:hover .eye-icon {
  color: #db2777;
}

.code-input {
  text-align: center;
  font-size: 1.8rem;
  letter-spacing: 0.4em;
  font-weight: 800;
  color: #e91e63;
  padding: 1rem;
  background: white;
  border: 2px dashed #f472b6;
  padding-left: 1rem !important;
}

.code-input:focus {
  border-style: solid;
}

.code-input::placeholder {
  font-size: 1rem;
  letter-spacing: normal;
  font-weight: normal;
  color: #cbd5e1;
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
  margin-top: 1.5rem;
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

.mt-4 {
  margin-top: 1.5rem;
}

.back-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.back-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.btn-text:hover:not(:disabled) .back-icon {
  transform: translateX(-4px);
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
  padding: 10px 14px;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
}

.msg-error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.success-container {
  padding-top: 1rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
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
</style>
