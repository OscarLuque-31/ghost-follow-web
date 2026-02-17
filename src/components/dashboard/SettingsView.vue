<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import api from '@/services/api'

const emit = defineEmits(['navigate-pricing'])
const { user, isPremium } = useUser()
const activeTab = ref<'profile' | 'billing' | 'security'>('profile')

// --- LÓGICA DE CONTRASEÑA ---
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

// Formatear fechas
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
          <span class="icon">👤</span> <span class="text">Perfil</span>
        </button>
        <button @click="activeTab = 'billing'" :class="{ active: activeTab === 'billing' }">
          <span class="icon">💳</span> <span class="text">Suscripción</span>
        </button>
        <button @click="activeTab = 'security'" :class="{ active: activeTab === 'security' }">
          <span class="icon">🔒</span> <span class="text">Seguridad</span>
        </button>
      </nav>
    </aside>

    <main class="content-area">

      <div v-if="activeTab === 'profile'" class="tab-content fade-in">
        <h3 class="tab-title">Mi Perfil</h3>

        <div class="profile-header">
          <div class="avatar-large">{{ user?.instagramUserName.charAt(0).toUpperCase() }}</div>
          <div class="profile-text">
            <p class="user-fullname">{{ user?.instagramUserName }}</p>
            <p class="user-email">{{ user?.email }}</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="field">
            <label>Usuario de Instagram</label>
            <div class="input-display">{{ user?.instagramUserName }}</div>
          </div>
          <div class="field">
            <label>Correo Electrónico</label>
            <div class="input-display">{{ user?.email }}</div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'billing'" class="tab-content fade-in">
        <h3 class="tab-title">Suscripción</h3>

        <div class="plan-card" :class="{ 'premium-border': isPremium }">
          <div class="plan-header">
            <span class="plan-label">PLAN ACTUAL</span>
            <div class="plan-badge" :class="isPremium ? 'b-premium' : 'b-free'">
              {{ isPremium ? 'PREMIUM 💎' : 'GRATUITO' }}
            </div>
          </div>

          <div v-if="isPremium && user?.subscription" class="plan-details">
            <p>Renueva el: <strong>{{ formatDate(user.subscription.currentPeriodEnd) }}</strong></p>
            <p class="text-green-600">✅ Suscripción Activa</p>
            <button class="btn-manage">Gestionar en Stripe ↗</button>
          </div>

          <div v-else class="plan-details">
            <p class="text-gray-500 mb-4">Estás perdiendo datos importantes de tus seguidores.</p>
            <button class="btn-upgrade" @click="$emit('navigate-pricing')">
              Mejorar Plan ⭐
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="tab-content fade-in">
        <h3 class="tab-title">Seguridad</h3>
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

    </main>
  </div>
</template>

<style scoped>
/* --- ESTRUCTURA GENERAL (Desktop First) --- */
.settings-view-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

/* SIDEBAR ESCRITORIO */
.sidebar {
  width: 240px;
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
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
}

.nav-menu button:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.nav-menu button.active {
  background: white;
  color: #e91e63;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-menu .icon {
  font-size: 1.1rem;
}

/* CONTENIDO PRINCIPAL */
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
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

/* PERFIL */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.avatar-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.user-fullname {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}

.user-email {
  color: #64748b;
}

.info-grid {
  display: grid;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-display {
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 10px;
  color: #334155;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.input-field {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  transition: border 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #e91e63;
}

/* BILLING */
.plan-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  background: #f8fafc;
}

.plan-card.premium-border {
  border-color: #fbcfe8;
  background: #fff1f2;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.plan-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.plan-badge {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
}

.b-premium {
  background: white;
  color: #e91e63;
  box-shadow: 0 2px 4px rgba(233, 30, 99, 0.1);
}

.b-free {
  background: #e2e8f0;
  color: #475569;
}

.btn-upgrade {
  width: 100%;
  background: #e91e63;
  color: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;
}

.btn-upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.2);
}

.btn-manage {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

/* SEGURIDAD */
.btn-save {
  background: #0f172a;
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
}

.btn-save:disabled {
  opacity: 0.5;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 0.9rem;
  text-align: center;
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
/* 📱 MOBILE OPTIMIZATIONS (Magia aquí)      */
/* ========================================= */
@media (max-width: 768px) {

  .settings-view-container {
    flex-direction: column;
    border-radius: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    /* Fondo transparente para que respire */
    min-height: auto;
  }

  /* BARRA DE NAVEGACIÓN SUPERIOR (Sticky & Scrollable) */
  .sidebar {
    width: 100%;
    padding: 0.5rem 1rem;
    background: white;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 70px;
    /* Ajustar según altura de tu Navbar principal */
    z-index: 10;
  }

  .sidebar-title {
    display: none;
  }

  /* Ocultamos título redundante */

  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    /* SCROLL HORIZONTAL */
    scroll-behavior: smooth;
    gap: 12px;
    padding-bottom: 0;
    /* Ocultar Scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .nav-menu::-webkit-scrollbar {
    display: none;
  }

  /* BOTONES TIPO "CÁPSULA" (Pills) */
  .nav-menu button {
    flex: 0 0 auto;
    /* No encoger */
    background: #f1f5f9;
    padding: 8px 16px;
    border-radius: 20px;
    /* Redondos */
    font-size: 0.85rem;
    white-space: nowrap;
    /* Texto en una línea */
    justify-content: center;
  }

  .nav-menu button.active {
    background: #e91e63;
    color: white;
    box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
  }

  /* Iconos más pequeños en móvil o ocultarlos si prefieres */
  .nav-menu .icon {
    font-size: 1rem;
    margin-right: 4px;
  }

  /* CONTENIDO */
  .content-area {
    padding: 1.5rem;
    background: white;
    /* border-top-left-radius: 20px;
    border-top-right-radius: 20px; */
    /* Efecto "Hoja" opcional */
  }

  .tab-title {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  /* AJUSTES DE PERFIL MÓVIL */
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  /* Inputs más grandes para dedos */
  .input-field,
  .input-display {
    padding: 14px;
    font-size: 16px;
    /* Evita zoom en iOS */
  }

  .btn-save,
  .btn-upgrade {
    padding: 16px;
    /* Botones más altos para tocar fácil */
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
