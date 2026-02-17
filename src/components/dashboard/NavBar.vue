<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'

// Emitimos un evento al Dashboard para que cambie la pestaña
const emit = defineEmits(['navigate'])

const { user, logout, isPremium } = useUser()
const showMenu = ref(false)
const toggleMenu = () => showMenu.value = !showMenu.value

// Función helper para navegar y cerrar menú
const navigateTo = (tab: string) => {
  emit('navigate', tab)
  showMenu.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="brand">
        <span class="ghost">👻</span> GhostFollow
      </div>

      <div class="user-section" v-if="user">
        <span v-if="isPremium" class="badge premium">💎 PREMIUM</span>
        <button v-else class="badge free" @click="navigateTo('pricing')">
          MEJORAR PLAN
        </button>

        <div class="relative">
          <button @click="toggleMenu" class="user-btn" :class="{ active: showMenu }">
            <div class="avatar">
              {{ user.instagramUserName.charAt(0).toUpperCase() }}
              <span class="status-dot"></span>
            </div>
            <span class="username">{{ user.instagramUserName }}</span>
            <span class="chevron" :class="{ rotate: showMenu }">▼</span>
          </button>

          <div v-if="showMenu" class="dropdown-menu fade-in">
            <div class="menu-header">
              <p class="label">Conectado como</p>
              <p class="email">{{ user.email }}</p>
            </div>

            <div class="menu-body">
              <button @click="navigateTo('profile')" class="menu-item">
                ⚙️ Configuración y Perfil
              </button>

              <div class="divider"></div>

              <button @click="logout" class="menu-item logout">
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* COPIA EXACTAMENTE LOS MISMOS ESTILOS QUE TE DI EN EL MENSAJE ANTERIOR */
/* (Navbar Glassmorphism, badges, dropdown, etc.) */
/* No han cambiado los estilos CSS, solo la lógica del script */

.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  width: 100%;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-weight: 900;
  font-size: 1.4rem;
  color: #1e293b;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ghost {
  font-size: 1.6rem;
  animation: float 3s ease-in-out infinite;
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

.user-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  cursor: default;
  border: none;
  transition: transform 0.2s;
}

.badge.premium {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.badge.free {
  background: #1e293b;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.badge.free:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
}

.relative {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid transparent;
  padding: 4px 12px 4px 4px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-btn:hover,
.user-btn.active {
  background: white;
  border-color: #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.avatar {
  width: 38px;
  height: 38px;
  background: #e91e63;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  position: relative;
  font-size: 1.1rem;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border: 2px solid white;
  border-radius: 50%;
}

.username {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.chevron {
  font-size: 0.7rem;
  color: #94a3b8;
  transition: transform 0.2s;
}

.chevron.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 130%;
  width: 240px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  transform-origin: top right;
}

.menu-header {
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.email {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-body {
  padding: 8px;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.menu-item.logout {
  color: #dc2626;
}

.menu-item.logout:hover {
  background: #fef2f2;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 6px 0;
}

.fade-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
