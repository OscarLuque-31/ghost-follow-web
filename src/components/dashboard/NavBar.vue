<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'

const emit = defineEmits(['navigate'])
const { user, logout, isPremium } = useUser()

// Estado para menús
const showUserMenu = ref(false)   // Dropdown de escritorio
const showMobileMenu = ref(false) // Menú hamburguesa móvil

const toggleUserMenu = () => showUserMenu.value = !showUserMenu.value
const toggleMobileMenu = () => showMobileMenu.value = !showMobileMenu.value

// Navegación unificada
const navigateTo = (tab: string) => {
  emit('navigate', tab)
  showUserMenu.value = false
  showMobileMenu.value = false // Cerramos el menú móvil al navegar
}

const handleLogout = () => {
  logout()
  showMobileMenu.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">

      <div class="brand">
        <span class="ghost">👻</span>
        <span class="brand-text">GhostFollow</span>
      </div>

      <div class="desktop-menu" v-if="user">
        <span v-if="isPremium" class="badge premium">💎 PREMIUM</span>
        <button v-else class="badge free" @click="navigateTo('pricing')">MEJORAR PLAN</button>

        <div class="relative">
          <button @click="toggleUserMenu" class="user-btn" :class="{ active: showUserMenu }">
            <div class="avatar">
              {{ user.instagramUserName.charAt(0).toUpperCase() }}
              <span class="status-dot"></span>
            </div>
            <span class="username">{{ user.instagramUserName }}</span>
            <span class="chevron">▼</span>
          </button>

          <div v-if="showUserMenu" class="dropdown-menu fade-in">
            <div class="menu-header">
              <p class="label">Conectado como</p>
              <p class="email">{{ user.email }}</p>
            </div>
            <div class="menu-body">
              <button @click="navigateTo('profile')" class="menu-item">⚙️ Configuración</button>
              <div class="divider"></div>
              <button @click="handleLogout" class="menu-item logout">🚪 Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>

      <button class="hamburger-btn" @click="toggleMobileMenu" aria-label="Menu">
        <span v-if="!showMobileMenu">☰</span>
        <span v-else>✕</span>
      </button>

    </div>

    <transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-menu-overlay">
        <div class="mobile-user-info">
          <div class="avatar large">
            {{ user?.instagramUserName.charAt(0).toUpperCase() }}
          </div>
          <p class="mobile-username">{{ user?.instagramUserName }}</p>
          <p class="mobile-email">{{ user?.email }}</p>

          <div class="mobile-badges">
            <span v-if="isPremium" class="badge premium">💎 PREMIUM ACTIVO</span>
            <button v-else class="badge free full-width" @click="navigateTo('pricing')">
              ⭐ MEJORAR A PREMIUM
            </button>
          </div>
        </div>

        <div class="mobile-links">
          <button @click="navigateTo('analysis')" class="mobile-link">🔍 Analizador</button>
          <button @click="navigateTo('relationships')" class="mobile-link">💞 Relaciones</button>
          <button @click="navigateTo('history')" class="mobile-link">📈 Historial</button>
          <button @click="navigateTo('profile')" class="mobile-link">⚙️ Configuración y Perfil</button>
          <button @click="handleLogout" class="mobile-link logout">🚪 Cerrar Sesión</button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* --- BASE NAVBAR --- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* BRAND */
.brand {
  font-weight: 900;
  font-size: 1.4rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ghost {
  font-size: 1.6rem;
}

/* DESKTOP MENU (Se oculta en móvil) */
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* HAMBURGER (Se oculta en escritorio) */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #1e293b;
  cursor: pointer;
  padding: 5px;
}

/* ESTILOS REUTILIZADOS (Badge, Avatar, etc) */
.badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
}

.badge.premium {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.badge.free {
  background: #1e293b;
  color: white;
  cursor: pointer;
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
  font-size: 1.1rem;
  position: relative;
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

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid transparent;
  padding: 4px;
  border-radius: 50px;
  cursor: pointer;
}

.user-btn:hover {
  background: #f8fafc;
}

.username {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.chevron {
  font-size: 0.7rem;
  color: #94a3b8;
}

.relative {
  position: relative;
}

/* DROPDOWN ESCRITORIO */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 140%;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  padding: 8px;
}

.menu-header {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.email {
  font-size: 0.8rem;
  color: #64748b;
  word-break: break-all;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 10px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #475569;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.menu-item.logout {
  color: #dc2626;
}

/* --- MOBILE STYLES (MEDIA QUERIES) --- */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  /* Ocultar menú escritorio */
  .hamburger-btn {
    display: block;
  }

  /* Mostrar hamburguesa */
  .brand-text {
    font-size: 1.2rem;
  }
}

/* --- MENÚ MÓVIL DESPLEGABLE --- */
.mobile-menu-overlay {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: calc(100vh - 70px);
  /* Ocupa el resto de la pantalla */
  overflow-y: auto;
}

.mobile-user-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.avatar.large {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.mobile-username {
  font-weight: 800;
  font-size: 1.2rem;
  color: #1e293b;
}

.mobile-email {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.mobile-badges {
  width: 100%;
  display: flex;
  justify-content: center;
}

.full-width {
  width: 100%;
  padding: 12px;
  font-size: 0.9rem;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-link {
  text-align: left;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: none;
  font-weight: 600;
  color: #334155;
  font-size: 1rem;
}

.mobile-link:active {
  background: #e2e8f0;
}

.mobile-link.logout {
  background: #fef2f2;
  color: #dc2626;
  margin-top: 1rem;
}

/* ANIMACIONES */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
