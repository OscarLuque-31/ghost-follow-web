<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCurrentFollowers, type FollowerDto } from '@/composables/useCurrentFollowers'


const { followersList, isLoadingList, errorList, fetchFollowersList } = useCurrentFollowers()

const searchTerm = ref('')
const ITEMS_PER_PAGE = 20
const limit = ref(ITEMS_PER_PAGE)

// Cargar datos al montar
onMounted(() => {
  fetchFollowersList()
})

const displayedFollowers = computed(() => {
  let list = followersList.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    list = list.filter(f => f.name.toLowerCase().includes(term))
  }

  list.sort((a, b) => new Date(b.followDate).getTime() - new Date(a.followDate).getTime())

  return list.slice(0, limit.value)
})

const totalFiltered = computed(() => {
  if (!searchTerm.value) return followersList.value.length
  return followersList.value.filter(f => f.name.toLowerCase().includes(searchTerm.value.toLowerCase())).length
})

const loadMore = () => {
  limit.value += ITEMS_PER_PAGE
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
</script>

<template>
  <div class="list-view-container fade-in">
    <div class="header-section">
      <h2>👥 Tus Seguidores</h2>
      <p>Lista completa ordenada por antigüedad.</p>
    </div>

    <div v-if="isLoadingList" class="state-box">
      <span class="loader"></span> Cargando lista...
    </div>

    <div v-else-if="errorList" class="state-box error">
      {{ errorList }}
    </div>

    <div v-else class="content-box">

      <div class="search-bar">
        <span class="icon">🔍</span>
        <input v-model="searchTerm" type="text" placeholder="Buscar usuario...">
        <span class="count-badge">{{ totalFiltered }}</span>
      </div>

      <div class="followers-grid">
        <a v-for="follower in displayedFollowers" :key="follower.name" :href="follower.url" target="_blank"
          class="follower-card">
          <div class="avatar-placeholder">
            {{ follower.name.charAt(0).toUpperCase() }}
          </div>

          <div class="info">
            <span class="username">@{{ follower.name }}</span>
            <span class="date">Desde: {{ formatDate(follower.followDate) }}</span>
          </div>

          <div class="arrow-icon">↗</div>
        </a>
      </div>

      <div v-if="displayedFollowers.length < totalFiltered" class="load-more-area">
        <button @click="loadMore" class="btn-load-more">
          Ver más ({{ totalFiltered - displayedFollowers.length }} restantes)
        </button>
      </div>

      <div v-if="totalFiltered === 0 && followersList.length > 0" class="empty-search">
        No se encontraron usuarios con "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-view-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-section {
  text-align: center;
}

.header-section h2 {
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
  color: #2c3e50;
}

.header-section p {
  color: #64748b;
  font-size: 0.9rem;
}

.state-box {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  color: #64748b;
}

.state-box.error {
  color: #ef4444;
  background: #fef2f2;
}

/* Buscador */
.search-bar {
  position: relative;
  margin-bottom: 1rem;
  background: white;
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
}

.search-bar .icon {
  color: #94a3b8;
  margin-right: 8px;
}

.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.95rem;
  color: #334155;
}

.count-badge {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Grid de Tarjetas */
.followers-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.follower-card {
  background: white;
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
}

.follower-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.1);
  border-color: #fce7f3;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e91e63, #ff9a9e);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.username {
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.arrow-icon {
  color: #cbd5e1;
  font-size: 1.2rem;
}

.follower-card:hover .arrow-icon {
  color: #e91e63;
}

/* Botón Cargar Más */
.load-more-area {
  text-align: center;
  margin-top: 1rem;
}

.btn-load-more {
  background: white;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-load-more:hover {
  background: #f8fafc;
  color: #334155;
}

.empty-search {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.loader {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  border-top-color: #e91e63;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
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
