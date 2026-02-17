<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import api from '@/services/api'

const emit = defineEmits(['navigate-pricing'])
const { user, isPremium } = useUser()
const activeTab = ref<'profile' | 'billing' | 'security'>('profile')

// ... (El resto de tu lógica de script se mantiene igual) ...
// Copia aquí las funciones handlePasswordChange, formatDate, etc.
const currentPassword = ref(''); const newPassword = ref(''); const loadingPass = ref(false); const msg = ref({ text: '', type: '' });
const handlePasswordChange = async () => { /* ... tu lógica ... */ }
const formatDate = (d: string) => d /* ... tu lógica ... */
</script>

<template>
  <div class="settings-view-container fade-in">

    <aside class="sidebar">
      <h2 class="sidebar-title">Ajustes</h2>
      <nav class="nav-menu">
        <button @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">
          <span class="icon">👤</span> Mi Perfil
        </button>
        <button @click="activeTab = 'billing'" :class="{ active: activeTab === 'billing' }">
          <span class="icon">💳</span> Suscripción
        </button>
        <button @click="activeTab = 'security'" :class="{ active: activeTab === 'security' }">
          <span class="icon">🔒</span> Seguridad
        </button>
      </nav>
    </aside>

    <main class="content-area">
      <div v-if="activeTab === 'profile'" class="tab-content">
        <h3>Información Personal</h3>
        <div class="profile-header">
          <div class="avatar-large">{{ user?.instagramUserName.charAt(0).toUpperCase() }}</div>
          <div>
            <p class="user-fullname">{{ user?.instagramUserName }}</p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'billing'" class="tab-content">
        <h3>Tu Plan</h3>
        <div class="plan-card">
          <h4>{{ isPremium ? 'Premium' : 'Gratis' }}</h4>
          <button v-if="!isPremium" class="btn-upgrade" @click="$emit('navigate-pricing')">Mejorar</button>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="tab-content">
        <h3>Seguridad</h3>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.settings-view-container {
  display: flex;
  /* Flexbox para poner sidebar al lado del contenido */
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

/* SIDEBAR (Escritorio) */
.sidebar {
  width: 250px;
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
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-menu button:hover {
  background: #e2e8f0;
}

.nav-menu button.active {
  background: white;
  color: #e91e63;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* CONTENIDO */
.content-area {
  flex: 1;
  padding: 2.5rem;
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  .settings-view-container {
    flex-direction: column;
    /* Cambia a columna: Menú arriba, contenido abajo */
    border-radius: 0;
    /* Quita bordes redondeados en móvil para ocupar todo */
    border: none;
    box-shadow: none;
  }

  .sidebar {
    width: 100%;
    /* Ocupa todo el ancho */
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    background: white;
  }

  .sidebar-title {
    display: none;
  }

  /* Ocultamos título en móvil para ahorrar espacio */

  .nav-menu {
    flex-direction: row;
    /* Botones en fila horizontal */
    overflow-x: auto;
    /* Permite scroll horizontal si no caben */
    padding-bottom: 5px;
    /* Espacio para scrollbar */
    gap: 10px;
  }

  .nav-menu button {
    flex: 0 0 auto;
    /* No encoger botones */
    background: #f1f5f9;
    /* Fondo gris para parecer tabs */
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .nav-menu button.active {
    background: #e91e63;
    color: white;
  }

  .content-area {
    padding: 1.5rem;
    /* Menos padding en móvil */
  }
}
</style>
