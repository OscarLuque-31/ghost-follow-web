<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

interface UserSummary {
  name: string
  url: string
}

interface RelationshipResponse {
  traitors: UserSummary[]
  fans: UserSummary[]
  mutuals: UserSummary[]
}

const loading = ref(true)
const error = ref<string | null>(null)
const activeSubTab = ref<'traitors' | 'fans' | 'mutuals'>('traitors')

const data = ref<RelationshipResponse>({
  traitors: [],
  fans: [],
  mutuals: []
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get<RelationshipResponse>('/relationship')
    data.value = response.data
  } catch (err) {
    console.error(err)
    error.value = "No se pudieron cargar las relaciones. Intenta recargar la página."
  } finally {
    loading.value = false
  }
})

const currentList = computed(() => {
  if (activeSubTab.value === 'traitors') return data.value.traitors
  if (activeSubTab.value === 'fans') return data.value.fans
  if (activeSubTab.value === 'mutuals') return data.value.mutuals
  return []
})

const emptyStateMessage = computed(() => {
  if (activeSubTab.value === 'traitors') return '¡Genial! Nadie te ha traicionado (o no sigues a nadie).'
  if (activeSubTab.value === 'fans') return 'No tienes fans que no sigas de vuelta.'
  if (activeSubTab.value === 'mutuals') return 'No tienes seguidores en común.'
  return ''
})
</script>

<template>
  <div class="relationship-container fade-in">

    <div class="header-section">
      <h2 class="title">Análisis de Relaciones</h2>
      <p class="subtitle">Descubre quién no te sigue de vuelta y quiénes son tus verdaderos amigos.</p>

      <div class="sub-tabs">
        <button @click="activeSubTab = 'traitors'" class="sub-tab-btn"
          :class="{ 'active-red': activeSubTab === 'traitors' }">
          😡 Traidores <span class="badge">{{ data.traitors.length }}</span>
        </button>

        <button @click="activeSubTab = 'fans'" class="sub-tab-btn" :class="{ 'active-green': activeSubTab === 'fans' }">
          🤩 Fans <span class="badge">{{ data.fans.length }}</span>
        </button>

        <button @click="activeSubTab = 'mutuals'" class="sub-tab-btn"
          :class="{ 'active-blue': activeSubTab === 'mutuals' }">
          🤝 Mutuals <span class="badge">{{ data.mutuals.length }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Analizando conexiones...</p>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="content-area">

      <div v-if="currentList.length > 0" class="users-grid">
        <div v-for="user in currentList" :key="user.name" class="user-card">

          <div class="card-left">
            <div class="avatar" :class="activeSubTab">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="user-info">
              <span class="username" :title="user.name">{{ user.name }}</span>
              <span class="status-text" v-if="activeSubTab === 'traitors'">No te sigue</span>
              <span class="status-text" v-else-if="activeSubTab === 'fans'">Te sigue</span>
              <span class="status-text" v-else>Amigos</span>
            </div>
          </div>

          <a :href="user.url" target="_blank" class="profile-link" title="Ver en Instagram">
            ↗
          </a>

        </div>
      </div>

      <div v-else class="empty-state">
        <div class="emoji-large">🎉</div>
        <p>{{ emptyStateMessage }}</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.relationship-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

/* --- SUB TABS STYLES --- */
.sub-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.sub-tab-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 50px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.sub-tab-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.badge {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
}

/* Colores Activos */
.sub-tab-btn.active-red {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.sub-tab-btn.active-red .badge {
  background: #fee2e2;
  color: #b91c1c;
}

.sub-tab-btn.active-green {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.sub-tab-btn.active-green .badge {
  background: #dcfce7;
  color: #15803d;
}

.sub-tab-btn.active-blue {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.sub-tab-btn.active-blue .badge {
  background: #dbeafe;
  color: #1e40af;
}

/* --- GRID & CARDS --- */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  width: 100%;
}

.user-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.2s, box-shadow 0.2s;

  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
}

.card-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.avatar.traitors {
  background: #fee2e2;
  color: #ef4444;
}

.avatar.fans {
  background: #dcfce7;
  color: #22c55e;
}

.avatar.mutuals {
  background: #dbeafe;
  color: #3b82f6;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.username {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-text {
  font-size: 0.75rem;
  color: #94a3b8;
}

.profile-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
}

.profile-link:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* --- STATES --- */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.error-state {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.emoji-large {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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

/* ========================================= */
/* 📱 MOBILE OPTIMIZATIONS                   */
/* ========================================= */
@media (max-width: 600px) {
  .users-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .user-card {
    padding: 0.75rem;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .username {
    font-size: 0.9rem;
  }

  .sub-tabs {
    gap: 0.5rem;
  }

  .sub-tab-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>
