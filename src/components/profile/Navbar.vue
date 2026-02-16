<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import ChangePasswordModal from './ChangePasswordModal.vue'

const { user, logout, isPremium } = useUser()
const showMenu = ref(false)
const showPasswordModal = ref(false)

const toggleMenu = () => showMenu.value = !showMenu.value
</script>

<template>
  <nav class="navbar">
    <div class="brand">GhostFollow 👻</div>

    <div class="user-section" v-if="user">
      <span v-if="isPremium" class="badge-premium">PREMIUM 💎</span>
      <span v-else class="badge-free">FREE</span>

      <div class="relative">
        <button @click="toggleMenu" class="user-btn">
          <div class="avatar">{{ user.instagramUserName.charAt(0).toUpperCase() }}</div>
          <span class="username">{{ user.instagramUserName }}</span>
          <span class="chevron">▼</span>
        </button>

        <div v-if="showMenu" class="dropdown-menu">
          <div class="menu-header">
            <p class="text-xs text-gray-500">Logueado como</p>
            <p class="text-sm font-bold truncate">{{ user.email }}</p>
          </div>
          <hr class="divider" />

          <button @click="showPasswordModal = true; showMenu = false" class="menu-item">
            🔒 Cambiar contraseña
          </button>

          <button @click="logout" class="menu-item text-red-600">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <ChangePasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </nav>
</template>

<style scoped>
/* Estilos básicos de Navbar existentes + Estos nuevos */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.brand {
  font-weight: 800;
  font-size: 1.25rem;
  color: #e91e63;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-premium {
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.badge-free {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  background: #e91e63;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.username {
  font-weight: 500;
  color: #334155;
}

.chevron {
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Dropdown */
.relative {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 120%;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  z-index: 50;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

.menu-header {
  padding: 12px 16px;
  background: #f8fafc;
}

.divider {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 0;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #475569;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f1f5f9;
}

.text-red-600 {
  color: #dc2626;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
