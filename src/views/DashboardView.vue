<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'

// Componentes Views
import Navbar from '@/components/dashboard/NavBar.vue'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import FileUploader from '@/components/dashboard/FileUploader.vue'
import StatsCards from '@/components/dashboard/StatsCards.vue'
import FollowerLists from '@/components/dashboard/FollowerLists.vue'
import AnalisysHistory from '@/components/dashboard/AnalysisHistory.vue'
import FollowersListView from '@/components/dashboard/FollowersListView.vue'
import RelationshipView from '@/components/dashboard/RelationshipView.vue'
import LockedFeature from '@/components/dashboard/LockedFeature.vue'
import PricingView from '@/components/dashboard/PricingView.vue'
import SettingsView from '@/components/dashboard/SettingsView.vue'

import { useLoadingMessages } from '@/composables/useLoadingMessages'
import { useFollowerAnalysis } from '@/composables/useFollowerAnalysis'

const router = useRouter()
const route = useRoute()
const { fetchUser, isPremium, user } = useUser()

const paywallContent = {
  relationships: {
    title: "¿Quién te ha traicionado? 💔",
    description: "Toma el control absoluto de tu cuenta. Descubre con exactitud quién dejó de seguirte a tus espaldas y quiénes son tus verdaderos admiradores.",
    features: [
      "Detecta al instante quiénes no te devuelven el follow",
      "Identifica a tus verdaderos Fans (te siguen fielmente, pero tú no a ellos).",
      "Detecta a tus seguidores Mutuals"
    ]
  },
  history: {
    title: "Tu evolución al detalle 📈",
    description: "El crecimiento no es casualidad. Analiza cómo evoluciona tu cuenta en el tiempo, entiende cuándo pierdes seguidores y qué días creces más.",
    features: [
      "Gráficas visuales e interactivas de tu crecimiento real.",
      "Comparativas detalladas mes a mes para detectar patrones.",
      "Registro histórico ilimitado: nunca pierdas los datos de un análisis previo."
    ]
  },
  list: {
    title: "Radiografía de tus seguidores 👥",
    description: "El nivel de detalle que la app oficial te oculta. Organiza, busca y entiende a tu audiencia como un verdadero profesional.",
    features: [
      "Revela la fecha exacta en la que cualquier usuario comenzó a seguirte.",
      "Buscador instantáneo para localizar a personas entre miles de seguidores.",
      "Segmentación experta mediante filtros por periodos de tiempo."
    ]
  }
}

const activeTab = ref<'analysis' | 'history' | 'list' | 'relationships' | 'pricing' | 'profile'>('analysis')
const isFirstTime = ref(route.query.welcome === 'true')

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

const switchTab = (tab: any) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="dashboard-container" v-if="user">

    <Navbar @navigate="switchTab" />

    <main class="main-content">

      <div class="tabs-container fade-in">
        <button class="tab-btn" :class="{ active: activeTab === 'analysis' }" @click="switchTab('analysis')">
          <span class="tab-emoji">🔍</span> <span class="tab-text">Analizador</span>
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'relationships' }" @click="switchTab('relationships')">
          <span v-if="!isPremium" class="lock-icon">🔒</span>
          <span v-else class="tab-emoji">💞</span> <span class="tab-text">Relaciones</span>
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="switchTab('history')">
          <span v-if="!isPremium" class="lock-icon">🔒</span>
          <span v-else class="tab-emoji">📈</span> <span class="tab-text">Historial</span>
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'list' }" @click="switchTab('list')">
          <span v-if="!isPremium" class="lock-icon">🔒</span>
          <span v-else class="tab-emoji">👥</span> <span class="tab-text">Seguidores</span>
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
        <LockedFeature v-else :title="paywallContent.relationships.title"
          :description="paywallContent.relationships.description" :features="paywallContent.relationships.features"
          @open-pricing="switchTab('pricing')" />
      </div>

      <div v-else-if="activeTab === 'history'" class="view-wrapper">
        <AnalisysHistory v-if="isPremium" :account-name="user.instagramUserName" />
        <LockedFeature v-else :title="paywallContent.history.title" :description="paywallContent.history.description"
          :features="paywallContent.history.features" @open-pricing="switchTab('pricing')" />
      </div>

      <div v-else-if="activeTab === 'list'" class="view-wrapper">
        <FollowersListView v-if="isPremium" />
        <LockedFeature v-else :title="paywallContent.list.title" :description="paywallContent.list.description"
          :features="paywallContent.list.features" @open-pricing="switchTab('pricing')" />
      </div>

      <div v-else-if="activeTab === 'pricing'" class="view-wrapper fade-in">
        <PricingView />
      </div>

      <div v-else-if="activeTab === 'profile'" class="view-wrapper fade-in">
        <SettingsView @navigate-pricing="switchTab('pricing')" />
      </div>

    </main>
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
  /* Permite que bajen de línea si no caben */
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: fit-content;
  /* En escritorio se ajusta al contenido */
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

.tab-emoji,
.lock-icon {
  font-size: 1.1em;
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

/* ========================================= */
/* 📱 MOBILE OPTIMIZATIONS (LA MAGIA AQUÍ)   */
/* ========================================= */
@media (max-width: 650px) {
  .main-content {
    padding: 1.5rem 1rem;
  }

  .tabs-container {
    max-width: 100%;
    /* Convertimos el contenedor en una cuadrícula perfecta de 2x2 */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 8px;
    border-radius: 16px;
  }

  .tab-btn {
    width: 100%;
    padding: 12px 8px;
    font-size: 0.85rem;
    flex-direction: column;
    /* Ponemos el icono arriba y el texto abajo */
    gap: 4px;
    text-align: center;
  }

  .tab-emoji,
  .lock-icon {
    font-size: 1.3em;
    /* Iconos un poco más grandes en móvil */
  }

  .results-dashboard {
    width: 100%;
  }
}
</style>
