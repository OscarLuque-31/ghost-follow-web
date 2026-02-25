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

    // Si la subida fue un éxito, volvemos a pedir los datos del usuario.
    // Esto actualizará "hasInitialData" a true en el composable, quitando el muro.
    await fetchUser()

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

      <div v-if="!user.hasInitialData" class="onboarding-wall fade-in-up">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <h2>¡Hola, @{{ user.instagramUserName }}! 👋</h2>
            <p>Tu cuenta está lista. Para encender el panel y ver tus métricas, necesitamos que subas tu primer archivo
              de datos de Instagram.</p>
          </div>

          <FileUploader :is-loading="isLoading" :loading-text="loadingText" :parent-message="apiError"
            @upload="handleUpload" />
        </div>
      </div>

      <div v-else class="dashboard-core fade-in">

        <div class="tabs-container">
          <button class="tab-btn" :class="{ active: activeTab === 'analysis' }" @click="switchTab('analysis')">
            <span class="tab-emoji">🔍</span> <span class="tab-text">Analizador</span>
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'relationships' }"
            @click="switchTab('relationships')">
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
          <FileUploader v-if="!showResults" :is-loading="isLoading" :loading-text="loadingText"
            :parent-message="apiError" @upload="handleUpload" />
          <div v-else class="results-dashboard fade-in">
            <button @click="resetAnalysis" class="btn-back">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="back-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Analizar otro archivo
            </button>
            <div v-if="analysisResults" class="analysis-content">
              <StatsCards :stats="analysisResults.stats" />
              <FollowerLists :new-followers="analysisResults.newFollowers"
                :lost-followers="analysisResults.lostFollowers" :lost-count="analysisResults.stats.lostCount"
                :gained-count="analysisResults.stats.gainedCount" />
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

      </div>

    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.dashboard-container {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #fce4ec;
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

.dashboard-core {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========================================= */
/* ESTILOS DEL MURO DE ONBOARDING            */
/* ========================================= */
.onboarding-wall {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 60vh;
  padding-top: 2rem;
}

.onboarding-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px -10px rgba(233, 30, 99, 0.15);
  text-align: center;
}

.onboarding-header h2 {
  color: #831843;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 800;
}

.onboarding-header p {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.5;
  margin-bottom: 30px;
}

/* ========================================= */
/* ESTILOS DE TABS Y VISTAS NORMALES         */
/* ========================================= */

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
  width: 100%;
  max-width: fit-content;
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
  transition: color 0.2s;
  /* Nuevo para el SVG */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
}

.btn-back:hover {
  color: #e91e63;
}

.back-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s;
}

.btn-back:hover .back-icon {
  transform: translateX(-4px);
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========================================= */
/* 📱 MOBILE OPTIMIZATIONS                   */
/* ========================================= */
@media (max-width: 650px) {
  .main-content {
    padding: 1.5rem 1rem;
  }

  .onboarding-card {
    padding: 30px 20px;
  }

  .onboarding-header h2 {
    font-size: 1.5rem;
  }

  .tabs-container {
    max-width: 100%;
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
    gap: 4px;
    text-align: center;
  }

  .tab-emoji,
  .lock-icon {
    font-size: 1.3em;
  }

  .results-dashboard {
    width: 100%;
  }
}
</style>
