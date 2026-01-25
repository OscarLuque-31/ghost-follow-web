<script setup lang="ts">
defineProps<{ accountName: string }>()
const emit = defineEmits(['logout'])
</script>

<template>
  <nav class="navbar">
    <div class="brand">
      <div class="logo-icon">👻</div>
      <span class="brand-name mobile-hide">GhostFollow</span>
    </div>
    <div class="user-actions">
      <span class="user-badge">{{ accountName || 'Cargando...' }}</span>
      <button @click="emit('logout')" class="btn-icon-logout" title="Cerrar Sesión">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(233, 30, 99, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 1.8rem;
  background: #fff;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(233, 30, 99, 0.1);
}

.brand-name {
  font-weight: 800;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  font-size: 0.9rem;
  font-weight: 600;
  color: #880e4f;
  background: #fce4ec;
  padding: 6px 12px;
  border-radius: 20px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-icon-logout {
  background: white;
  border: 1px solid #fecdd3;
  color: #e91e63;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-logout:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0.8rem 1rem;
  }

  .brand-name {
    display: none;
  }

  .user-badge {
    max-width: 120px;
    font-size: 0.8rem;
    padding: 4px 10px;
  }
}
</style>
