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

      <div class="tabs-scroll-wrapper fade-in">
        <div class="tabs-container">
          <button class="tab-btn" :class="{ active: activeTab === 'analysis' }" @click="switchTab('analysis')">
            <span class="tab-emoji">🔍</span> Analizador
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'relationships' }"
            @click="switchTab('relationships')">
            <span v-if="!isPremium" class="lock-icon">🔒</span>
            <span v-else class="tab-emoji">💞</span> Relaciones
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="switchTab('history')">
            <span v-if="!isPremium" class="lock-icon">🔒</span>
            <span v-else class="tab-emoji">📈</span> Historial
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'list' }" @click="switchTab('list')">
            <span v-if="!isPremium" class="lock-icon">🔒</span>
            <span v-else class="tab-emoji">👥</span> Seguidores
          </button>
        </div>
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

/* NUEVO: Wrapper para el scroll horizontal en móviles */
.tabs-scroll-wrapper {
  width: 100%;
  max-width: 900px;
  /* Ancho máximo para que no sea enorme en escritorio */
  margin-bottom: 2rem;
  overflow-x: auto;
  /* Permite deslizar si no cabe */
  -webkit-overflow-scrolling: touch;
  /* Deslizamiento suave en iOS */
  padding-bottom: 5px;
  /* Espacio para que no se corte la sombra */

  /* Ocultar la barra de scroll para que quede más limpio */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE y Edge */
}

.tabs-scroll-wrapper::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari y Opera */
}

.tabs-container {
  background: white;
  padding: 8px;
  border-radius: 18px;
  display: inline-flex;
  /* Cambiado a inline-flex para no ocupar todo el ancho si no hace falta */
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.8);
  min-width: max-content;
  /* Fuerza a que los botones mantengan su tamaño original */
  margin: 0 auto;
  /* Centrar el bloque entero si hay espacio de sobra */
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  white-space: nowrap;
  /* Impide que el texto se rompa en dos líneas */
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #e91e63;
  background: #fdf2f8;
}

.tab-btn.active {
  background: #e91e63;
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  transform: translateY(-1px);
}

/* Iconos de las pestañas */
.tab-emoji {
  font-size: 1.1em;
  opacity: 0.9;
}

.lock-icon {
  font-size: 1em;
  opacity: 0.8;
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
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 12px;
  color: #475569;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.btn-back:hover {
  background: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================= */
/* 📱 MOBILE OPTIMIZATIONS                   */
/* ========================================= */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem 1rem;
  }

  /* Ajuste crucial para móvil */
  .tabs-scroll-wrapper {
    margin-bottom: 1.5rem;
    padding-left: 2px;
    padding-right: 2px;

    /* Pequeño truco para centrar visualmente el menú si el usuario no ha scrolleado */
    display: flex;
    justify-content: flex-start;
  }

  .tabs-container {
    padding: 6px;
    border-radius: 16px;
    margin: 0;
    /* Anula el auto margin en móvil para permitir el scroll desde el inicio */
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .results-dashboard {
    width: 100%;
  }
}
</style>
