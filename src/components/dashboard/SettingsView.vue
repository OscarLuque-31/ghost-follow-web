<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import api from '@/services/api'

// Si necesita ir a pricing, emitimos un evento para que el Dashboard cambie de pestaña
const emit = defineEmits(['navigate-pricing'])

const { user, isPremium } = useUser()
const activeTab = ref<'profile' | 'billing' | 'security'>('profile')

// Lógica de Contraseña
const currentPassword = ref('')
const newPassword = ref('')
const loadingPass = ref(false)
const msg = ref({ text: '', type: '' })

const handlePasswordChange = async () => {
  loadingPass.value = true
  msg.value = { text: '', type: '' }
  try {
    await api.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    msg.value = { text: '¡Contraseña actualizada!', type: 'success' }
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    msg.value = { text: err.response?.data?.message || 'Error', type: 'error' }
  } finally {
    loadingPass.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="settings-view-container fade-in">

    <aside class="sidebar">
      <h2 class="sidebar-title">Ajustes</h2>
      <nav class="nav-menu">
        <button @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Mi Perfil</button>
        <button @click="activeTab = 'billing'" :class="{ active: activeTab === 'billing' }">💳 Suscripción</button>
        <button @click="activeTab = 'security'" :class="{ active: activeTab === 'security' }">🔒 Seguridad</button>
      </nav>
    </aside>

    <main class="content-area">

      <div v-if="activeTab === 'profile'" class="tab-content">
        <h3>Información Personal</h3>
        <div class="profile-header">
          <div class="avatar-large">{{ user?.instagramUserName.charAt(0).toUpperCase() }}</div>
          <div>
            <p class="user-fullname">{{ user?.instagramUserName }}</p>
            <p class="user-email">{{ user?.email }}</p>
          </div>
        </div>
        <div class="info-grid">
          <div class="field">
            <label>Usuario</label>
            <input type="text" :value="user?.instagramUserName" disabled class="input-disabled" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="text" :value="user?.email" disabled class="input-disabled" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'billing'" class="tab-content">
        <h3>Tu Plan</h3>
        <div class="plan-card" :class="{ 'is-premium': isPremium }">
          <div class="plan-info">
            <span class="plan-label">Plan Actual</span>
            <h4 class="plan-name">{{ isPremium ? 'Premium 💎' : 'Plan Gratuito' }}</h4>
            <div v-if="isPremium && user?.subscription" class="dates">
              <p>Renueva el: <strong>{{ formatDate(user.subscription.currentPeriodEnd) }}</strong></p>
            </div>
            <p v-else class="status-free">Versión limitada.</p>
          </div>
          <div class="plan-actions">
            <button v-if="!isPremium" class="btn-upgrade" @click="$emit('navigate-pricing')">Mejorar Plan ⭐</button>
            <button v-else class="btn-manage">Gestionar en Stripe ↗</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="tab-content">
        <h3>Seguridad</h3>
        <form @submit.prevent="handlePasswordChange" class="security-form">
          <div class="field">
            <label>Contraseña Actual</label>
            <input v-model="currentPassword" type="password" class="input-field" />
          </div>
          <div class="field">
            <label>Nueva Contraseña</label>
            <input v-model="newPassword" type="password" class="input-field" />
          </div>
          <div v-if="msg.text" :class="['message', msg.type]">{{ msg.text }}</div>
          <button type="submit" class="btn-save" :disabled="loadingPass || !currentPassword || !newPassword">
            {{ loadingPass ? 'Guardando...' : 'Actualizar' }}
          </button>
        </form>
      </div>

    </main>
  </div>
</template>

<style scoped>
.settings-view-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.sidebar {
  width: 220px;
  background: #f8fafc;
  padding: 2rem;
  border-right: 1px solid #e2e8f0;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #334155;
  margin-bottom: 2rem;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-menu button {
  text-align: left;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-menu button.active {
  background: white;
  color: #e91e63;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-area {
  flex: 1;
  padding: 2.5rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

/* REUTILIZACIÓN DE ESTILOS ANTERIORES */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 50px;
  height: 50px;
  background: #e91e63;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-disabled {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 8px;
  color: #64748b;
}

.input-field {
  border: 1px solid #cbd5e1;
  padding: 10px;
  border-radius: 8px;
}

.plan-card {
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-card.is-premium {
  background: #fff1f2;
  border-color: #fbcfe8;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0.5rem 0;
}

.btn-upgrade {
  background: #e91e63;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-manage {
  border: 1px solid #cbd5e1;
  padding: 10px 20px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-save {
  background: #1e293b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
}

.btn-save:disabled {
  opacity: 0.5;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 0.9rem;
}

.message.success {
  background: #dcfce7;
  color: #166534;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .settings-view-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 1rem;
  }

  .content-area {
    padding: 1.5rem;
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
