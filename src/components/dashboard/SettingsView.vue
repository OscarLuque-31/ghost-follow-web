<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import api from '@/services/api'

const emit = defineEmits(['navigate-pricing'])
const { user, isPremium } = useUser()
const activeTab = ref<'profile' | 'billing' | 'security'>('profile')

// Lógica de contraseña
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
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="settings-view-container fade-in">

    <aside class="sidebar">
      <h2 class="sidebar-title">Ajustes</h2>
      <nav class="nav-menu">
        <button @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">
          <span class="icon">👤</span> Perfil
        </button>
        <button @click="activeTab = 'billing'" :class="{ active: activeTab === 'billing' }">
          <span class="icon">💳</span> Plan
        </button>
        <button @click="activeTab = 'security'" :class="{ active: activeTab === 'security' }">
          <span class="icon">🔒</span> Seguridad
        </button>
      </nav>
    </aside>

    <main class="content-area">

      <div v-if="activeTab === 'profile'" class="tab-content fade-in">
        <h3 class="tab-title mobile-hidden">Información Personal</h3>

        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-large">{{ user?.instagramUserName.charAt(0).toUpperCase() }}</div>
            <div class="profile-text">
              <p class="user-fullname">{{ user?.instagramUserName }}</p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
          </div>

          <div class="divider"></div>

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

        <div class="plan-card-wrapper" :class="{ 'is-premium': isPremium }">
          <div class="plan-header">
            <span class="plan-label">TU PLAN ACTUAL</span>
            <span class="plan-badge" :class="isPremium ? 'badge-pro' : 'badge-free'">
              {{ isPremium ? 'PREMIUM 💎' : 'GRATIS' }}
            </span>
          </div>

          <div class="plan-body">
            <div v-if="isPremium && user?.subscription">
              <p class="renew-text">Renovación automática el:</p>
              <p class="renew-date">{{ formatDate(user.subscription.currentPeriodEnd) }}</p>
              <div class="status-active">
                <span class="dot"></span> Suscripción Activa
              </div>
            </div>
            <div v-else>
              <p class="description">Estás en el plan básico. Actualiza para desbloquear todas las funciones.</p>
            </div>
          </div>

          <div class="plan-footer">
            <button v-if="!isPremium" class="btn-upgrade" @click="$emit('navigate-pricing')">
              Mejorar Plan ⭐
            </button>
            <button v-else class="btn-manage">
              Gestionar en Stripe ↗
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="tab-content fade-in">
        <h3 class="tab-title mobile-hidden">Seguridad</h3>

        <div class="security-card">
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
              {{ loadingPass ? 'Guardando...' : 'Actualizar Contraseña' }}
            </button>
          </form>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* ========================================= */
/* 🖥️ ESTILOS ESCRITORIO (Base)              */
/* ========================================= */
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
  margin-bottom: 1rem;
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
}

.input-field {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fff;
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
}

/* BILLING CARD */
.plan-card-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.plan-card-wrapper.is-premium {
  background: #fff1f2;
  border-color: #fbcfe8;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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
}

.message.success {
  background: #dcfce7;
  color: #166534;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}


/* ========================================= */
/* 📱 OPTIMIZACIONES MÓVILES (Estilo App)    */
/* ========================================= */
@media (max-width: 768px) {

  /* CONTENEDOR PRINCIPAL: Se vuelve transparente para dejar ver el fondo gris */
  .settings-view-container {
    flex-direction: column;
    border-radius: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    min-height: auto;
  }

  /* BARRA DE NAVEGACIÓN SUPERIOR (Sticky) */
  .sidebar {
    width: 100%;
    padding: 0.8rem 1rem;
    background: white;
    /* Blanco sólido */
    border-right: none;
    position: sticky;
    /* Se pega arriba */
    top: 70px;
    /* Ajustar según tu Navbar principal */
    z-index: 20;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    /* Sombra suave para separar */
  }

  .sidebar-title {
    display: none;
  }

  /* NAV MENU: Scroll Horizontal (Pills) */
  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
    padding: 4px;
    /* Espacio para la sombra del botón */

    /* Ocultar scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .nav-menu::-webkit-scrollbar {
    display: none;
  }

  .nav-menu button {
    flex: 0 0 auto;
    /* No encoger */
    background: #f1f5f9;
    padding: 10px 20px;
    /* Más gorditos */
    border-radius: 50px;
    /* Redondos */
    font-size: 0.9rem;
    justify-content: center;
    box-shadow: none;
  }

  .nav-menu button.active {
    background: #e91e63;
    color: white;
    box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
  }

  /* ÁREA DE CONTENIDO */
  .content-area {
    padding: 1.5rem 1rem;
    background: transparent;
    /* Transparente para ver el fondo */
  }

  .mobile-hidden {
    display: none;
  }

  /* Ocultar títulos redundantes */

  /* TARJETAS (Card Style) */
  /* Aquí convertimos cada sección en una "tarjeta" física con bordes */
  .profile-card,
  .plan-card-wrapper,
  .security-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    /* Borde sutil recuperado */
  }

  /* AJUSTES PERFIL MÓVIL */
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  /* Una columna */

  /* BOTONES TOUCH-FRIENDLY */
  .input-field,
  .input-display {
    font-size: 16px;
    padding: 14px;
  }

  /* Evita zoom iOS */
  .btn-save,
  .btn-upgrade,
  .btn-manage {
    padding: 16px;
    font-size: 1.05rem;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
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
