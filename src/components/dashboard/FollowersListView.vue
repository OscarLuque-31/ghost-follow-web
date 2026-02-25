<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCurrentFollowers, type FollowerDto } from '@/composables/useCurrentFollowers'

const { followersList, isLoadingList, errorList, fetchFollowersList } = useCurrentFollowers()

const searchTerm = ref('')
const ITEMS_PER_PAGE = 20
const limit = ref(ITEMS_PER_PAGE)

const filterDate = ref('')
const filterType = ref<'after' | 'before'>('after')

onMounted(() => {
  fetchFollowersList()
})

const allFilteredAndSorted = computed(() => {
  let list = [...followersList.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    list = list.filter(f => f.name.toLowerCase().includes(term))
  }

  if (filterDate.value) {
    const selectedDate = new Date(filterDate.value).getTime()

    list = list.filter(f => {
      const followerDate = new Date(f.followDate).getTime()

      if (filterType.value === 'after') {
        return followerDate >= selectedDate
      } else {
        return followerDate <= selectedDate
      }
    })
  }

  list.sort((a, b) => new Date(b.followDate).getTime() - new Date(a.followDate).getTime())

  return list
})

const displayedFollowers = computed(() => {
  return allFilteredAndSorted.value.slice(0, limit.value)
})

const totalFiltered = computed(() => {
  return allFilteredAndSorted.value.length
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

const clearDateFilter = () => {
  filterDate.value = ''
}
</script>

<template>
  <div class="list-view-container fade-in">
    <div class="header-section">
      <div class="title-wrapper">
        <h2>Tus Seguidores</h2>
        <span class="total-badge" v-if="!isLoadingList">{{ followersList.length }}</span>
      </div>
      <p>Explora y filtra tu lista completa ordenada por antigüedad.</p>
    </div>

    <div v-if="isLoadingList" class="state-box">
      <span class="loader"></span>
      <p>Cargando lista...</p>
    </div>

    <div v-else-if="errorList" class="state-box error">
      <span class="error-icon">⚠️</span>
      <p>{{ errorList }}</p>
    </div>

    <div v-else class="content-box">

      <div class="filters-container">

        <div class="filters-top-row">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input v-model="searchTerm" type="text" placeholder="Buscar usuario por nombre...">
          </div>
          <div class="count-badge" v-if="searchTerm || filterDate">
            <span>{{ totalFiltered }} resultados</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="date-filter-row">
          <div class="date-controls">
            <span class="filter-icon">📅</span>
            <select v-model="filterType" class="filter-select">
              <option value="after">Desde el</option>
              <option value="before">Antes del</option>
            </select>
            <input type="date" v-model="filterDate" class="date-input">
          </div>

          <button v-if="filterDate" @click="clearDateFilter" class="btn-clear fade-in" title="Limpiar filtro de fecha">
            <span class="clear-icon">✕</span> Limpiar
          </button>
        </div>
      </div>

      <div class="followers-grid">
        <a v-for="follower in displayedFollowers" :key="follower.name" :href="follower.url" target="_blank"
          class="follower-card">
          <div class="avatar-placeholder">
            {{ follower.name.charAt(0).toUpperCase() }}
          </div>

          <div class="info">
            <span class="username">@{{ follower.name }}</span>
            <span class="date">Te sigue desde: <strong>{{ formatDate(follower.followDate) }}</strong></span>
          </div>

          <div class="action-icon">
            <span class="arrow">↗</span>
          </div>
        </a>
      </div>

      <div v-if="displayedFollowers.length < totalFiltered" class="load-more-area">
        <button @click="loadMore" class="btn-load-more">
          Mostrar más ({{ totalFiltered - displayedFollowers.length }})
        </button>
      </div>

      <div v-if="totalFiltered === 0 && followersList.length > 0" class="empty-state fade-in">
        <div class="empty-icon">👻</div>
        <h3>Sin resultados</h3>
        <p>No encontramos a nadie que coincida con tus filtros actuales.</p>
        <button @click="searchTerm = ''; clearDateFilter()" class="btn-reset">
          Restablecer filtros
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.list-view-container {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* CABECERA */
.header-section {
  text-align: center;
  margin-bottom: 0.5rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0.5rem;
}

.header-section h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.total-badge {
  background: #fce7f3;
  color: #e91e63;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
}

.header-section p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* CAJAS DE ESTADO (Carga y Error) */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  color: #64748b;
  font-weight: 500;
}

.state-box.error {
  color: #ef4444;
  background: #fff1f2;
  border-color: #fecdd3;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* PANEL DE FILTROS (REDISEÑO) */
.filters-container {
  background: white;
  padding: 1.2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* BARRA DE BÚSQUEDA INTERACTIVA */
.search-bar {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  flex: 1;
  transition: all 0.3s ease;
}

/* Magia CSS: Si el input está enfocado, brillamos todo el contenedor */
.search-bar:focus-within {
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
  background: white;
}

.search-icon {
  color: #94a3b8;
  margin-right: 10px;
  font-size: 1.1rem;
}

.search-bar:focus-within .search-icon {
  color: #e91e63;
}

.search-bar input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 500;
}

.search-bar input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* BADGE DE RESULTADOS */
.count-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid #e2e8f0;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  width: 100%;
}

/* FILTROS DE FECHA */
.date-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.date-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-icon {
  color: #94a3b8;
  font-size: 1.1rem;
}

.filter-select,
.date-input {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  outline: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: inherit;
}

.filter-select:focus,
.date-input:focus {
  border-color: #94a3b8;
}

.btn-clear {
  background: #fff1f2;
  color: #e91e63;
  border: 1px solid #fce7f3;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #e91e63;
  color: white;
}

/* TARJETAS DE SEGUIDORES */
.followers-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.follower-card {
  background: white;
  padding: 14px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
}

.follower-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(233, 30, 99, 0.08);
  border-color: #fbcfe8;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e91e63, #ff9a9e);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  gap: 2px;
}

.username {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  font-size: 0.8rem;
  color: #64748b;
}

.date strong {
  color: #475569;
  font-weight: 600;
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.arrow {
  color: #94a3b8;
  font-size: 1.1rem;
  transition: transform 0.2s, color 0.2s;
}

.follower-card:hover .action-icon {
  background: #fff1f2;
}

.follower-card:hover .arrow {
  color: #e91e63;
  transform: translate(2px, -2px);
  /* Pequeño salto hacia arriba a la derecha */
}

/* BOTÓN CARGAR MÁS */
.load-more-area {
  text-align: center;
  margin-top: 0.5rem;
}

.btn-load-more {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.btn-load-more:hover {
  background: #f8fafc;
  color: #1e293b;
  border-color: #94a3b8;
  transform: translateY(-1px);
}

/* ESTADO VACÍO (BÚSQUEDA) */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 20px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-state h3 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.btn-reset {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-reset:hover {
  background: #e2e8f0;
}

/* SPINNER CARGA */
.loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #f1f5f9;
  border-radius: 50%;
  border-top-color: #e91e63;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
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

/* MOBILE OPTIMIZATIONS */
@media (max-width: 600px) {
  .filters-top-row {
    flex-direction: column;
    align-items: stretch;
  }

  .count-badge {
    text-align: center;
  }

  .date-filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .date-controls {
    flex: 1;
    display: flex;
  }

  .filter-select,
  .date-input {
    flex: 1;
  }
}
</style>
