<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import TheNavbar from '@/components/TheNavbar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import FileUploader from '@/components/FileUploader.vue'
import StatsCards from '@/components/StatsCards.vue'
import FollowerLists from '@/components/FollowerLists.vue'

import { useLoadingMessages } from '@/composables/useLoadingMessages'
import { useFollowerAnalysis } from '@/composables/useFollowerAnalysis'

const router = useRouter()
const route = useRoute()

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
    currentAccountName.value = response.data
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
  } catch (e) {
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
    <TheNavbar :account-name="currentAccountName" @logout="logout" />

    <main class="main-content">
      <WelcomeBanner :visible="isFirstTime" />

      <FileUploader v-if="!showResults" :is-loading="isLoading" :loading-text="loadingText" :parent-message="apiError"
        @upload="handleUpload" />

      <div v-else class="results-dashboard fade-in">
        <button @click="resetAnalysis" class="btn-back">← Analizar otro archivo</button>

        <div v-if="analysisResults">
          <StatsCards :stats="analysisResults.stats" />

          <FollowerLists :new-followers="analysisResults.newFollowers" :lost-followers="analysisResults.lostFollowers"
            :lost-count="analysisResults.stats.lostCount" :gained-count="analysisResults.stats.gainedCount" />
        </div>
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
  justify-content: center;
  padding: 2rem;
}

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

.chart-container-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
