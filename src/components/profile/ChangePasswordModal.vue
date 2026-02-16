<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const emit = defineEmits(['close'])
const currentPassword = ref('')
const newPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Ajusta la URL según tu backend
    await api.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    success.value = true
    setTimeout(() => emit('close'), 1500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cambiar contraseña'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="text-xl font-bold mb-4">Cambiar Contraseña</h3>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña Actual</label>
          <input v-model="currentPassword" type="password" required class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input v-model="newPassword" type="password" required class="input-field" />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-500 text-sm font-bold">¡Contraseña actualizada!</div>

        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Guardando...' : 'Cambiar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 4px;
}

.btn-primary {
  background: #e91e63;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.7;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
