<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import api from '@/services/api'

const emit = defineEmits(['navigate-pricing'])
const { user, isPremium } = useUser()
const activeTab = ref<'profile' | 'billing' | 'security'>('profile')

const currentPassword = ref('')
const newPassword = ref('')
const loadingPass = ref(false)
const msg = ref({ text: '', type: '' })

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula.'
  }
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula.'
  }
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un número.'
  }
  return null
}

const handlePasswordChange = async () => {
  msg.value = { text: '', type: '' }

  if (!user.value || !user.value.email) {
    msg.value = { text: 'Error: No se pudo identificar al usuario. Intenta recargar la página.', type: 'error' }
    return
  }

  if (currentPassword.value === newPassword.value) {
    msg.value = { text: 'La nueva contraseña debe ser diferente a la actual.', type: 'error' }
    return
  }

  const validationError = validatePassword(newPassword.value)
  if (validationError) {
    msg.value = { text: validationError, type: 'error' }
    return
  }

  loadingPass.value = true
  try {
    await api.post('/auth/change-password', {
      email: user.value.email,
      newPassword: newPassword.value
    })

    msg.value = { text: '¡Contraseña actualizada con éxito!', type: 'success' }

    currentPassword.value = ''
    newPassword.value = ''

  } catch (err: any) {
    msg.value = { text: err.response?.data?.message || 'Error al actualizar la contraseña', type: 'error' }
  } finally {
    loadingPass.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const loadingPortal = ref(false)

const handleManageBilling = async () => {
  loadingPortal.value = true
  try {
    const response = await api.post('/payments/customer-portal')
    const portalUrl = response.data.urlSession || response.data.url

    if (portalUrl) {
      window.location.href = portalUrl
    }
  } catch (error) {
    console.error('Error al abrir el portal de cliente:', error)
    alert('No se pudo abrir el portal de facturación en este momento. Inténtalo más tarde.')
  } finally {
    loadingPortal.value = false
  }
}
</script>

<template>
  <div class="responsive-wrapper">
    <div class="settings-view-container fade-in">

      <aside class="sidebar">
        <h2 class="sidebar-title">Ajustes</h2>
        <nav class="nav-menu">
          <button @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">
            <span class="icon">👤</span>
            <span class="text">Perfil</span>
          </button>
          <button @click="activeTab = 'billing'" :class="{ active: activeTab === 'billing' }">
            <span class="icon">💳</span>
            <span class="text">Plan</span>
          </button>
          <button @click="activeTab = 'security'" :class="{ active: activeTab === 'security' }">
            <span class="icon">🔒</span>
            <span class="text">Seguridad</span>
          </button>
        </nav>
      </aside>

      <main class="content-area">

        <div v-if="activeTab === 'profile'" class="tab-content fade-in">
          <h3 class="tab-title mobile-hidden">Información Personal</h3>

          <div class="card-container">
            <div class="profile-header">
              <div class="avatar-large">{{ user?.instagramUserName.charAt(0).toUpperCase() }}</div>
              <div class="profile-text">
                <p class="user-fullname">{{ user?.instagramUserName }}</p>
                <p class="user-email">{{ user?.email }}</p>
              </div>
            </div>

            <div class="divider desktop-only"></div>

            <div class="info-grid">
              <div class="field">
                <label>Usuario</label>
                <div class="input-display">{{ user?.instagramUserName }}</div>
              </div>
              <div class="field">
                <label>Email</label>
                <div class="input-display">{{ user?.email }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'billing'" class="tab-content fade-in">
          <h3 class="tab-title mobile-hidden">Suscripción</h3>

          <div class="card-container" :class="{ 'is-premium': isPremium }">
            <div class="plan-header">
              <span class="plan-label">ESTADO DEL PLAN</span>
              <span class="plan-badge" :class="isPremium ? 'badge-pro' : 'badge-free'">
                {{ isPremium ? 'PREMIUM 💎' : 'GRATIS' }}
              </span>
            </div>

            <div class="plan-body">
              <div v-if="isPremium && user?.subscription">

                <template v-if="user.subscription.planType === 'PREMIUM_LIFETIME'">
                  <p class="renew-text">Tipo de plan:</p>
                  <p class="renew-date" style="font-size: 1.2rem;">Vitalicio (Para siempre) ♾️</p>
                  <div class="status-active">
                    <span class="dot"></span> Activo
                  </div>
                </template>

                <template v-else-if="user.subscription.status === 'CANCELED'">
                  <p class="renew-text" style="color: #e91e63; font-weight: bold;">Finaliza el:</p>
                  <p class="renew-date">{{ formatDate(user.subscription.currentPeriodEnd) }}</p>
                  <div class="status-active" style="background: #fee2e2; color: #991b1b;">
                    <span class="dot" style="background: #ef4444;"></span> Cancelado
                  </div>
                </template>

                <template v-else>
                  <p class="renew-text">Renovación automática el:</p>
                  <p class="renew-date">{{ formatDate(user.subscription.currentPeriodEnd) }}</p>
                  <div class="status-active">
                    <span class="dot"></span> Activo
                  </div>
                </template>

              </div>
              <div v-else>
                <p class="description">Estás en el plan básico. Actualiza para desbloquear todas las funciones.</p>
              </div>
            </div>

            <div class="plan-footer">
              <button v-if="!isPremium" class="btn-upgrade" @click="$emit('navigate-pricing')">
                Mejorar Plan ⭐
              </button>
              <button v-else class="btn-manage" @click="handleManageBilling" :disabled="loadingPortal">
                {{ loadingPortal ? 'Conectando...' : 'Gestionar en Stripe ↗' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'security'" class="tab-content fade-in">
          <h3 class="tab-title mobile-hidden">Seguridad</h3>

          <div class="card-container">
            <p class="security-intro mobile-only">Gestiona tu acceso</p>
            <form @submit.prevent="handlePasswordChange" class="security-form">
              <div class="field">
                <label>Contraseña Actual</label>
                <input v-model="currentPassword" type="password" placeholder="••••••••" class="input-field" />
              </div>
              <div class="field">
                <label>Nueva Contraseña</label>
                <input v-model="newPassword" type="password" placeholder="••••••••" class="input-field" />
              </div>

              <div v-if="msg.text" :class="['message', msg.type]">
                {{ msg.text }}
              </div>

              <button type="submit" class="btn-save" :disabled="loadingPass || !currentPassword || !newPassword">
                {{ loadingPass ? 'Guardando...' : 'Actualizar' }}
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
/* ========================================= */
/* 🖥️ ESTILOS ESCRITORIO (Base)              */
/* ========================================= */
.responsive-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.settings-view-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 550px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: #f8fafc;
  padding: 2.5rem 1.5rem;
  border-right: 1px solid #e2e8f0;
}

.sidebar-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
  padding-left: 0.5rem;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.nav-menu button {
  text-align: left;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
}

.nav-menu button:hover {
  background: white;
  color: #334155;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.nav-menu button.active {
  background: #e91e63;
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
}

.nav-menu .icon {
  font-size: 1.1rem;
}

/* CONTENT AREA */
.content-area {
  flex: 1;
  padding: 3rem;
  background: white;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 1.5rem 0;
  width: 100%;
}

/* ESTILOS COMUNES */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
  width: 100%;
}

.field label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-display {
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  color: #334155;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.input-field {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

/* PERFIL */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-large {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
  flex-shrink: 0;
}

.user-fullname {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
}

.user-email {
  color: #64748b;
  font-weight: 500;
}

.info-grid {
  display: grid;
  gap: 1rem;
  width: 100%;
}

.card-container.is-premium {
  background: #fff1f2;
  border: 1px solid #fbcfe8;
  border-radius: 20px;
  padding: 2rem;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 10px;
}

.plan-label {
  font-size: 0.8rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1px;
}

.plan-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 30px;
  letter-spacing: 0.5px;
}

.badge-pro {
  background: white;
  color: #e91e63;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.1);
}

.badge-free {
  background: #cbd5e1;
  color: white;
}

.renew-text {
  font-size: 0.9rem;
  color: #64748b;
}

.renew-date {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.status-active {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
}

.description {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.btn-upgrade,
.btn-manage {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: 1rem;
  margin-top: 1rem;
}

.btn-upgrade {
  background: #e91e63;
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
}

.btn-upgrade:hover {
  transform: translateY(-2px);
}

.btn-manage {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-manage:hover:not(:disabled) {
  background: #f8fafc;
}

.btn-manage:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* SEGURIDAD */
.btn-save {
  background: #0f172a;
  color: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #1e293b;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
}

.message.success {
  background: #dcfce7;
  color: #166534;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}

.mobile-only {
  display: none;
}


/* ========================================= */
/* 📱 MOBILE OPTIMIZATIONS                   */
/* ========================================= */
@media (max-width: 768px) {

  .settings-view-container {
    flex-direction: column;
    border-radius: 0;
    border: none;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: none;
    background: transparent;
    min-height: auto;
  }

  .sidebar {
    width: auto;
    padding: 1rem;
    background: white;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    position: relative;
  }

  .sidebar-title {
    display: none;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .nav-menu button {
    flex-direction: row;
    justify-content: flex-start;
    padding: 14px 16px;
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 1rem;
    border: 1px solid transparent;
  }

  .nav-menu button.active {
    background: #e91e63;
    color: white;
    box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
    border-color: #e91e63;
  }

  .content-area {
    padding: 1.5rem 1rem;
    background: #f8fafc;
    width: 100%;
    box-sizing: border-box;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .mobile-hidden {
    display: none;
  }

  .mobile-only {
    display: block;
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .desktop-only {
    display: none;
  }

  .card-container {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .profile-text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
