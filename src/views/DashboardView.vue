<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

// Componentes
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import FileUploader from '@/components/dashboard/FileUploader.vue'
import StatsCards from '@/components/dashboard/StatsCards.vue'
import FollowerLists from '@/components/dashboard/FollowerLists.vue'
import Navbar from '@/components/dashboard/NavBar.vue'
import AnalisysHistory from '@/components/dashboard/AnalysisHistory.vue'
import FollowersListView from '@/components/dashboard/FollowersListView.vue'

import { useLoadingMessages } from '@/composables/useLoadingMessages'
import { useFollowerAnalysis } from '@/composables/useFollowerAnalysis'

const router = useRouter()
const route = useRoute()

const activeTab = ref<'analysis' | 'history' | 'list'>('analysis')

const currentAccountName = ref('')
const isFirstTime = ref(route.query.welcome === 'true')

const { loadingText, startLoadingMessages, stopLoadingMessages } = useLoadingMessages()
const { analysisResults, isLoading, showResults, apiError, uploadAnalysis, resetAnalysis } = useFollowerAnalysis()

onMounted(async () => {
  if (route.query.welcome) {
    const newQuery = { ...route.query }
    delete newQuery.welcome
    router.replace({ query: newQuery })
  }

  try {
    const response = await api.get('/auth/me')
    currentAccountName.value = typeof response.data === 'string' ? response.data : response.data.username
  } catch (error) {
    console.error(error)
    localStorage.removeItem('jwt_token')
    router.push('/login')
  }
})

const handleUpload = async (file: File) => {
  startLoadingMessages()
  try {
    await uploadAnalysis(file, currentAccountName.value)
  } finally {
    stopLoadingMessages()
  }
}

const logout = () => {
  localStorage.removeItem('jwt_token')
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-container">
    <Navbar :account-name="currentAccountName" @logout="logout" />

    <main class="main-content">

      <div class="tabs-container fade-in">
        <button class="tab-btn" :class="{ active: activeTab === 'analysis' }" @click="activeTab = 'analysis'">
          🔍 Analizador
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
          📈 Historial
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
          👥 Seguidores
        </button>
      </div>

      <div v-if="activeTab === 'analysis'" class="view-wrapper">
        <WelcomeBanner :visible="isFirstTime" />

        <FileUploader v-if="!showResults" :is-loading="isLoading" :loading-text="loadingText" :parent-message="apiError"
          @upload="handleUpload" />

        <div v-else class="results-dashboard fade-in">
          <button @click="resetAnalysis" class="btn-back">← Analizar otro archivo</button>

          <div v-if="analysisResults" class="analysis-content">
            <StatsCards :stats="analysisResults.stats" />

            <FollowerLists :new-followers="analysisResults.newFollowers" :lost-followers="analysisResults.lostFollowers"
              :lost-count="analysisResults.stats.lostCount" :gained-count="analysisResults.stats.gainedCount" />
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'history'" class="view-wrapper">
        <AnalisysHistory :account-name="currentAccountName" />
      </div>

      <div v-else-if="activeTab === 'list'" class="view-wrapper">
        <FollowersListView />
      </div>

    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.dashboard-container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #fdf2f8;
  background-image: radial-gradient(at 0% 0%, hsla(334, 97%, 92%, 1) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(265, 100%, 93%, 1) 0, transparent 50%);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

/* --- ESTILOS DE TABS --- */
.tabs-container {
  background: white;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.tab-btn:hover {
  color: #e91e63;
  background: rgba(233, 30, 99, 0.05);
}

.tab-btn.active {
  background: #e91e63;
  color: white;
  box-shadow: 0 4px 6px rgba(233, 30, 99, 0.2);
}

.view-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ----------------------- */

.results-dashboard {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.btn-back {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
  margin-bottom: -1rem;
  font-size: 0.95rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
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

@media (max-width: 600px) {
  .dashboard-container {
    overflow-x: hidden;
  }
}
</style>
