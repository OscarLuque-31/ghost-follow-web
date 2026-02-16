<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'

import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import FileUploader from '@/components/dashboard/FileUploader.vue'
import StatsCards from '@/components/dashboard/StatsCards.vue'
import FollowerLists from '@/components/dashboard/FollowerLists.vue'
import Navbar from '@/components/dashboard/NavBar.vue'
import AnalisysHistory from '@/components/dashboard/AnalysisHistory.vue'
import FollowersListView from '@/components/dashboard/FollowersListView.vue'
import RelationshipView from '@/components/dashboard/RelationshipView.vue'

import LockedFeature from '@/components/dashboard/LockedFeature.vue'
import PricingModal from '@/components/dashboard/PricingModal.vue'

import { useLoadingMessages } from '@/composables/useLoadingMessages'
import { useFollowerAnalysis } from '@/composables/useFollowerAnalysis'

const router = useRouter()
const route = useRoute()
const { fetchUser, isPremium, user } = useUser()

const activeTab = ref<'analysis' | 'history' | 'list' | 'relationships'>('analysis')
const isFirstTime = ref(route.query.welcome === 'true')

const showPricing = ref(false)

const { loadingText, startLoadingMessages, stopLoadingMessages } = useLoadingMessages()
const { analysisResults, isLoading, showResults, apiError, uploadAnalysis, resetAnalysis } = useFollowerAnalysis()

onMounted(async () => {
  if (route.query.welcome) {
    const newQuery = { ...route.query }
    delete newQuery.welcome
    router.replace({ query: newQuery })
  }
  await fetchUser()
})

const handleUpload = async (file: File) => {
  startLoadingMessages()
  try {
    await uploadAnalysis(file, user.value?.instagramUserName || '')
  } finally {
    stopLoadingMessages()
  }
}

const switchTab = (tab: typeof activeTab.value) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="dashboard-container" v-if="user">
    <Navbar />

    <main class="main-content">

      <div class="tabs-container fade-in">
        <button class="tab-btn" :class="{ active: activeTab === 'analysis' }" @click="switchTab('analysis')">
          🔍 Analizador
        </button>

        <button class="tab-btn" :class="{ active: activeTab === 'relationships' }" @click="switchTab('relationships')">
          <span v-if="!isPremium" class="lock-icon">🔒</span> 💞 Relaciones
        </button>

        <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="switchTab('history')">
          <span v-if="!isPremium" class="lock-icon">🔒</span> 📈 Historial
        </button>

        <button class="tab-btn" :class="{ active: activeTab === 'list' }" @click="switchTab('list')">
          <span v-if="!isPremium" class="lock-icon">🔒</span> 👥 Seguidores
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

      <div v-else-if="activeTab === 'relationships'" class="view-wrapper fade-in">
        <RelationshipView v-if="isPremium" />
        <LockedFeature v-else title="¿Quién te ha traicionado?"
          description="Descubre quién dejó de seguirte y quiénes son tus verdaderos fans."
          :features="['Lista de Traidores (No te siguen de vuelta)', 'Lista de Fans (Te siguen, tú no)', 'Filtrado inteligente']"
          @open-pricing="showPricing = true" />
      </div>

      <div v-else-if="activeTab === 'history'" class="view-wrapper">
        <AnalisysHistory v-if="isPremium" :account-name="user.instagramUserName" />
        <LockedFeature v-else title="Tu historial completo"
          description="Viaja en el tiempo y mira cómo ha crecido tu cuenta mes a mes."
          :features="['Gráficas de crecimiento', 'Comparativa mes a mes', 'Histórico de unfollows']"
          @open-pricing="showPricing = true" />
      </div>

      <div v-else-if="activeTab === 'list'" class="view-wrapper">
        <FollowersListView v-if="isPremium" />
        <LockedFeature v-else title="Todos tus seguidores"
          description="Gestiona y busca entre todos tus seguidores de forma avanzada."
          :features="['Buscador avanzado', 'Filtros por fecha', 'Exportación de datos']"
          @open-pricing="showPricing = true" />
      </div>

    </main>

    <PricingModal v-if="showPricing" @close="showPricing = false" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.dashboard-container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #fdf2f8;
  background-image: radial-gradient(at 0% 0%, hsla(334, 97%, 92%, 1) 0, transparent 50%),
    radial-gradient(at 100% 100%, hsla(265, 100%, 93%, 1) 0, transparent 50%);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 100%;
}

.tabs-container {
  background: white;
  padding: 6px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  max-width: 100%;
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
  white-space: nowrap;
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
  max-width: 100%;
}

.results-dashboard {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
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
  .main-content {
    padding: 1rem 0.8rem;
  }

  .tabs-container {
    width: 100%;
    border-radius: 12px;
  }

  .tab-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 0.85rem;
    text-align: center;
  }

  .results-dashboard {
    width: 100%;
  }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  /* Para alinear el candado */
}

.tab-btn.locked {
  color: #94a3b8;
  /* Color grisáceo */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Efecto hover diferente para bloqueados */
.tab-btn.locked:hover {
  background: #f1f5f9;
  /* Gris claro, no el rosa de activado */
  color: #64748b;
  box-shadow: none;
}

.lock-icon {
  font-size: 0.9em;
}
</style>
