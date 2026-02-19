<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const emit = defineEmits(['close'])

const step = ref(1)
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const errorMsg = ref('')

const requestResetCode = async () => {
  if (!email.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    await api.post('/auth/forgot-password', { email: email.value })
    step.value = 2
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Error al enviar el correo. Inténtalo de nuevo.'
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
    await api.post('/auth/verify-code', {
      email: email.value,
      code: code.value
    })
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
  if (newPassword.value.length < 6) {
    errorMsg.value = 'La contraseña debe tener al menos 6 caracteres.'
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
          <div class="field">
            <input v-model="email" type="email" placeholder="tu@correo.com" required class="input-field"
              :disabled="loading" />
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="btn-primary" :disabled="loading || !email">
            {{ loading ? 'Enviando...' : 'Enviar Código' }}
          </button>
        </form>
      </div>

      <div v-else-if="step === 2" class="step-container">
        <div class="icon-header">✉️</div>
        <h2>Revisa tu bandeja</h2>
        <p class="subtitle">Hemos enviado un código a <strong>{{ email }}</strong></p>

        <form @submit.prevent="verifyCode">
          <div class="field">
            <input v-model="code" type="text" maxlength="6" placeholder="••••••" required class="input-field code-input"
              :disabled="loading" />
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="btn-primary" :disabled="loading || code.length !== 6">
            {{ loading ? 'Verificando...' : 'Verificar Código' }}
          </button>
        </form>
        <button class="btn-text" @click="goBack(1)" :disabled="loading">← Usar otro correo</button>
      </div>

      <div v-else-if="step === 3" class="step-container">
        <div class="icon-header">🔑</div>
        <h2>Crea una nueva contraseña</h2>
        <p class="subtitle">Tu código ha sido verificado. Ingresa tu nueva contraseña.</p>

        <form @submit.prevent="resetPassword">
          <div class="field">
            <input v-model="newPassword" type="password" placeholder="Nueva contraseña" required class="input-field"
              :disabled="loading" />
          </div>
          <div class="field">
            <input v-model="confirmPassword" type="password" placeholder="Confirma la contraseña" required
              class="input-field" :disabled="loading" />
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="btn-primary" :disabled="loading || !newPassword || !confirmPassword">
            {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </form>
      </div>

      <div v-else-if="step === 4" class="step-container success-container">
        <div class="success-icon">✅</div>
        <h2>¡Contraseña actualizada!</h2>
        <p class="subtitle">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button class="btn-primary" @click="$emit('close')">Volver al Login</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1e293b;
}

.icon-header {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.25rem;
  /* Magia para separar los inputs y botones automáticamente */
}

.field {
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  color: #334155;
  transition: all 0.2s;
  background: #f8fafc;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #e91e63;
  background: white;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.code-input {
  text-align: center;
  font-size: 1.8rem;
  letter-spacing: 0.5em;
  font-weight: 800;
  color: #e91e63;
  padding: 1rem;
}

.code-input::placeholder {
  font-size: 1rem;
  letter-spacing: normal;
  font-weight: normal;
  color: #cbd5e1;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(233, 30, 99, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-text {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-text:hover:not(:disabled) {
  color: #1e293b;
  text-decoration: underline;
}

.error-msg {
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  background: #fef2f2;
  padding: 10px;
  border-radius: 8px;
}

.success-container {
  padding-top: 1rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
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
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
